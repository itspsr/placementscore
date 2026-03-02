import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

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

    const { userId, resumeText, targetRole } = await req.json();

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const { data: sub } = await supabase
        .from('subscriptions')
        .select('status, plan')
        .eq('email', userId)
        .eq('status', 'active')
        .single();

    if (!sub || sub.plan !== 'ELITE') {
         return NextResponse.json({ 
           success: false, 
           error: "ELITE Subscription Required for AI Features" 
         }, { status: 403 });
    }

    if (!resumeText) return NextResponse.json({ error: "Resume content required" }, { status: 400 });

    const cleanText = trimText(resumeText);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "google/gemini-flash-lite-latest" });
      const prompt = `
        Write a compelling LinkedIn About section (Bio) for a ${targetRole || 'professional'} based on this resume content:
        "${cleanText}"
        
        Tone: Professional yet engaging, high-impact, suitable for recruiters.
        Structure:
        - Hook (2 sentences)
        - Core Competencies (bullet points)
        - Call to Action
        
        Return JSON: { "bio": "string" }
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
      const json = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());

      return NextResponse.json({ success: true, bio: json.bio });
    } catch (e: any) {
      console.error("LinkedIn Gen Gemini Error:", e);
      const errText = String(e).toLowerCase();
      if (errText.includes("rate limit") || errText.includes("quota") || errText.includes("429")) {
        return NextResponse.json({ success: false, reason: "ai-rate-limit" }, { status: 200 });
      }
      throw e;
    }

  } catch (error: any) {
    console.error("LinkedIn Gen Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
