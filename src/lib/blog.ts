import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function getBlogs() {
  if (supabase) {
    const { data } = await supabase.from('blogs').select('*').order('createdAt', { ascending: false });
    return data || [];
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
    const { data } = await supabase.from('blogs').select('*').eq('slug', slug).single();
    return data;
  }

  const blogs = await getBlogs();
  return blogs.find((b: any) => b.slug === slug);
}
