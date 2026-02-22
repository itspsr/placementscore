import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

export async function getBlogs() {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped = data.map(blog => ({
        ...blog,
        metaDescription: blog.meta_description,
        createdAt: blog.created_at,
        faqSchema: blog.faq_schema
      }));

      // Remove duplicate same-day entries (same title + day)
      const seen = new Set<string>();
      const deduped = [] as any[];
      for (const b of mapped) {
        const day = new Date(b.createdAt).toISOString().slice(0, 10);
        const key = `${b.title}::${day}`;
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(b);
      }
      return deduped;
    }
  }

  return [];
}

export async function getBlogBySlug(slug: string) {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (!error && data) {
      return {
        ...data,
        metaDescription: data.meta_description,
        createdAt: data.created_at,
        faqSchema: data.faq_schema
      };
    }
  }

  const blogs = await getBlogs();
  return blogs.find((b: any) => b.slug === slug);
}
