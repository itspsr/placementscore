import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REQUIRED_KEYWORDS = ["experience", "education", "skills", "project", "internship"];

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

    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) {
      return NextResponse.json({ success: false, message: 'AI disabled' }, { status: 200 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    if (Buffer.byteLength(base64, 'utf8') > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File too large (base64 > 5MB)' }, { status: 400 });
    }

    const extracted = await extractAndAnalyze(base64);
    if (!extracted.valid) {
      return NextResponse.json({ success: false, message: 'Invalid or empty resume detected.' }, { status: 422 });
    }

    const cleanText = (extracted.text || '').trim();
    const lower = cleanText.toLowerCase();
    const hits = REQUIRED_KEYWORDS.filter(k => lower.includes(k)).length;
    if (cleanText.length < 300 || hits < 3) {
      return NextResponse.json({ success: false, message: 'Invalid or empty resume detected.' }, { status: 422 });
    }

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch {
      supabase = null;
    }

    if (supabase) {
      await supabase.from('resume_reports').insert({
        user_id: null,
        ats_score: extracted.ats_score,
        strengths: extracted.strengths,
        weaknesses: extracted.weaknesses,
        missing_keywords: extracted.missing_keywords || [],
        improvements: extracted.improvements,
        raw_text: cleanText.slice(0, 5000),
        created_at: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true, analysis: {
      score: extracted.score,
      ats_score: extracted.ats_score,
      strengths: extracted.strengths,
      weaknesses: extracted.weaknesses,
      improvements: extracted.improvements
    }});

  } catch (e: any) {
    console.error('scan-resume error:', e);
    const msg = e?.message?.includes('OpenAI error')
      ? 'AI processing failed. Check OPENAI_API_KEY and model access.'
      : (e.message || 'Server error');
    return NextResponse.json({ success: false, message: msg }, { status: 502 });
  }
}

async function extractAndAnalyze(base64: string) {
  const prompt = `Extract resume text from base64 PDF and score it. Return JSON only: {"valid":true,"text":"","score":0-100,"ats_score":0-100,"strengths":[],"weaknesses":[],"improvements":[]}. If not a resume, return {"valid":false}.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL,
      temperature: 0.2,
      max_tokens: 600,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Return JSON only.' },
        { role: 'user', content: `${prompt}\nPDF_BASE64:\n${base64}` }
      ]
    })
  });

  const raw = await res.text();
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${raw}`);
  const data = JSON.parse(raw);
  const content = data?.choices?.[0]?.message?.content;
  const parsed = content ? JSON.parse(content) : {};

  return {
    valid: parsed.valid !== false,
    text: parsed.text || '',
    score: parsed.score || 0,
    ats_score: parsed.ats_score || 0,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    missing_keywords: Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : []
  };
}
