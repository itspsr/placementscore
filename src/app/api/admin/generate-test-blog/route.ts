import { NextResponse } from 'next/server';
import { generateBlogArticle, saveBlog } from '@/lib/blogEngine';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  // 1. Verify Admin Session
  const session = await getServerSession(authOptions);
  
  // Basic security: only 'urboss' or specific emails allowed
  const isAdmin = session?.user?.email === 'itspsr@gmail.com' || session?.user?.name === 'urboss';
  
  if (!isAdmin && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 401 });
  }

  try {
    const { topic, cluster } = await req.json();
    
    console.log(`Admin triggering test blog generation: ${topic} (${cluster})`);
    
    const blog = await generateBlogArticle(topic || "ATS resume tips", cluster || "Manual Test");
    const result = await saveBlog(blog);

    return NextResponse.json({ 
      success: true, 
      slug: blog.slug, 
      storage: result.storage,
      blog
    });
  } catch (error: any) {
    console.error("Admin Generation Error:", error);
    return NextResponse.json({ error: "Generation failed: " + error.message }, { status: 500 });
  }
}
