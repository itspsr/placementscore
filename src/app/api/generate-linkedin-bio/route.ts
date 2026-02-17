
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, resumeText, targetRole } = await req.json();

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    // Verify Subscription
    if (userId !== "admin@placementscore.online") {
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

    // Generate Bio
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
