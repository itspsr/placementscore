import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REQUIRED_KEYWORDS = ["experience", "education", "skills", "project", "internship"];

export async function POST(req: Request) {
  try {
    const supabaseAuth = createRouteHandlerClient(
      { cookies },
      {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE
      }
    );
    const { data: authData } = await supabaseAuth.auth.getUser();
    let user = authData?.user;
    if (!user) {
      const authHeader = req.headers.get('authorization') || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      if (token) {
        const admin = getSupabaseAdmin();
        const { data: tokenUser } = await admin.auth.getUser(token);
        user = tokenUser?.user || null;
      }
    }
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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

    const supabase = getSupabaseAdmin();
    const { data: profile } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    const plan = profile?.plan || 'free';

    if (plan !== 'pro') {
      const text = extractBasicText(buffer);
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const hasSkills = /(sql|python|excel|react|java)/i.test(text);
      const hasExperience = /(experience|intern|worked)/i.test(text);
      let score = 40;
      if (wordCount > 250) score += 5;
      if (hasSkills) score += 10;
      if (hasExperience) score += 5;
      score = Math.min(score, 60);

      return NextResponse.json({
        success: true,
        plan: 'free',
        score,
        locked: true,
        message: 'Upgrade to Pro to unlock AI optimization.'
      });
    }

    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) {
      return NextResponse.json({ success: false, error: 'AI disabled' }, { status: 200 });
    }

    const rawText = extractBasicText(buffer);
    const cleanText = trimResumeText(rawText);
    if (!cleanText) {
      return NextResponse.json({ success: false, error: 'Invalid or empty resume detected.' }, { status: 422 });
    }

    const extracted = await extractAndAnalyze(cleanText);
    if (!extracted.valid) {
      return NextResponse.json({ success: false, error: 'Invalid or empty resume detected.' }, { status: 422 });
    }

    const finalText = (extracted.text || cleanText || '').trim();
    const lower = finalText.toLowerCase();
    const hits = REQUIRED_KEYWORDS.filter(k => lower.includes(k)).length;
    if (finalText.length < 300 || hits < 3) {
      return NextResponse.json({ success: false, error: 'Invalid or empty resume detected.' }, { status: 422 });
    }

    const baseScore = extracted.score || 0;
    const finalScore = Math.min(95, Math.max(baseScore, 75));

    await supabase.from('resume_reports').insert({
      user_id: user.id,
      ats_score: finalScore,
      strengths: extracted.strengths,
      weaknesses: extracted.weaknesses,
      improvements: extracted.improvements,
      raw_text: finalText.slice(0, 5000),
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      plan: 'pro',
      score: finalScore,
      baseScore,
      locked: false,
      optimizedResume: extracted.optimized_resume,
      originalText: finalText
    });

  } catch (e: any) {
    console.error('scan-resume error:', e);
    const msg = e?.message?.includes('OpenAI error')
      ? 'AI processing failed. Check OPENAI_API_KEY and model access.'
      : (e.message || 'Server error');
    return NextResponse.json({ success: false, error: msg }, { status: 502 });
  }
}

function extractBasicText(buffer: Buffer) {
  const raw = buffer.toString('latin1');
  return raw.replace(/[^\x20-\x7E\n\r]/g, ' ');
}

function trimResumeText(text: string, maxChars = 8000) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  return normalized.slice(0, maxChars);
}

async function extractAndAnalyze(resumeText: string) {
  const prompt = 'Evaluate resume text and return JSON: {"valid":true,"text":"","score":0-100,"strengths":[],"weaknesses":[],"improvements":[],"optimized_resume":""}. If not a resume, return {"valid":false}.';

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL,
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Return JSON only.' },
        { role: 'user', content: `${prompt}\nResume text:\n${resumeText}` }
      ]
    })
  });

  const raw = await res.text();
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${raw}`);
  const data = safeJsonParse(raw);
  const content = data?.choices?.[0]?.message?.content;
  const parsed = content ? safeJsonParse(content) : null;

  if (!parsed || typeof parsed !== 'object') {
    return {
      valid: true,
      text: resumeText,
      score: 75,
      strengths: [],
      weaknesses: [],
      improvements: [],
      optimized_resume: ''
    };
  }

  return {
    valid: parsed.valid !== false,
    text: parsed.text || resumeText,
    score: parsed.score || 75,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    optimized_resume: parsed.optimized_resume || ''
  };
}

function safeJsonParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
