import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

export function getBlogs() {
  try {
    const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

export function getBlogBySlug(slug: string) {
  const blogs = getBlogs();
  return blogs.find((b: any) => b.slug === slug);
}
