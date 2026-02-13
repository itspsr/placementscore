import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const DATA_PATH = path.join(process.cwd(), 'src/data/programmatic.json');

const COMBINATIONS = [
  { degree: "BTech CSE", year: "2026", type: "ats-score" },
  { degree: "BTech ECE", year: "2026", type: "ats-score" },
  { degree: "MCA", year: "2026", type: "ats-score" },
  { company: "TCS", year: "2026", type: "resume-format" },
  { company: "Infosys", year: "2026", type: "resume-format" },
  { company: "Accenture", year: "2026", type: "resume-format" },
  { company: "Google", year: "2026", type: "resume-format" },
  { category: "Campus Placement", year: "2026", type: "guide" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (process.env.NODE_ENV === 'production' && searchParams.get('key') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Pick a combination not yet generated
    const target = COMBINATIONS.find(c => {
      const slug = c.type === 'ats-score' ? `ats-score-for-${c.degree?.toLowerCase().replace(/ /g, '-')}-${c.year}` 
                 : c.type === 'resume-format' ? `resume-format-for-${c.company?.toLowerCase()}-campus-placement`
                 : `complete-guide-to-campus-placements-${c.year}`;
      return !existing.find((e: any) => e.slug === slug);
    });

    if (!target) return NextResponse.json({ message: "All combinations generated" });

    const prompt = `
      You are a senior SEO growth engineer. Generate a 1200-word programmatic SEO page for 'placementscore.online'.
      
      Target: ${JSON.stringify(target)}
      
      Requirements:
      1. Title: Catchy SEO title.
      2. Meta Description: High CTR.
      3. Content: 1200 words in high-quality Markdown.
      4. Include a detailed FAQ section with 5 questions.
      5. Include breadcrumb data.
      
      Return as valid JSON:
      {
        "title": "...",
        "slug": "...",
        "metaDescription": "...",
        "content": "...",
        "type": "${target.type}",
        "schema": { ... }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawJson = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const pageData = JSON.parse(rawJson);

    pageData.createdAt = new Date().toISOString();
    existing.push(pageData);
    fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2));

    return NextResponse.json({ success: true, slug: pageData.slug });
  } catch (error) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
