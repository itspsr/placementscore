import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { BLOG_TOPICS } from '@/lib/blogTopics';
import { generateBlog } from '@/lib/blogTemplate';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret') || req.headers.get('x-cron-secret');

    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, reason: "missing-env" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const isForceBackfill = req.headers.get('x-force-backfill') === 'true' || searchParams.get('force') === 'true';

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - startOfYear.getTime();
    const currentDayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const insertedSlugs: string[] = [];

    if (isForceBackfill) {
      console.log(`Force backfill triggered. Checking all days from Jan 1 to day ${currentDayOfYear}`);
      
      for (let day = 0; day <= currentDayOfYear; day++) {
        const date = new Date(now.getFullYear(), 0, 1);
        date.setDate(date.getDate() + day);
        
        const topicIndex = day % BLOG_TOPICS.length;
        const topic = BLOG_TOPICS[topicIndex];
        const blogData = generateBlog(topic, date);

        const { data: existing } = await supabase
          .from('blogs')
          .select('slug')
          .eq('slug', blogData.slug)
          .maybeSingle();

        if (!existing) {
          const { error } = await supabase.from('blogs').insert([{
            ...blogData,
            published: true,
            keywords: [topic, "placements 2026", "ATS resume"],
          }]);

          if (!error) {
            insertedSlugs.push(blogData.slug);
          }
        }
      }
    } else {
      // Normal flow or existing auto-backfill check
      const { count: blogCount } = await supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true });

      const targetCount = currentDayOfYear + 1;

      if ((blogCount || 0) < targetCount) {
        // ... (existing auto-backfill logic but fixed to be robust)
        for (let day = 0; day <= currentDayOfYear; day++) {
          const date = new Date(now.getFullYear(), 0, 1);
          date.setDate(date.getDate() + day);
          
          const topicIndex = day % BLOG_TOPICS.length;
          const topic = BLOG_TOPICS[topicIndex];
          const blogData = generateBlog(topic, date);

          const { data: existing } = await supabase
            .from('blogs')
            .select('slug')
            .eq('slug', blogData.slug)
            .maybeSingle();

          if (!existing) {
            const { error } = await supabase.from('blogs').insert([{
              ...blogData,
              published: true,
              keywords: [topic, "placements 2026", "ATS resume"],
            }]);

            if (!error) {
              insertedSlugs.push(blogData.slug);
            }
          }
        }
      } else {
        // Just today
        const topicIndex = currentDayOfYear % BLOG_TOPICS.length;
        const topic = BLOG_TOPICS[topicIndex];
        const blogData = generateBlog(topic, now);

        const { data: existing } = await supabase
          .from('blogs')
          .select('slug')
          .eq('slug', blogData.slug)
          .maybeSingle();

        if (!existing) {
          const { error } = await supabase.from('blogs').insert([{
            ...blogData,
            published: true,
            keywords: [topic, "placements 2026", "ATS resume"],
          }]);

          if (!error) {
            insertedSlugs.push(blogData.slug);
          }
        }
      }
    }

    if (insertedSlugs.length > 0) {
      try {
        revalidatePath('/blog');
        revalidatePath('/');
      } catch (err) {
        console.error("Revalidation failed:", err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: insertedSlugs.length, 
      slugs: insertedSlugs 
    });

  } catch (error: any) {
    console.error("CRON ERROR:", error.message);
    return NextResponse.json({ success: false, reason: "unexpected-error", message: error.message }, { status: 500 });
  }
}
