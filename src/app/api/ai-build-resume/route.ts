import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

// Simple In-Memory Rate Limiter
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, plan, originalResumeText, targetRole, experienceLevel, keySkills } = body;

    // 0. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(userId || ip)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in an hour." }, { status: 429 });
    }

    // 1. Verify Expert Plan via Supabase
    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    // Allow admin bypass
    if (userId !== "admin@placementscore.online") {
        const supabase = getSupabase();
        if (!supabase) {
          console.warn("Supabase not configured; denying expert access in safe mode.");
          return NextResponse.json({ error: "Access Denied. Subscription check unavailable." }, { status: 403 });
        }
        const { data: sub, error } = await supabase
            .from('subscriptions')
            .select('status, plan')
            .eq('email', userId)
            .eq('status', 'active')
            .single();

        if (error || !sub || sub.plan !== 'expert') {
             return NextResponse.json({ error: "Access Denied. Active Expert Subscription Required." }, { status: 403 });
        }
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing; AI disabled.");
      return NextResponse.json({ message: "AI disabled" }, { status: 200 });
    }

    // 2. Call Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
${originalResumeText}

Return exactly in the following JSON format:
{
  "optimizedResumeText": "The full text of the optimized resume",
  "suggestedImprovements": ["improvement 1", "improvement 2"],
  "atsScoreEstimate": 95
}

Return JSON only. No markdown formatting like \`\`\`json.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up response in case Gemini adds markdown blocks
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const resultJson = JSON.parse(jsonString);

    // 3. (Mock) Database Store
    // In a real app, you'd call your DB client here
    console.log("Storing AI Generated Resume for User:", userId);
    /*
    await db.ai_generated_resumes.create({
      data: {
        user_id: userId,
        original_text: originalResumeText,
        optimized_text: resultJson.optimizedResumeText,
        target_role: targetRole,
        ats_score_estimate: resultJson.atsScoreEstimate
      }
    });
    */

    return NextResponse.json({ 
      success: true, 
      ...resultJson,
      message: "Your ATS-Optimized Resume is Ready 🚀"
    });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json({ error: "AI resume generation temporarily unavailable. Please try again." }, { status: 500 });
  }
}
