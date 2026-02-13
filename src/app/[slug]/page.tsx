import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getProgrammaticPages } from "@/lib/programmatic";
import { ArrowLeft, Sparkles, CheckCircle2, ChevronRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const pages = getProgrammaticPages();
  return pages.map((page: any) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = getPageBySlug(params.slug);
  if (!page) return { title: "Page Not Found" };

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://placementscore.online/${page.slug}`
    }
  };
}

export default function ProgrammaticPage({ params }: { params: { slug: string } }) {
  const page = getPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      {/* Schema Injection */}
      {page.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.schema) }}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back Home
        </Link>

        <header className="space-y-8">
           <h1 className="text-4xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-[1] text-balance">
             {page.title}
           </h1>
           <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-blue-600/10 rounded-full border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                 {page.type.replace('-', ' ')}
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                 Updated for 2026-2027
              </div>
           </div>
        </header>

        <div className="prose prose-invert max-w-none prose-h2:text-3xl prose-h2:font-black prose-h2:italic prose-h2:uppercase prose-h2:text-white prose-p:text-lg prose-p:text-white/50 prose-p:leading-relaxed">
          <ReactMarkdown>
            {page.content}
          </ReactMarkdown>
        </div>

        {/* CTA SECTION */}
        <section className="mt-24 p-10 md:p-16 bg-[#0A0A0A] rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
             <Zap className="w-48 h-48 text-blue-500" />
           </div>
           <div className="relative z-10 space-y-8 text-center">
              <h2 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter leading-none">Instant ATS Audit</h2>
              <p className="text-lg text-white/40 font-medium italic max-w-md mx-auto">See exactly where you stand against corporate filters in 30 seconds.</p>
              <Link href="/" className="inline-flex py-6 px-12 bg-blue-600 text-white rounded-3xl font-[1000] text-xl hover:bg-blue-500 transition-all uppercase italic shadow-xl">
                 Analyze My Resume
              </Link>
              <div className="flex justify-center gap-8 pt-4">
                 <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest"><ShieldCheck className="w-4 h-4 text-blue-500" /> Secure</div>
                 <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest"><BarChart3 className="w-4 h-4 text-blue-500" /> Data Driven</div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
}
