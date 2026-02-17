import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    // 2. AI Analysis via Gemini
    if (!process.env.GEMINI_API_KEY) {
       // Fallback to heuristic if key is missing (dev mode safety)
       console.warn("GEMINI_API_KEY missing, using fallback heuristic.");
       return heuristicAnalysis(text);
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Analyze this resume text for an ATS (Applicant Tracking System) score (0-100).
        Target Role: General Software/Tech Industry.
        
        Resume Text:
        "${text.slice(0, 8000).replace(/"/g, "'")}"
        
        Return a JSON object ONLY:
        {
          "score": number, // 0-100
          "strengths": ["string", "string", "string"], // Max 3 key strengths
          "keyword_gaps": ["string", "string", "string"], // Max 5 missing critical keywords for a general tech role
          "weaknesses": ["string", "string", "string"] // Max 3 critical issues
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonText = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      const aiData = JSON.parse(jsonText);

      return NextResponse.json({ 
        success: true, 
        analysis: {
          score: aiData.score,
          strengths: aiData.strengths,
          weaknesses: aiData.weaknesses || [],
          keyword_gaps: aiData.keyword_gaps,
          formatting_issues: ["AI analysis complete"],
          rewrite_suggestions: ["See full report for details"]
        }
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
