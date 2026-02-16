import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function getBlogs() {
  if (supabase) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      return data.map(blog => ({
        ...blog,
        // Compatibility mapping
        metaDescription: blog.meta_description,
        createdAt: blog.created_at,
        faqSchema: blog.faq_schema
      }));
    }
  }
  
  try {
    const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
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
