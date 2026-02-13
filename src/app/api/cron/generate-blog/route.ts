import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const CLUSTERS = [
  "ATS Score Guide",
  "Campus Placement Preparation",
  "Resume Mistakes",
  "Company Specific Resume Guides",
  "Resume Format Templates"
];

const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

export async function GET(req: Request) {
  // Protect with Vercel Cron Secret or standard check
  const { searchParams } = new URL(req.url);
  if (process.env.NODE_ENV === 'production' && searchParams.get('key') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingBlogs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const cluster = CLUSTERS[existingBlogs.length % CLUSTERS.length];
    
    const prompt = `
      You are a senior SEO SaaS architect. Build a 2000-word authority blog for 'placementscore.online'.
      
      Rules:
      - Topic Cluster: ${cluster}
      - Focus: Indian college students (IIT, NIT, VIT, etc.)
      - Target Year: 2026/2027
      - Style: Professional, data-driven, encouraging.
      
      Requirements:
      1. Generate a unique long-tail keyword (min 4 words, low competition, Indian focus).
      2. Title: SEO Optimized (max 60 chars).
      3. Description: High CTR (max 155 chars).
      4. Content: 1500-2000 words in high-quality Markdown.
      5. Structure: H1, multiple H2s and H3s.
      6. Include a FAQ section with 5 questions.
      7. Include internal links placeholder like [LINK:HOME], [LINK:PRICING].
      
      Return as valid JSON:
      {
        "title": "...",
        "slug": "...",
        "metaDescription": "...",
        "content": "...",
        "keyword": "...",
        "cluster": "${cluster}"
      }
      JSON only, no markdown wrappers.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawJson = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const blogData = JSON.parse(rawJson);

    // Prevent duplicate slugs
    if (existingBlogs.find((b: any) => b.slug === blogData.slug)) {
      blogData.slug += `-${Date.now()}`;
    }

    const newBlog = {
      ...blogData,
      createdAt: new Date().toISOString(),
      id: existingBlogs.length + 1
    };

    existingBlogs.push(newBlog);
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingBlogs, null, 2));

    return NextResponse.json({ success: true, slug: newBlog.slug });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
