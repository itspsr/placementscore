
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateBlogArticle } from '@/lib/blogEngine';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
