import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export interface GeneratedBlog {
  title: string;
  slug: string;
  meta_description: string;
  content: string;
  keywords: string;
  cluster: string;
  created_at: string;
  source: string;
  published: boolean;
  faq_schema?: string;
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
      "meta_description": "...",
      "content": "...",
      "keywords": "...",
      "faq_schema": "..."
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
    created_at: new Date().toISOString(),
    source: "Automated Blog Engine",
    published: true
  };
}

export async function saveBlog(blog: GeneratedBlog) {
  if (!supabase) {
    console.error("Supabase configuration missing. Cannot save blog.");
    throw new Error("Database connection not configured.");
  }

  const { data, error } = await supabase.from("blogs").insert([blog]).select();
  
  if (error) {
    console.error("Supabase Save Error:", error);
    throw error;
  }
  
  return { success: true, data };
}

export async function deleteBlog(id: string | number) {
  if (!supabase) throw new Error("Database connection not configured.");
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}
