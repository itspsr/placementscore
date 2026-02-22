import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://placementscore.online';

  const staticRoutes = [
    '',
    '/blog',
    '/contact',
    '/privacy',
    '/terms',
    '/faq',
    '/free-resume-template',
    '/ats-score-calculator',
    '/salary-estimator',
    '/cover-letter',
    '/linkedin-analyzer',
    '/ultimate-ats-resume-guide-2026',
    '/resume-word-count-checker',
    '/ats-keyword-checker',
    '/resume-headline-generator',
    '/resume-checklist-tool',
    '/ats-score-for-tcs',
    '/resume-for-tcs',
    '/ats-score-for-infosys',
    '/resume-for-infosys',
    '/ats-score-for-wipro',
    '/resume-for-wipro',
    '/ats-score-for-accenture',
    '/resume-for-accenture',
    '/ats-score-for-google-internship',
    '/resume-for-google-internship',
    // legacy routes
    '/company-score/tcs',
    '/company-score/infosys',
    '/company-score/accenture',
    '/company-score/deloitte',
    '/company-score/google'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (url && key) {
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('published', true);

    blogRoutes = (data || []).map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updated_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } else {
    console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE for sitemap');
  }

  return [...staticRoutes, ...blogRoutes];
}
