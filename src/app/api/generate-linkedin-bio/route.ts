
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
    const { userId, resumeText, targetRole } = await req.json();

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

    if (!resumeText) return NextResponse.json({ error: "Resume content required" }, { status: 400 });

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing; AI disabled.");
      return NextResponse.json({ message: "AI disabled" }, { status: 200 });
    }

    // Generate Bio
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Write a compelling LinkedIn About section (Bio) for a ${targetRole || 'professional'} based on this resume content:
      "${resumeText.slice(0, 3000)}"
      
      Tone: Professional yet engaging, high-impact, suitable for recruiters.
      Structure:
      - Hook (2 sentences)
      - Core Competencies (bullet points)
      - Call to Action
      
      Return JSON: { "bio": "string" }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const json = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());

    return NextResponse.json({ success: true, bio: json.bio });

  } catch (error: any) {
    console.error("LinkedIn Gen Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
