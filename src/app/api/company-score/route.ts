import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';

const COMPANY_KEYWORDS: any = {
  "tcs": ["java", "python", "sql", "sdlc", "agile", "databases", "communication", "testing", "cloud"],
  "infosys": ["java", "cloud", "agile", "c++", "net", "javascript", "internship", "leadership"],
  "accenture": ["cloud architecture", "transformation", "innovation", "sdlc", "sap", "full stack", "automation"],
  "deloitte": ["analysis", "consulting", "stakeholder", "strategy", "data visualization", "sql", "presentation"],
  "google": ["algorithms", "distributed systems", "scalability", "c++", "go", "python", "kubernetes", "open source"]
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const company = formData.get('company') as string;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const data = await pdf(buffer);
    const text = data.text.toLowerCase();

    const targetKeywords = COMPANY_KEYWORDS[company] || COMPANY_KEYWORDS["tcs"];
    const matches = targetKeywords.filter((k: string) => text.includes(k));
    const missing = targetKeywords.filter((k: string) => !text.includes(k));

    const matchPercent = Math.round((matches.length / targetKeywords.length) * 100);
    const score = Math.max(40, Math.min( matchPercent + 40, 92)); // Realistic mapping

    return NextResponse.json({
      success: true,
      score,
      matchPercent,
      missing: missing.slice(0, 5),
      company
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to scan resume" }, { status: 500 });
  }
}
