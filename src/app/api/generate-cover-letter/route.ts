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

    const { userId, role, company, experience } = await req.json();

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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI configuration missing." }, { status: 500 });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "google/gemini-flash-lite-latest" });

      const prompt = `Write a highly professional and ATS-friendly cover letter for a ${role} position at ${company}. 
      Experience Level: ${experience}. 
      Focus on quantified achievements and technical alignment. 
      Keep it under 300 words. Respond with plain text.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 600,
          topP: 0.9
        }
      });

      const response = await result.response;
      const fullText = response.text();

      return NextResponse.json({
        success: true,
        coverLetter: fullText,
        role,
        company
      });
    } catch (e: any) {
      console.error("Cover Letter Gemini Error:", e);
      const errText = String(e).toLowerCase();
      if (errText.includes("rate limit") || errText.includes("quota") || errText.includes("429")) {
        return NextResponse.json({ success: false, reason: "ai-rate-limit" }, { status: 200 });
      }
      throw e;
    }

  } catch (error) {
    console.error("Cover Letter Error:", error);
    return NextResponse.json({ error: "Failed to generate cover letter. Please try again later." }, { status: 500 });
  }
}
