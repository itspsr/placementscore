import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/programmatic.json');

export function getProgrammaticPages() {
  try {
    if (!fs.existsSync(DATA_PATH)) return [];
    const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

export function getPageBySlug(slug: string) {
  const pages = getProgrammaticPages();
  return pages.find((p: any) => p.slug === slug);
}
