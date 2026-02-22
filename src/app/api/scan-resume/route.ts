import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REQUIRED_KEYWORDS = ["experience", "education", "skills", "project", "internship"];

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
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, message: 'Only PDF files are allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File too large (max 5MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let text = '';
    try {
      const data = await pdf(buffer);
      text = data.text || '';
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Unreadable PDF. Please upload a text-based PDF.' }, { status: 422 });
    }

    const cleanText = text.trim();
    if (cleanText.length < 300) {
      return NextResponse.json({ success: false, message: 'Invalid or empty resume detected.' }, { status: 422 });
    }

    const lower = cleanText.toLowerCase();
    const hits = REQUIRED_KEYWORDS.filter(k => lower.includes(k)).length;
    if (hits < 3) {
      return NextResponse.json({ success: false, message: 'Invalid or empty resume detected.' }, { status: 422 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, message: 'AI disabled' }, { status: 200 });
    }

    const analysis = await callOpenAIResumeAnalysis(cleanText);

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('resume_reports').insert({
        user_id: userId,
        ats_score: analysis.ats_score,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missing_keywords: analysis.missing_keywords,
        improvements: analysis.improvements,
        raw_text: cleanText.slice(0, 5000),
        created_at: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true, analysis });

  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || 'Server error' }, { status: 500 });
  }
}

async function callOpenAIResumeAnalysis(text: string) {
  const prompt = `You are an ATS resume evaluator. Return JSON only with: {"score":0-100,"strengths":[],"weaknesses":[],"improvements":[],"ats_score":0-100}.
Resume:\n${text.slice(0, 3000)}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 700,
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
  return content ? JSON.parse(content) : { score: 0, strengths: [], weaknesses: [], improvements: [], ats_score: 0 };
}
