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
  keywords: string | string[];
  cluster: string;
  created_at: string;
  source: string;
  published: boolean;
  faq_schema?: any;
}

async function generateWithGemini(prompt: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  if (prompt.length > 10000) {
    throw new Error("Prompt too long");
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
          ],
          generationConfig: {
            maxOutputTokens: 2048
          }
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
    Write a 1500-1800 word SEO optimized blog on "${topic}".
    Include headings (H1, H2, H3), actionable advice, a FAQ section with 5 questions, and a high-CTR meta description.
    Target Indian students preparing for placements in 2026/2027.
    Make it authoritative and practical.
    
    Return as valid JSON:
    {
      "title": "SEO Optimized Title",
      "slug": "url-slug",
      "meta_description": "CTR focused description",
      "content": "Full Markdown content here",
      "keywords": "comma, separated, keywords",
      "faq_schema": "JSON-LD FAQ Schema string"
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
      keywords: [topic],
      cluster,
      created_at: new Date().toISOString(),
      source: "ai",
      published: true
    };
  }

  try {
    const rawJson = result.replace(/```json/g, "").replace(/```/g, "").trim();
    const blogData = JSON.parse(rawJson);

    // Ensure keywords is an array
    let keywordsArray = [];
    if (typeof blogData.keywords === 'string') {
      keywordsArray = blogData.keywords.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(blogData.keywords)) {
      keywordsArray = blogData.keywords;
    }

    // Ensure faq_schema is a valid JSON object if it's a string
    let faqSchemaObj = blogData.faq_schema;
    if (typeof faqSchemaObj === 'string') {
      try {
        faqSchemaObj = JSON.parse(faqSchemaObj);
      } catch (e) {
        // Keep as string if parsing fails, Supabase jsonb might handle it or error
      }
    }

    return {
      ...blogData,
      keywords: keywordsArray,
      faq_schema: faqSchemaObj,
      cluster,
      created_at: new Date().toISOString(),
      source: "ai",
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
      keywords: [topic],
      cluster,
      created_at: new Date().toISOString(),
      source: "ai",
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
