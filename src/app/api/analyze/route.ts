import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Extract Text from PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let text = "";
    try {
      const data = await pdf(buffer);
      text = data.text || "";
    } catch (parseError) {
      console.error("PDF Parse Error:", parseError);
      return NextResponse.json({ 
        success: false, 
        error: "Unreadable PDF. Please ensure the file is not password protected or an image scan."
      }, { status: 422 });
    }

    // Basic length check
    if (text.trim().length < 50) {
      return NextResponse.json({ 
        success: false, 
        error: "Resume too short or unreadable. Please upload a standard text-based PDF."
      }, { status: 422 });
    }

    // 2. AI Analysis (Prefer OpenAI if configured to avoid Gemini rate limits)
    try {
      const ai = OPENAI_API_KEY
        ? await analyzeWithOpenAI(text)
        : await analyzeWithGemini(text);

      if (!ai) return heuristicAnalysis(text);

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
    } catch (aiError) {
      console.error("AI Analysis Failed, reverting to heuristic:", aiError);
      return heuristicAnalysis(text);
    }

  } catch (error) {
    console.error("Critical Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Server processing error. Please try a different PDF."
    }, { status: 500 });
  }
}

type AIAnalysis = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  keyword_gaps: string[];
};

async function analyzeWithOpenAI(text: string): Promise<AIAnalysis | null> {
  if (!OPENAI_API_KEY) return null;

  const resumeText = text.slice(0, 12000).replace(/"/g, "'");

  const prompt = `Analyze this resume text for an ATS (Applicant Tracking System) score (0-100).\nTarget Role: General Software/Tech Industry.\n\nResume Text:\n"${resumeText}"\n\nReturn a JSON object ONLY:\n{\n  "score": number,\n  "strengths": ["string"],\n  "keyword_gaps": ["string"],\n  "weaknesses": ["string"]\n}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.4,
        max_tokens: 800,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Return ONLY valid JSON. No markdown. No backticks." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const raw = await response.text();
    if (!response.ok) throw new Error(`OpenAI API error: ${response.status} ${raw}`);

    const data = JSON.parse(raw);
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return {
      score: Number(parsed.score ?? 0),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 3) : [],
      keyword_gaps: Array.isArray(parsed.keyword_gaps) ? parsed.keyword_gaps.slice(0, 5) : [],
    };
  } catch (e) {
    console.error("OpenAI analysis failed:", e);
    return null;
  }
}

async function analyzeWithGemini(text: string): Promise<AIAnalysis | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analyze this resume text for an ATS (Applicant Tracking System) score (0-100).
      Target Role: General Software/Tech Industry.

      Resume Text:
      "${text.slice(0, 8000).replace(/"/g, "'")}"

      Return a JSON object ONLY:
      {
        "score": number,
        "strengths": ["string", "string", "string"],
        "keyword_gaps": ["string"],
        "weaknesses": ["string"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonText);

    return {
      score: Number(parsed.score ?? 0),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 3) : [],
      keyword_gaps: Array.isArray(parsed.keyword_gaps) ? parsed.keyword_gaps.slice(0, 5) : [],
    };
  } catch (e) {
    console.error("Gemini analysis failed:", e);
    return null;
  }
}

// Fallback Heuristic Logic (Legacy)
function heuristicAnalysis(text: string) {
    const lowerText = text.toLowerCase();
    const keywords = ["react", "javascript", "python", "java", "sql", "aws", "node", "typescript", "git", "docker", "communication", "leadership"];
    const verbs = ["developed", "managed", "led", "created", "optimized", "designed"];
    
    const kwCount = keywords.filter(k => lowerText.includes(k)).length;
    const verbCount = verbs.filter(v => lowerText.includes(v)).length;
    
    let score = 40 + (kwCount * 4) + (verbCount * 3);
    score = Math.min(85, Math.max(40, score)); // Cap between 40-85 for heuristic

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
