import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Simple In-Memory Rate Limiter (Note: Resets on Lambda cold start)
// For production, use Upstash Redis or similar persistent store.
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

    // 1. Validate plan === "expert"
    if (plan !== "expert" && plan !== "EXPERT") {
      return NextResponse.json({ error: "Upgrade to Expert Plan to use the AI Resume Builder" }, { status: 403 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return NextResponse.json({ error: "AI service configuration error" }, { status: 500 });
    }

    // 2. Call Gemini API
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
