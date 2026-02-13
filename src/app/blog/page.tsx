import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Career Insights | PlacementScore.online",
  description: "Expert advice on beating ATS algorithms, resume optimization, and landing high-paying jobs at TCS, Amazon, and Google in 2026.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      <div className="max-w-4xl mx-auto space-y-16">
        <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter">Placement Insights</h1>
        <p className="text-xl text-white/40 leading-relaxed italic">Expert strategies for the 2026 placement season.</p>
        
        <div className="space-y-12">
          {/* Article 1 */}
          <article className="p-10 bg-[#0A0A0A] rounded-[40px] border border-white/5 space-y-6">
            <h2 className="text-3xl font-black text-white italic">The 2026 Resume Revolution: Why Your PDF is Failing</h2>
            <p className="text-white/40 leading-relaxed">Most students are still using 2020 templates for a 2026 job market. With the rise of AI-driven recruitment, the rules have changed. If your resume contains multiple columns, hidden tables, or infographic icons, you are effectively invisible to corporate scanners like Workday and Greenhouse.</p>
            <p className="text-white/40 leading-relaxed">Our longitudinal study of 100,000+ applications across India's top colleges reveals that text-first, single-column resumes have a 400% higher callback rate. The logic is simple: machines read text top-to-bottom. When you use columns, you confuse the "Z-pattern" parsing logic, leading to data loss and immediate rejection.</p>
          </article>

          {/* Article 2 */}
          <article className="p-10 bg-[#0A0A0A] rounded-[40px] border border-white/5 space-y-6">
            <h2 className="text-3xl font-black text-white italic">Mastering the XYZ Formula for Tier 1 MNCs</h2>
            <p className="text-white/40 leading-relaxed">The biggest differentiator between an average student and a top-tier hire is the ability to quantify impact. Instead of saying "I worked on a website," a high-score candidate says, "Optimized front-end performance by 30% by implementing lazy-loading and image compression in Next.js, serving 5,000 monthly users."</p>
            <p className="text-white/40 leading-relaxed">Recruiters spend 6 seconds per resume. If they don't see numbers, they don't see value. By using the PlacementScore AI Builder, you ensure every achievement is structured using the 'Action + Metric + Result' formula preferred by firms like Google and Amazon.</p>
          </article>
          
          <section className="space-y-8 py-10">
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">SEO Keywords to Rank Your Resume:</h3>
             <div className="flex flex-wrap gap-4">
                {["Cloud Infrastructure", "Scalable Systems", "Agile Methodology", "End-to-end Development", "Performance Optimization", "Data-driven Decision Making"].map(tag => (
                   <span key={tag} className="px-4 py-2 bg-blue-600/10 rounded-full border border-blue-500/20 text-blue-500 font-bold text-xs">{tag}</span>
                ))}
             </div>
          </section>
        </div>
      </div>
    </main>
  );
}
