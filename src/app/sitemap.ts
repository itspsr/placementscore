import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://placementscore.online';
  const blogs = getBlogs();
  
  // Base static routes
  const routes = [
    '',
    '/blog',
    '/contact',
    '/privacy',
    '/terms',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog routes
  const blogRoutes = blogs.map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...blogRoutes];
}
