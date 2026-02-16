import { NextResponse } from 'next/server';
import { generateBlogArticle, saveBlog } from '@/lib/blogEngine';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const TRENDING_KEYWORDS = [
  "ATS resume tips 2026",
  "Resume keywords for TCS",
  "How to increase placement score",
  "Resume format for freshers 2026",
  "Google India Internship Resume Guide",
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
    // 1. Verify Request (Cron or Admin)
    const authHeader = req.headers.get('authorization');
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.name === 'urboss' || session?.user?.email === 'itspsr@gmail.com';

    if (!isCron && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Select Topic & Cluster
    const keyword = TRENDING_KEYWORDS[Math.floor(Math.random() * TRENDING_KEYWORDS.length)];
    const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
    
    console.log(`Starting automated generation for: ${keyword}`);

    // 3 & 4. Call Gemini & Generate
    const blog = await generateBlogArticle(keyword, cluster);

    // 5 & 6. Create Slug & Insert into DB
    await saveBlog(blog);

    // 7. Return Success
    return NextResponse.json({ 
      success: true, 
      slug: blog.slug, 
      message: "Blog generated and published successfully." 
    });

  } catch (error: any) {
    console.error("Auto Blog Generation Failed:", error);
    // Never return 500 for cron, return 200 with success: false
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 200 });
  }
}
