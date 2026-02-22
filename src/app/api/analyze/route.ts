import { NextResponse } from 'next/server';
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

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    // 1. Extract Text from PDF using OpenAI (Vercel-safe)
    if (!OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: "AI disabled" }, { status: 200 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    if (Buffer.byteLength(base64, 'utf8') > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (base64 > 5MB)" }, { status: 400 });
    }

    const text = await extractText(base64);

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

async function extractText(base64: string) {
  if (!OPENAI_API_KEY) return '';
  const prompt = `Extract readable text from the base64-encoded PDF. Return JSON only: {"text":""}.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0,
      max_tokens: 600,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Return JSON only." },
        { role: "user", content: `${prompt}\nPDF_BASE64:\n${base64}` }
      ],
    }),
  });

  const raw = await res.text();
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${raw}`);

  const data = JSON.parse(raw);
  const content = data?.choices?.[0]?.message?.content;
  const parsed = content ? JSON.parse(content) : { text: "" };
  return parsed.text || "";
}

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
