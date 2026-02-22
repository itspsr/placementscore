import { NextResponse } from 'next/server';
import { generateBlogArticle, saveBlog } from '@/lib/blogEngine';
import { getRouteHandlerSupabase, isAdminEmail } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // 1. Verify Request (Admin Session)
  const supabase = getRouteHandlerSupabase();
  const { data } = await supabase.auth.getUser();
  const email = data?.user?.email;

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { topic, cluster } = body;
    
    console.log(`Admin triggering blog generation: ${topic} (${cluster})`);
    
    const blog = await generateBlogArticle(topic || "ATS resume tips", cluster || "Manual Admin Trigger");
    const result = await saveBlog(blog);

    return NextResponse.json({ 
      success: true, 
      slug: blog.slug, 
      result
    });
  } catch (error: any) {
    console.error("Admin Generation Error:", error);
    return NextResponse.json({ error: "Generation failed: " + error.message }, { status: 500 });
  }
}
