import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/blog';
import { getProgrammaticPages } from '@/lib/programmatic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://placementscore.online';
  const blogs = await getBlogs();
  const pages = getProgrammaticPages();
  
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

  const dynamicRoutes = pages.map((page: any) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...dynamicRoutes];
}
