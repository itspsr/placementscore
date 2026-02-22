import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return null;
  return createClient(url, key);
};

export async function POST(req: Request) {
  try {
    const { userId, role, company, experience } = await req.json();

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    // Verify Subscription
    if (userId !== "admin@placementscore.online") {
        const supabase = getSupabase();
        if (!supabase) {
          console.warn("Supabase not configured; denying expert access in safe mode.");
          return NextResponse.json({ error: "Expert Subscription Required" }, { status: 403 });
        }
        const { data: sub, error } = await supabase
            .from('subscriptions')
            .select('status, plan')
            .eq('email', userId)
            .eq('status', 'active')
            .single();

        if (error || !sub || sub.plan !== 'expert') {
             return NextResponse.json({ error: "Expert Subscription Required" }, { status: 403 });
        }
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing; AI disabled.");
      return NextResponse.json({ message: "AI disabled" }, { status: 200 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a highly professional and ATS-friendly cover letter for a ${role} position at ${company}. 
    Experience Level: ${experience}. 
    Focus on quantified achievements and technical alignment. 
    Keep it under 300 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fullText = response.text();

    return NextResponse.json({
      success: true,
      coverLetter: fullText,
      role,
      company
    });

  } catch (error) {
    console.error("Cover Letter Error:", error);
    return NextResponse.json({ error: "Failed to generate cover letter. Please try again later." }, { status: 500 });
  }
}
