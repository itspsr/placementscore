
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local if present, or rely on process.env
// In this environment, we rely on the agent's injected env vars.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase credentials missing.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditBlogs() {
  console.log("Starting Blog Audit...");
  
  // 1. Fetch blogs created > 1 Feb 2026
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .gte('created_at', '2026-02-01T00:00:00Z');

  if (error) {
    console.error("Error fetching blogs:", error);
    return;
  }

  console.log(`Total blogs fetched: ${blogs.length}`);

  const report = {
    total: blogs.length,
    valid: 0,
    weak: 0,
    issues: [] as any[]
  };

  const weakBlogIds: string[] = [];

  for (const blog of blogs) {
    const issues = [];
    
    // Check constraints
    if (!blog.content || blog.content.trim().length === 0) issues.push("Empty content");
    if (!blog.title) issues.push("Missing title");
    if (!blog.slug) issues.push("Missing slug");
    if (!blog.meta_description) issues.push("Missing meta_description");
    if (!blog.keywords || (Array.isArray(blog.keywords) && blog.keywords.length === 0)) issues.push("Missing keywords");
    if (!blog.faq_schema) issues.push("Missing FAQ schema");
    
    // Word count approx check (content length / 5)
    const wordCount = blog.content ? blog.content.split(/\s+/).length : 0;
    if (wordCount < 800) issues.push(`Low word count (${wordCount})`); // Using 800 as threshold for "weak" vs 1200 ideal

    if (issues.length > 0) {
      report.weak++;
      weakBlogIds.push(blog.id);
      report.issues.push({ id: blog.id, title: blog.title, slug: blog.slug, issues });
    } else {
      report.valid++;
    }
  }

  console.log("Audit Report:", JSON.stringify(report, null, 2));
  
  // Save weak IDs for regeneration step
  fs.writeFileSync('weak_blogs.json', JSON.stringify(weakBlogIds));
}

auditBlogs();
