export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

const COMPANY_KEYWORDS: any = {
  "tcs": ["java", "python", "sql", "sdlc", "agile", "databases", "communication", "testing", "cloud"],
  "infosys": ["java", "cloud", "agile", "c++", "net", "javascript", "internship", "leadership"],
  "accenture": ["cloud architecture", "transformation", "innovation", "sdlc", "sap", "full stack", "automation"],
  "deloitte": ["analysis", "consulting", "stakeholder", "strategy", "data visualization", "sql", "presentation"],
  "google": ["algorithms", "distributed systems", "scalability", "c++", "go", "python", "kubernetes", "open source"]
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const company = (formData.get('company') as string) || 'tcs';

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (file.type !== 'application/pdf') return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });

    if (!OPENAI_API_KEY) return NextResponse.json({ error: "AI disabled" }, { status: 200 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    if (Buffer.byteLength(base64, 'utf8') > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (base64 > 5MB)" }, { status: 400 });
    }

    const text = (await extractText(base64)).toLowerCase();

    const targetKeywords = COMPANY_KEYWORDS[company] || COMPANY_KEYWORDS["tcs"];
    const matches = targetKeywords.filter((k: string) => text.includes(k));
    const missing = targetKeywords.filter((k: string) => !text.includes(k));

    const matchPercent = Math.round((matches.length / targetKeywords.length) * 100);
    const score = Math.max(40, Math.min(matchPercent + 40, 92));

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

async function extractText(base64: string) {
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
  if (!res.ok) throw new Error('OpenAI error');

  const data = JSON.parse(raw);
  const content = data?.choices?.[0]?.message?.content;
  const parsed = content ? JSON.parse(content) : { text: "" };
  return parsed.text || "";
}
