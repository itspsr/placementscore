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
  let supabaseBlogs: any[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      supabaseBlogs = data.map(blog => ({
        ...blog,
        metaDescription: blog.meta_description,
        createdAt: blog.created_at,
        faqSchema: blog.faq_schema
      }));
    }
  }

  // Fallback to blogs.json
  let jsonBlogs: any[] = [];
  try {
    const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
    jsonBlogs = JSON.parse(fileContent);
  } catch (error) {
    jsonBlogs = [];
  }

  // Merge and deduplicate by slug
  const allBlogs = [...supabaseBlogs, ...jsonBlogs];
  const seenSlugs = new Set();
  const deduped = allBlogs.filter(blog => {
    if (seenSlugs.has(blog.slug)) return false;
    seenSlugs.add(blog.slug);
    return true;
  });

  // Final sort by date
  return deduped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
