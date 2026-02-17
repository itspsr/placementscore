import { NextResponse } from 'next/server';
import { generateBlogArticle, saveBlog } from '@/lib/blogEngine';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // 1. Verify Request (Admin Session or Cron Secret)
  const session = await getServerSession(authOptions);
  const authHeader = req.headers.get('authorization');
  
  const isAdmin = session?.user?.name === 'urboss' || session?.user?.email === 'itspsr@gmail.com' || session?.user?.email === 'admin@placementscore.online';
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { topic, cluster } = await req.json();
    
    console.log(`Admin triggering blog generation: ${topic} (${cluster})`);
    
    const blog = await generateBlogArticle(topic || "ATS resume tips", cluster || "Manual Admin Trigger");
    const result = await saveBlog(blog);

    return NextResponse.json({ 
      success: true, 
      slug: blog.slug, 
      blog
    });
  } catch (error: any) {
    console.error("Admin Generation Error:", error);
    return NextResponse.json({ error: "Generation failed: " + error.message }, { status: 500 });
  }
}
