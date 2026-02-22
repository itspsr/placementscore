import { NextResponse } from 'next/server';
import { generateBlogArticle, saveBlog } from '@/lib/blogEngine';
import { getSupabaseAdmin } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const TOPICS = [
  "How to Improve ATS Resume Score 2026",
  "Best Resume Format for Freshers India",
  "Resume Mistakes That Fail ATS",
  "Resume Keywords for TCS 2026",
  "How to Increase Resume Shortlisting Chances",
  "ATS Score Below 60 Meaning",
  "Resume Optimization Tips for Engineering Students",
  "Resume Format for MBA Students 2026",
  "Top Resume Skills Recruiters Want in India",
  "How ATS Filters Resumes in 2026"
];

function getDayOfYearIST() {
  const nowIst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const start = new Date(nowIst.getFullYear(), 0, 0);
  const diff = nowIst.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET(req: Request) {
  const secret = req.headers.get('x-cron-secret');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const index = getDayOfYearIST() % TOPICS.length;
    const topic = TOPICS[index];
    const baseSlug = slugify(topic);

    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', baseSlug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'slug_exists', slug: baseSlug }, { status: 200 });
    }

    const blog = await generateBlogArticle(topic, 'Daily Cron');
    if (!blog) return NextResponse.json({ ok: false, reason: 'generation_failed' }, { status: 200 });

    await saveBlog(blog);
    return NextResponse.json({ ok: true, slug: blog.slug });
  } catch (e: any) {
    console.error('cron-blog error:', e);
    return NextResponse.json({ ok: false, reason: e.message || 'error' }, { status: 200 });
  }
}
