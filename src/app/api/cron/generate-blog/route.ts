import { NextResponse } from 'next/server';
import { generateBlogArticle, saveBlog } from '@/lib/blogEngine';

const CLUSTERS = [
  "ATS Score Guide",
  "Campus Placement Preparation",
  "Resume Mistakes",
  "Company Specific Resume Guides",
  "Resume Format Templates"
];

const TOPICS = [
  "ATS resume tips for 2026",
  "Placement preparation for top MNCs",
  "Resume keywords for Software Engineers",
  "How to bypass automated resume filters",
  "Career growth for Indian engineering graduates"
];

export async function GET(req: Request) {
  // Protect with Vercel Cron Secret
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    
    console.log(`Starting automated blog generation: ${topic} (${cluster})`);
    
    const blog = await generateBlogArticle(topic, cluster);
    const result = await saveBlog(blog);

    return NextResponse.json({ 
      success: true, 
      slug: blog.slug, 
      storage: result.storage 
    });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Generation failed: " + error.message }, { status: 500 });
  }
}
