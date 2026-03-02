import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    // 1. Check current blogs
    const { data: allBlogs, error: fetchError } = await supabase
      .from('blogs')
      .select('id, title, created_at, published');

    if (fetchError) throw fetchError;

    // 2. Fix missing published values
    const { data: updated, error: updateError } = await supabase
      .from('blogs')
      .update({ published: true })
      .is('published', null);

    if (updateError) throw updateError;

    // 3. Count by date
    const counts: Record<string, number> = {};
    allBlogs.forEach(b => {
        const date = new Date(b.created_at).toISOString().slice(0, 10);
        counts[date] = (counts[date] || 0) + 1;
    });

    return NextResponse.json({
        total: allBlogs.length,
        fixed_null_published: updated,
        counts_by_date: counts,
        latest_blogs: allBlogs.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
