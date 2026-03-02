import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { BLOG_TOPICS } from '@/lib/blogTopics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch total count
    const { count, error: countError } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Fetch latest blog
    const { data: latest, error: latestError } = await supabase
      .from('blogs')
      .select('title, slug, created_at, published')
      .order('created_at', { ascending: false })
      .limit(1);

    if (latestError) throw latestError;

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - startOfYear.getTime();
    const currentDayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      supabaseUrl: supabaseUrl.replace(/(https:\/\/).*(.supabase.co)/, "$1***$2"),
      blogCount: count,
      latestBlog: latest[0] || null,
      currentDayOfYear,
      expectedTopicToday: BLOG_TOPICS[currentDayOfYear % BLOG_TOPICS.length],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
