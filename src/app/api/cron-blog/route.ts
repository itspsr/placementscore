import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const TRENDING_KEYWORDS = [
  "ATS resume 2026",
  "Resume for campus placements",
  "Resume keywords for TCS",
  "Resume format India",
  "Resume score improvement",
  "Resume tips for freshers",
  "Resume for IT jobs India",
  "Off-campus drive preparation 2026",
  "Resume for Google STEP internship",
  "Technical resume vs Functional resume"
];

const CLUSTERS = [
  "ATS Score Guide",
  "Campus Placement Preparation",
  "Resume Mistakes",
  "Company Specific Resume Guides",
  "Resume Format Templates"
];

function toSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function fallbackContent(topic: string) {
  const title = topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `# ${title}

A focused guide on ${topic} for 2026 placements.

## Key Takeaways
- Use ATS-friendly formatting
- Emphasize quantified impact
- Highlight relevant keywords

## Why it Matters
Recruiters filter resumes fast. Clear, targeted content improves your odds.

## Final Tip
Keep your resume concise and tailored to the role.`;
}

export async function GET(req: Request) {
  console.log("CRON START");
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return new Response(
        JSON.stringify({ success: false, reason: "missing-env" }),
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    if (process.env.CRON_SECRET) {
      if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
        return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });
      }
    }

    const keyword = TRENDING_KEYWORDS[Math.floor(Math.random() * TRENDING_KEYWORDS.length)];
    const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
    console.log("Topic selected:", keyword);

    const slug = toSlug(keyword);

    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ success: true, reason: "duplicate", slug });
    }

    let content: string | null = null;
    const title = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const meta_description = `Practical ${keyword} tips for 2026 placements. ATS-ready and concise.`;

    const prompt = `Write a concise SEO blog about "${keyword}" for Indian students (2026). Use Markdown with H2/H3, bullet tips, and a short FAQ. Keep it under 600 words.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.4,
          max_tokens: 700,
          messages: [
            { role: "system", content: "Return plain Markdown only." },
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          return NextResponse.json({ success: false, reason: "rate-limit" });
        }
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      content = data?.choices?.[0]?.message?.content || null;
    } catch (e) {
      content = null;
    }

    const blog = {
      title,
      slug,
      meta_description,
      content: content || fallbackContent(keyword),
      keywords: [keyword, "placements 2026", "ATS resume"],
      cluster,
      created_at: new Date().toISOString(),
      source: content ? "openai" : "fallback",
      published: true
    };

    const { error } = await supabase.from("blogs").insert([blog]);

    if (error) {
      return NextResponse.json({ success: false, reason: error.message });
    }

    try {
      revalidatePath('/blog');
      revalidatePath('/');
    } catch {}

    return NextResponse.json({ success: true, slug });

  } catch (error: any) {
    console.error("CRON ERROR:", error.message);
    return NextResponse.json({ success: false, reason: "unexpected-error" });
  }
}
