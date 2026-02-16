import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

const DATA_PATH = path.join(process.cwd(), "src/data/blogs.json");

export interface GeneratedBlog {
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  keyword: string;
  cluster: string;
  createdAt: string;
  source: string;
}

export async function generateBlogArticle(topic: string, cluster: string): Promise<GeneratedBlog> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are a senior SEO SaaS architect. Build a 2000-word authority blog for 'placementscore.online'.
    
    Topic: ${topic}
    Cluster: ${cluster}
    Focus: Indian college students (IIT, NIT, VIT, SRM, etc.)
    Target Year: 2026/2027
    Style: Professional, data-driven, encouraging.
    
    Requirements:
    1. Title: SEO Optimized (max 60 chars).
    2. Meta Description: High CTR (max 155 chars).
    3. Content: 1500-2000 words in high-quality Markdown.
    4. Structure: H1, multiple H2s and H3s.
    5. Include a FAQ section with 5 questions.
    6. Include internal links placeholder like [LINK:HOME], [LINK:PRICING].
    7. Include JSON-LD FAQ Schema in a separate field.
    
    Return as valid JSON:
    {
      "title": "...",
      "slug": "...",
      "metaDescription": "...",
      "content": "...",
      "keyword": "...",
      "faqSchema": "..."
    }
    JSON only, no markdown wrappers.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawJson = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
  const blogData = JSON.parse(rawJson);

  return {
    ...blogData,
    cluster,
    createdAt: new Date().toISOString(),
    source: "Automated Blog Engine"
  };
}

export async function saveBlog(blog: GeneratedBlog) {
  // 1. Save to Supabase (Primary)
  if (supabase) {
    const { error } = await supabase.from("blogs").insert([blog]);
    if (error) {
      console.error("Supabase Save Error:", error);
    } else {
      return { success: true, storage: "supabase" };
    }
  }

  // 2. Save to Local JSON (Fallback/Backup)
  try {
    const existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    existing.push(blog);
    fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2));
    return { success: true, storage: "local" };
  } catch (e) {
    console.error("Local Save Error:", e);
    throw e;
  }
}
