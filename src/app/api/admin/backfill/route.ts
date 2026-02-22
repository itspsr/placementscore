
import { NextResponse } from 'next/server';
import { generateBlogArticle } from '@/lib/blogEngine';
import { getRouteHandlerSupabase, isAdminEmail } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const auth = getRouteHandlerSupabase();
    const { data } = await auth.auth.getUser();
    const email = data?.user?.email;
    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, topic } = await req.json();
    
    if (!date || !topic) {
      return NextResponse.json({ error: 'Missing date or topic' }, { status: 400 });
    }

    console.log(`Backfilling blog for ${date}: ${topic}`);
    
    const generated = await generateBlogArticle(topic, "Backfill");
    
    if (!generated) {
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch {
      console.warn("Supabase not configured; skipping backfill.");
      return NextResponse.json({ success: false, safeMode: true }, { status: 200 });
    }

    // Insert with specific date
    const { error } = await supabase.from('blogs').insert({
      title: generated.title,
      slug: generated.slug + '-' + new Date(date).getTime(), // Ensure unique
      meta_description: generated.meta_description,
      content: generated.content,
      keywords: generated.keywords,
      cluster: generated.cluster,
      faq_schema: generated.faq_schema,
      created_at: date,
      published: true,
      source: "backfill-api"
    });

    if (error) throw error;

    return NextResponse.json({ success: true, date, title: generated.title });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
