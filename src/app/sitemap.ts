import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/blog';
import { companies, roles, colleges } from '@/data/seo-grid';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://placementscore.online';
  const blogs = await getBlogs();

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
    // New keyword hubs
    '/ats-resume-score-india',
    '/placement-resume-checker',
    '/ai-resume-optimization-india',
    // New feature pages
    '/placement-benchmark-report-2026',
    '/live-placement-activity',
    '/resume-score-leaderboard',
    '/why-placementscore',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : route.includes('ats-resume-score') || route.includes('placement-resume') ? 0.95 : 0.8,
  }));

  const blogRoutes = blogs.map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const companyRoutes = companies.map((c) => ({
    url: `${baseUrl}/company/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const roleRoutes = roles.map((r) => ({
    url: `${baseUrl}/role/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const collegeRoutes = colleges.map((c) => ({
    url: `${baseUrl}/college/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...companyRoutes, ...roleRoutes, ...collegeRoutes];
}
