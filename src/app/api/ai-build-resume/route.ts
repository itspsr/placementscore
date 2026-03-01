import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 3600 * 1000; // 1 hour
const MAX_REQUESTS = 10;

function checkRateLimit(identifier: string) {
  const now = Date.now();
  const userData = rateLimitMap.get(identifier) || { count: 0, lastReset: now };

  if (now - userData.lastReset > RATE_LIMIT_WINDOW) {
    userData.count = 0;
    userData.lastReset = now;
  }

  if (userData.count >= MAX_REQUESTS) {
    return false;
  }

  userData.count++;
  rateLimitMap.set(identifier, userData);
  return true;
}

function trimText(text: string) {
  return text.replace(/\s+/g, " ").slice(0, 6000);
}

export async function POST(req: Request) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return new Response(
        JSON.stringify({ success: false, reason: "missing-env" }),
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    const body = await req.json();
    const { userId, originalResumeText, targetRole, experienceLevel, keySkills } = body;

    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(userId || ip)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in an hour." }, { status: 429 });
    }

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const { data: sub } = await supabase
        .from('subscriptions')
        .select('status, plan')
        .eq('email', userId)
        .eq('status', 'active')
        .single();

    if (!sub || sub.plan !== 'ELITE') {
         return NextResponse.json({ error: "Access Denied. Active ELITE Subscription Required." }, { status: 403 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return NextResponse.json({ error: "AI service configuration error" }, { status: 500 });
    }

    const cleanResume = trimText(originalResumeText);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "google/gemini-flash-lite-latest" });

      const prompt = `
  You are a professional ATS resume optimization engine used by top MNC recruiters.

  Rewrite the following resume to maximize ATS compatibility.

  Requirements:
  - Use quantified achievements (%, ₹, numbers)
  - Use strong action verbs
  - Optimize keyword density for the target role
  - Maintain clean ATS-friendly formatting
  - Avoid tables or columns
  - Keep sections clearly labeled

  Target Role: ${targetRole}
  Experience Level: ${experienceLevel}
  Key Skills to emphasize: ${keySkills}

  Resume:
  ${cleanResume}

  Return exactly in the following JSON format:
  {
    "optimizedResumeText": "The full text of the optimized resume",
    "suggestedImprovements": ["improvement 1", "improvement 2"],
    "atsScoreEstimate": 95
  }

  Return JSON only. No markdown formatting like \`\`\`json.
  `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 600,
          topP: 0.9
        }
      });

      const response = await result.response;
      const text = response.text();
      const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const resultJson = JSON.parse(jsonString);

      return NextResponse.json({ 
        success: true, 
        ...resultJson,
        message: "Your ATS-Optimized Resume is Ready 🚀"
      });
    } catch (e: any) {
      console.error("AI Build Resume Gemini Error:", e);
      const errText = String(e).toLowerCase();
      if (errText.includes("rate limit") || errText.includes("quota") || errText.includes("429")) {
        return NextResponse.json({ success: false, reason: "ai-rate-limit" }, { status: 200 });
      }
      throw e;
    }

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json({ error: "AI resume generation temporarily unavailable. Please try again." }, { status: 500 });
  }
}
