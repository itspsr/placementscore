import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest";

const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return null;
  return createClient(url, key);
};

const INTERNAL_LINKS = [
  { href: "https://placementscore.online", label: "Check your free ATS Resume Score" },
  { href: "https://placementscore.online/ats-resume-score-checker-india", label: "Improve your ATS score instantly" }
];

function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/[#>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getExcerpt(markdown: string, max = 160) {
  const text = stripMarkdown(markdown);
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "").trim() + "...";
}

function getReadingTime(markdown: string) {
  const text = stripMarkdown(markdown);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getContentHash(title: string, content: string) {
  return crypto.createHash("sha256").update(`${title}::${content}`).digest("hex");
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function injectInternalLinks(content: string) {
  const footer = `\n\n---\n\n🔍 ${INTERNAL_LINKS[0].label}:\n${INTERNAL_LINKS[0].href}\n\n🚀 ${INTERNAL_LINKS[1].label}:\n${INTERNAL_LINKS[1].href}\n`;
  if (content.includes(INTERNAL_LINKS[0].href) && content.includes(INTERNAL_LINKS[1].href)) return content;
  return `${content}${footer}`;
}

async function ensureUniqueSlug(slug: string) {
  const supabase = getSupabase();
  if (!supabase) return `${slug}-${Date.now()}`;
  const { data, error } = await supabase.from("blogs").select("id, slug").eq("slug", slug).maybeSingle();
  if (error || !data) return slug;
  return `${slug}-${Date.now()}`;
}

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
  reading_time?: number;
  excerpt?: string;
  category?: string;
  canonical_url?: string;
  content_hash?: string;
}

async function generateWithOpenAI(prompt: string) {
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is missing; AI disabled.");
    return null;
  }

  if (prompt.length > 20000) {
    console.warn("Prompt too long; skipping OpenAI generation.");
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.7,
        max_tokens: 1000,
        messages: [
          { role: "system", content: "You are an SEO writer. Write structured markdown blog. Return markdown only." },
          { role: "user", content: prompt }
        ]
      })
    });

    const raw = await response.text();
    if (!response.ok) {
      // Common: 429 rate limit
      throw new Error(`OpenAI API error: ${response.status} ${raw}`);
    }

    const data = JSON.parse(raw);
    const text = data?.choices?.[0]?.message?.content || null;
    if (!text) throw new Error("Empty OpenAI response");
    return text;
  } catch (err) {
    console.error("OpenAI generation failed:", err);
    return null;
  }
}

async function generateWithClaude(prompt: string) {
  if (!ANTHROPIC_API_KEY) {
    return null;
  }

  if (prompt.length > 20000) {
    console.warn("Prompt too long; skipping Claude generation.");
    return null;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        temperature: 0.7,
        system: "You are an SEO writer. Write structured markdown blog. Return markdown only.",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const raw = await response.text();
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${raw}`);
    }

    const data = JSON.parse(raw);
    const text = data?.content?.[0]?.text || null;
    if (!text) throw new Error("Empty Claude response");
    return text;
  } catch (err) {
    console.error("Claude generation failed:", err);
    return null;
  }
}

async function generateWithGemini(prompt: string) {
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing; AI disabled.");
    return null;
  }

  if (prompt.length > 10000) {
    console.warn("Prompt too long; skipping Gemini generation.");
    return null;
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 1500,
            temperature: 0.7
          }
        })
      }
    );

    const raw = await response.text();

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
  const prompt = `Write a 900–1100 word SEO blog on: ${topic}

Rules:
- Use simple English.
- Target Indian students.
- Include:
  - H1 title
  - 3–5 H2 sections
  - 1 FAQ section
- Naturally include keywords:
  ATS resume score
  resume optimization India
  how to improve ATS score
- Avoid fluff.`;

  const result = (await generateWithClaude(prompt))
    || (OPENAI_API_KEY ? await generateWithOpenAI(prompt) : null)
    || await generateWithGemini(prompt);

  if (!result) {
    const fallbackContent = `# ${topic}

This is an AI-generated resume strategy guide for ${topic}.

Detailed insights will be updated shortly.`.trim();
    const baseSlug = slugify(topic) || `blog-${Date.now()}`;
    const uniqueSlug = await ensureUniqueSlug(baseSlug);
    const canonical = `https://placementscore.online/blog/${uniqueSlug}`;
    const enrichedContent = injectInternalLinks(fallbackContent);

    return {
      title: topic,
      slug: uniqueSlug,
      meta_description: getExcerpt(enrichedContent, 155),
      content: enrichedContent,
      keywords: ["ATS resume score", "resume optimization India", "how to improve ATS score"],
      cluster,
      created_at: new Date().toISOString(),
      source: "ai",
      published: true,
      reading_time: getReadingTime(enrichedContent),
      excerpt: getExcerpt(enrichedContent),
      category: cluster,
      canonical_url: canonical,
      content_hash: getContentHash(topic, enrichedContent)
    };
  }

  const markdown = result || '';
  const lines = markdown.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const h1 = lines.find((l) => l.startsWith('# ')) || '';
  const title = h1.replace(/^#\s+/, '').trim() || topic;
  const baseSlug = slugify(title) || slugify(topic) || `blog-${Date.now()}`;
  const uniqueSlug = await ensureUniqueSlug(baseSlug);
  const canonical = `https://placementscore.online/blog/${uniqueSlug}`;
  const contentWithLinks = injectInternalLinks(markdown);

  return {
    title,
    slug: uniqueSlug,
    meta_description: getExcerpt(contentWithLinks, 155),
    content: contentWithLinks,
    keywords: ["ATS resume score", "resume optimization India", "how to improve ATS score"],
    cluster,
    created_at: new Date().toISOString(),
    source: "ai",
    published: true,
    reading_time: getReadingTime(contentWithLinks),
    excerpt: getExcerpt(contentWithLinks),
    category: cluster,
    canonical_url: canonical,
    content_hash: getContentHash(title, contentWithLinks)
  };
}

export async function saveBlog(blog: GeneratedBlog) {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("Supabase not configured; skipping blog save.");
    return { success: false, data: null } as any;
  }

  const { data: slugExists } = await supabase
    .from("blogs")
    .select("id")
    .eq("slug", blog.slug)
    .maybeSingle();
  if (slugExists) {
    console.warn("Duplicate blog detected by slug; skipping save.");
    return { success: false, duplicate: true, data: slugExists } as any;
  }

  if (blog.content_hash) {
    const { data: existing, error: dupError } = await supabase
      .from("blogs")
      .select("id")
      .eq("content_hash", blog.content_hash)
      .maybeSingle();
    if (dupError) {
      console.warn("Duplicate check failed:", dupError);
    }
    if (existing) {
      console.warn("Duplicate blog detected by hash; skipping save.");
      return { success: false, duplicate: true, data: existing } as any;
    }
  }

  const { data, error } = await supabase.from("blogs").insert([blog]).select();

  if (error) {
    console.error("Supabase Save Error:", error);
    return { success: false, error } as any;
  }

  return { success: true, data };
}

export async function deleteBlog(id: string | number) {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("Supabase not configured; skipping delete.");
    return { success: false } as any;
  }
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) return { success: false, error } as any;
  return { success: true };
}
