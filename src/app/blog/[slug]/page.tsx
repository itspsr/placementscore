import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/lib/blog";
import { ArrowLeft, Sparkles, Calendar } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { BackButton } from "@/components/BackButton";

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((blog: any) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) return { title: "Blog Not Found" };

  const canonical = `https://placementscore.online/blog/${params.slug}`;

  return {
    title: `${blog.title} | PlacementScore.online`,
    description: blog.metaDescription || blog.meta_description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: blog.title,
      description: blog.metaDescription || blog.meta_description,
      type: 'article',
      url: canonical,
      publishedTime: blog.createdAt || blog.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.metaDescription || blog.meta_description,
    }
  };
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  return `${diffDays} days ago`;
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) notFound();

  const allBlogs = await getBlogs();
  const blogKeywords: string[] = (blog.keywords || []).map((k: string) => String(k).toLowerCase());

  const related = allBlogs
    .filter((b: any) => b.slug !== blog.slug)
    .map((b: any) => {
      const kws: string[] = (b.keywords || []).map((k: string) => String(k).toLowerCase());
      const overlap = kws.filter((k) => blogKeywords.includes(k)).length;
      return { blog: b, overlap };
    })
    .sort((a: any, b: any) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((x: any) => x.blog);

  const publishedIso = blog.createdAt || blog.created_at;
  const canonical = `https://placementscore.online/blog/${blog.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.metaDescription || blog.meta_description,
    datePublished: publishedIso,
    dateModified: publishedIso,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    author: {
      "@type": "Organization",
      name: "PlacementScore.online",
    },
    publisher: {
      "@type": "Organization",
      name: "PlacementScore.online",
      logo: {
        "@type": "ImageObject",
        url: "https://placementscore.online/logo.png",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://placementscore.online/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://placementscore.online/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: canonical,
      },
    ],
  };

  const faqSchema = blog.faqSchema || blog.faq_schema;

  return (
    <article className="min-h-screen bg-[#050505] text-white p-4 md:p-6 pt-24 md:pt-32 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: typeof faqSchema === 'string' ? faqSchema : JSON.stringify(faqSchema) }}
        />
      )}
      
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
        <BackButton />

        <Link href="/blog" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Insights
        </Link>

        <header className="space-y-6 md:space-y-8">
           <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
             <Calendar className="w-3 h-3 md:w-4 md:h-4" /> {formatRelativeTime(blog.createdAt || blog.created_at)}
             <span className="text-white/10">•</span>
             <span className="text-white/30 italic">{blog.cluster}</span>
           </div>
           <h1 className="text-4xl md:text-5xl lg:text-8xl font-[1000] italic uppercase tracking-tighter leading-[0.9] text-balance break-words">
             {blog.title}
           </h1>
           <p className="text-lg md:text-2xl text-white/40 font-medium italic border-l-4 border-blue-600 pl-6 md:pl-8 leading-relaxed">
             {blog.metaDescription || blog.meta_description}
           </p>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-h1:text-3xl prose-h2:text-2xl md:prose-h2:text-4xl prose-p:text-lg md:prose-p:text-xl prose-p:text-white/50 prose-p:leading-loose prose-li:text-lg prose-li:text-white/60">
          <ReactMarkdown
            components={{
              // @ts-ignore
              a: ({node, ...props}) => <Link href={props.href || '/'} {...props} className="text-blue-500 hover:underline" />
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        {related.length > 0 && (
          <section className="pt-10 md:pt-16 border-t border-white/5">
            <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">Related Posts</h2>
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {related.map((r: any) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all">
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-500">{r.cluster}</div>
                  <div className="mt-2 font-black italic uppercase tracking-tighter text-white/80 leading-snug">
                    {r.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA SECTION */}
        <section className="mt-16 md:mt-40 p-12 md:p-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[60px] shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
             <Sparkles className="w-64 h-64 text-white" />
           </div>
           <div className="relative z-10 space-y-10 text-center">
              <h2 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-none">Check Your Score <br /> in 30 Seconds</h2>
              <p className="text-xl md:text-2xl text-white/80 font-medium italic max-w-xl mx-auto">Don't let a robot reject your future. Get your detailed ATS Audit now.</p>
              <Link href="/" className="inline-flex py-8 px-16 bg-white text-black rounded-[30px] font-[1000] text-3xl hover:bg-blue-50 transition-all uppercase italic tracking-tighter shadow-2xl hover:scale-105">
                 Analyze Resume Now
              </Link>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">🔥 Limited Student Discount Applied</p>
           </div>
        </section>
      </div>
    </article>
  );
}
