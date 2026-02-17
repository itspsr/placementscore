import { NextResponse } from 'next/server';
import { generateBlogArticle, saveBlog } from '@/lib/blogEngine';

export const dynamic = 'force-dynamic';

const TRENDING_KEYWORDS = [
  "ATS Resume Tips 2026",
  "Resume Keywords for TCS",
  "Google Internship Resume Guide",
  "How to Increase Resume Score",
  "Resume Format for Campus Placement",
  "Amazon SDE-1 Interview Preparation",
  "Placement strategies for Tier-3 college students"
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
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Select Topic & Cluster
    const keyword = TRENDING_KEYWORDS[Math.floor(Math.random() * TRENDING_KEYWORDS.length)];
    const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
    
    console.log(`Starting automated cron generation for: ${keyword}`);

    // 3. Generate & Save
    const blog = await generateBlogArticle(keyword, cluster);
    await saveBlog(blog);

    return NextResponse.json({ 
      success: true, 
      slug: blog.slug, 
      message: "Cron blog generated and published successfully." 
    });

  } catch (error: any) {
    console.error("Cron Blog Generation Failed:", error);
    // Return 200 with success: false for Vercel Cron reliability
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 200 });
  }
}
