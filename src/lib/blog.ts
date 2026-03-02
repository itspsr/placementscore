import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin } from './supabaseClient';

const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

const getSupabase = () => {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
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
      return data.map(blog => ({
        ...blog,
        metaDescription: blog.meta_description,
        createdAt: blog.created_at,
        faqSchema: blog.faq_schema
      }));
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
