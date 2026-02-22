import { NextResponse } from 'next/server';
import { generateBlogArticle, saveBlog } from '@/lib/blogEngine';

export const dynamic = 'force-dynamic';

const TOPICS = [
  'ats resume tips 2026',
  'resume keywords for TCS',
  'data analyst resume india',
  'fresher resume format',
  'AI resume builder'
];

export async function GET(req: Request) {
  const secret = req.headers.get('x-cron-secret');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const dayIndex = Math.floor(Date.now() / 86400000) % TOPICS.length;
    const topic = TOPICS[dayIndex];

    const blog = await generateBlogArticle(topic, 'Daily Cron');
    if (!blog) return NextResponse.json({ ok: false, reason: 'generation_failed' }, { status: 200 });

    await saveBlog(blog);
    return NextResponse.json({ ok: true, slug: blog.slug });
  } catch (e: any) {
    console.error('cron-blog error:', e);
    return NextResponse.json({ ok: false, reason: e.message || 'error' }, { status: 200 });
  }
}
