import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/blog';
import { companies, roles, colleges } from '@/data/seo-grid';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
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
      '/ats-resume-score-india',
      '/placement-resume-checker',
      '/ai-resume-optimization-india',
      '/placement-benchmark-report-2026',
      '/live-placement-activity',
      '/resume-score-leaderboard',
      '/why-placementscore',
      '/ultimate-ats-resume-guide-2026',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }));

    // Fetch all blogs with safety
    let blogRoutes: any[] = [];
    try {
      const blogs = await getBlogs();
      if (Array.isArray(blogs)) {
        blogRoutes = blogs.map((blog: any) => ({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastModified: new Date(blog.createdAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      }
    } catch (err) {
      console.error("Sitemap: Failed to fetch blogs", err);
    }

    const companyRoutes = companies.map((c) => ({
      url: `${baseUrl}/company/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    const roleRoutes = roles.map((r) => ({
      url: `${baseUrl}/role/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    const collegeRoutes = colleges.map((c) => ({
      url: `${baseUrl}/college/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...blogRoutes,
      ...companyRoutes,
      ...roleRoutes,
      ...collegeRoutes,
    ];
  } catch (globalErr) {
    console.error("GLOBAL SITEMAP ERROR:", globalErr);
    return [
      {
        url: 'https://placementscore.online',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
