import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/blog';
// NOTE: Keep sitemap focused on real, stable routes. Programmatic pages can introduce low-quality/duplicate URLs.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://placementscore.online';
  const blogs = await getBlogs();
  
  const companies = [
    'tcs',
    'infosys',
    'wipro',
    'accenture',
    'google-internship',
  ];

  const toolRoutes = [
    '/resume-word-count-checker',
    '/ats-keyword-checker',
    '/resume-headline-generator',
    '/resume-checklist-tool',
  ];

  const companyLandingRoutes = companies.flatMap((c) => [
    `/ats-score-for-${c}`,
    `/resume-for-${c}`,
  ]);

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
    ...toolRoutes,
    ...companyLandingRoutes,
    // legacy routes
    '/company-score/tcs',
    '/company-score/infosys',
    '/company-score/accenture',
    '/company-score/deloitte',
    '/company-score/google',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const blogRoutes = blogs.map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...blogRoutes];
}
