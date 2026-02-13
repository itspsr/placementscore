import { Metadata } from "next";
import Link from 'next/link';
import { getBlogs } from "@/lib/blog";
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { BackButton } from "@/components/BackButton";

export const metadata: Metadata = {
// ... existing
  title: "Career Blog & Placement Guides | PlacementScore.online",
  description: "Daily updated insights on ATS algorithms, resume optimization, and Indian campus placement strategies for 2026-2027.",
};

export default function BlogPage() {
  const blogs = getBlogs().sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      <div className="max-w-6xl mx-auto space-y-12">
        <BackButton />
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-8xl font-[1000] italic uppercase tracking-tighter">Placement Insights</h1>
          <p className="text-xl text-white/40 leading-relaxed italic max-w-2xl mx-auto">
            Expert strategies and daily updates for the 2026-2027 recruitment cycle.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog: any) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}>
              <article className="h-full p-8 bg-[#0A0A0A] rounded-[40px] border border-white/5 hover:border-blue-500/50 transition-all space-y-6 group flex flex-col">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <h2 className="text-2xl font-black text-white italic leading-tight group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h2>
                </div>
                <p className="text-white/30 text-sm leading-relaxed line-clamp-3 flex-1">
                  {blog.metaDescription}
                </p>
                <div className="pt-4 flex items-center gap-2 text-white/10 font-black text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">
                  Read Full Guide <ChevronRight className="w-3 h-3" />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[60px]">
            <p className="text-white/20 font-black uppercase tracking-widest italic">Neural Engine is generating insights...</p>
          </div>
        )}
      </div>
    </main>
  );
}
