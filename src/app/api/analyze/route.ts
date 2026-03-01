import { NextResponse } from 'next/server';
import * as pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AIAnalysis = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  keyword_gaps: string[];
};

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

    const { authOptions } = await import("@/lib/auth");

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    let userPlan = "FREE";
    if (userEmail) {
      const { data } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("email", userEmail)
        .eq("status", "active")
        .single();
      if (data) userPlan = data.plan;
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let text = "";
    try {
      const data = await (pdfParse as any)(buffer);
      text = data.text || "";
    } catch (parseError) {
      console.error("PDF Parse Error:", parseError);
      return NextResponse.json({ 
        success: false, 
        error: "Unreadable PDF. Please ensure the file is not password protected or an image scan."
      }, { status: 422 });
    }

    const cleanText = trimText(text);

    if (cleanText.trim().length < 50) {
      return NextResponse.json({ 
        success: false, 
        error: "Resume too short or unreadable. Please upload a standard text-based PDF."
      }, { status: 422 });
    }

    if (userPlan !== "ELITE") {
      console.log(`Non-ELITE user (${userPlan}), using heuristic analysis.`);
      return heuristicAnalysis(cleanText);
    }

    try {
      const ai = await analyzeWithGemini(cleanText);

      if (!ai) return heuristicAnalysis(cleanText);

      return NextResponse.json({
        success: true,
        analysis: {
          score: ai.score,
          strengths: ai.strengths,
          weaknesses: ai.weaknesses || [],
          keyword_gaps: ai.keyword_gaps,
          formatting_issues: ["AI analysis complete"],
          rewrite_suggestions: ["See full report for details"],
        },
      });
    } catch (aiError: any) {
      console.error("AI Analysis Failed:", aiError.message);
      if (aiError.message === "ai-rate-limit") {
        return NextResponse.json({
          success: false,
          reason: "ai-rate-limit"
        }, { status: 200 });
      }
      return heuristicAnalysis(cleanText);
    }

  } catch (error) {
    console.error("Critical Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Server processing error. Please try a different PDF."
    }, { status: 500 });
  }
}

async function analyzeWithGemini(text: string): Promise<AIAnalysis | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "google/gemini-flash-lite-latest" });
    const prompt = `
      Analyze this resume text for an ATS (Applicant Tracking System) score (0-100).
      Target Role: General Software/Tech Industry.

      Resume Text:
      "${text.replace(/"/g, "'")}"

      Return a JSON object ONLY:
      {
        "score": number,
        "strengths": ["string", "string", "string"],
        "keyword_gaps": ["string"],
        "weaknesses": ["string"]
      }
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
    const jsonText = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonText);

    return {
      score: Number(parsed.score ?? 0),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 3) : [],
      keyword_gaps: Array.isArray(parsed.keyword_gaps) ? parsed.keyword_gaps.slice(0, 5) : [],
    };
  } catch (e: any) {
    console.error("Gemini analysis failed:", e);
    const errText = String(e).toLowerCase();
    if (errText.includes("rate limit") || errText.includes("quota") || errText.includes("429")) {
      throw new Error("ai-rate-limit");
    }
    return null;
  }
}

function heuristicAnalysis(text: string) {
    const lowerText = text.toLowerCase();
    const keywords = ["react", "javascript", "python", "java", "sql", "aws", "node", "typescript", "git", "docker", "communication", "leadership"];
    const verbs = ["developed", "managed", "led", "created", "optimized", "designed"];
    
    const kwCount = keywords.filter(k => lowerText.includes(k)).length;
    const verbCount = verbs.filter(v => lowerText.includes(v)).length;
    
    let score = 40 + (kwCount * 4) + (verbCount * 3);
    score = Math.min(85, Math.max(40, score));

    return NextResponse.json({ 
      success: true, 
      analysis: {
        score,
        strengths: [`Found ${kwCount} key industry terms.`, `Used ${verbCount} strong action verbs.`],
        weaknesses: ["Keyword density could be higher.", "Consider adding more quantifiable metrics."],
        keyword_gaps: keywords.filter(k => !lowerText.includes(k)).slice(0, 5),
        formatting_issues: [],
        rewrite_suggestions: []
      }
    });
}
