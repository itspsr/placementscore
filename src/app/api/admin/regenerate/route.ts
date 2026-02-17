
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

    const { id, topic } = await req.json();
    
    if (!id || !topic) {
      return NextResponse.json({ error: 'Missing id or topic' }, { status: 400 });
    }

    console.log(`Regenerating blog: ${topic} (${id})`);
    
    // Generate new content
    const generated = await generateBlogArticle(topic, "Regeneration");
    
    if (!generated) {
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }

    // Update in Supabase
    const { error } = await supabase
      .from('blogs')
      .update({
        title: generated.title,
        meta_description: generated.meta_description,
        content: generated.content,
        keywords: generated.keywords,
        faq_schema: generated.faq_schema,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, id, title: generated.title });

  } catch (error: any) {
    console.error("Regeneration API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
