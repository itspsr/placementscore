import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF files are allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let text = '';
    try {
      const data = await pdf(buffer);
      text = data.text || '';
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Unreadable PDF. Please upload a text-based PDF.' }, { status: 422 });
    }

    if (text.trim().length < 300) {
      return NextResponse.json({ success: false, error: 'Resume text too short. Please upload a full resume.' }, { status: 422 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: 'AI disabled' }, { status: 200 });
    }

    const validation = await callOpenAIResumeCheck(text);
    if (!validation?.is_resume) {
      return NextResponse.json({ success: false, error: 'Uploaded file does not appear to be a resume.' }, { status: 400 });
    }

    const analysis = await callOpenAIResumeAnalysis(text);

    const supabase = getSupabase();
    if (supabase) {
      const userId = validation?.user_id || null;
      await supabase.from('resume_reports').insert({
        user_id: userId,
        ats_score: analysis.score,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missing_keywords: analysis.missing_keywords,
        suggestions: analysis.suggestions,
        raw_text: text.slice(0, 5000),
        created_at: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true, analysis });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

async function callOpenAIResumeCheck(text: string) {
  const prompt = `Decide if this text is a resume. Return JSON only: { "is_resume": boolean }\n\nText:\n${text.slice(0, 6000)}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 150,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Return JSON only.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const raw = await res.text();
  if (!res.ok) return null;
  const data = JSON.parse(raw);
  const content = data?.choices?.[0]?.message?.content;
  return content ? JSON.parse(content) : null;
}

async function callOpenAIResumeAnalysis(text: string) {
  const prompt = `Analyze this resume and return JSON only:\n{\n  "score": number,\n  "strengths": string[],\n  "weaknesses": string[],\n  "missing_keywords": string[],\n  "suggestions": string[]\n}\n\nResume:\n${text.slice(0, 8000)}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 800,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Return JSON only.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const raw = await res.text();
  if (!res.ok) throw new Error('OpenAI error');
  const data = JSON.parse(raw);
  const content = data?.choices?.[0]?.message?.content;
  return content ? JSON.parse(content) : { score: 0, strengths: [], weaknesses: [], missing_keywords: [], suggestions: [] };
}
