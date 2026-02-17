import { NextResponse } from 'next/server';
import { generateBlogArticle, saveBlog } from '@/lib/blogEngine';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TRENDING_KEYWORDS = [
  "ATS resume 2026",
  "Resume for campus placements",
  "Resume keywords for TCS",
  "Resume format India",
  "Resume score improvement",
  "Resume tips for freshers",
  "Resume for IT jobs India"
];

const CLUSTERS = [
  "ATS Score Guide",
  "Campus Placement Preparation",
  "Resume Mistakes",
  "Company Specific Resume Guides",
  "Resume Format Templates"
];

export async function GET(req: Request) {
  try {
    // 1. Verify Request (Cron Secret)
    const authHeader = req.headers.get('authorization');
    const cronHeader = req.headers.get('x-cron-secret');
    const isValidAuth = authHeader === `Bearer ${process.env.CRON_SECRET}` || cronHeader === process.env.CRON_SECRET;
    
    if (!isValidAuth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Select Topic & Cluster
    const keyword = TRENDING_KEYWORDS[Math.floor(Math.random() * TRENDING_KEYWORDS.length)];
    const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
    
    // 3. Check for Duplicates (Basic check on title/keyword matching)
    // We assume slug generation is deterministic or we check if a similar title exists.
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .ilike('title', `%${keyword}%`)
      .limit(1);

    if (existing && existing.length > 0) {
       console.log(`Skipping duplicate topic: ${keyword}`);
       return NextResponse.json({ success: true, message: "Skipped duplicate topic" });
    }

    console.log(`Starting automated cron generation for: ${keyword}`);

    // 4. Generate & Save
    const blog = await generateBlogArticle(keyword, cluster);
    await saveBlog(blog);

    // 5. Revalidate Cache
    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json({ 
      success: true, 
      slug: blog.slug, 
      message: "Cron blog generated, published, and cache revalidated." 
    });

  } catch (error: any) {
    console.error("Cron Blog Generation Failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 200 });
  }
}
