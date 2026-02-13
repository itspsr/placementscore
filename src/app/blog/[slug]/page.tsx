import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/lib/blog";
import { ArrowLeft, Sparkles, Calendar, BookOpen, Target, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const blogs = getBlogs();
  return blogs.map((blog: any) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = getBlogBySlug(params.slug);
  if (!blog) return { title: "Blog Not Found" };

  return {
    title: `${blog.title} | PlacementScore.online`,
    description: blog.metaDescription,
    openGraph: {
      title: blog.title,
      description: blog.metaDescription,
      type: 'article',
      publishedTime: blog.createdAt,
    }
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug);
  if (!blog) notFound();

  return (
    <article className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Insights
        </Link>

        <header className="space-y-8">
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
             <Calendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString()}
             <span className="text-white/10">•</span>
             <span className="text-white/30 italic">{blog.cluster}</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-none">
             {blog.title}
           </h1>
           <p className="text-2xl text-white/40 font-medium italic border-l-4 border-blue-600 pl-8">
             {blog.metaDescription}
           </p>
        </header>

        <div className="prose prose-invert max-w-none prose-h2:text-4xl prose-h2:font-black prose-h2:italic prose-h2:uppercase prose-h2:tracking-tighter prose-h2:text-white prose-p:text-xl prose-p:text-white/50 prose-p:leading-loose">
          <ReactMarkdown
            components={{
              // @ts-ignore
              a: ({node, ...props}) => <Link href={props.href || '/'} {...props} className="text-blue-500 hover:underline" />
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        {/* CTA SECTION */}
        <section className="mt-40 p-12 md:p-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[60px] shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
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
