import { createClient } from "@supabase/supabase-js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

async function generateWithGemini(prompt: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const raw = await response.text();
    console.log("GEMINI RAW:", raw);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${raw}`);
    }

    const data = JSON.parse(raw);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!text) {
      throw new Error("Empty Gemini response");
    }

    return text;

  } catch (err) {
    console.error("Gemini generation failed:", err);
    return null;
  }
}

export async function generateBlogArticle(topic: string, cluster: string): Promise<GeneratedBlog> {
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

  const result = await generateWithGemini(prompt);
  
  if (!result) {
    // Fallback logic
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    return {
      title: `Guide to ${topic}`,
      slug: slug,
      meta_description: `Learn more about ${topic} and how it impacts your placement score.`,
      content: `
# ${topic}

This is an AI-generated resume strategy guide for ${topic}.

Detailed insights will be updated shortly.

Stay tuned for structured resume tips, ATS keywords, formatting strategies, and interview optimization.
      `.trim(),
      keywords: topic,
      cluster,
      created_at: new Date().toISOString(),
      source: "Gemini Fallback",
      published: true
    };
  }

  try {
    const rawJson = result.replace(/```json/g, "").replace(/```/g, "").trim();
    const blogData = JSON.parse(rawJson);

    return {
      ...blogData,
      cluster,
      created_at: new Date().toISOString(),
      source: "Gemini 1.5 Flash",
      published: true
    };
  } catch (e) {
    console.error("JSON Parse Error in Blog Engine:", e);
    // Return fallback if parsing fails
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    return {
      title: `Guide to ${topic}`,
      slug: slug,
      meta_description: `Learn more about ${topic} and how it impacts your placement score.`,
      content: result || `Fallback content for ${topic}`,
      keywords: topic,
      cluster,
      created_at: new Date().toISOString(),
      source: "Gemini Parsing Fallback",
      published: true
    };
  }
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
