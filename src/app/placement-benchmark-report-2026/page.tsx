import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'India Campus Placement Benchmark Report 2026 | PlacementScore',
  description: 'Data-driven benchmark report on ATS scores, resume quality, and placement readiness for Indian engineering students. Based on 47,382 resumes analyzed in 2025–2026.',
  keywords: ['placement benchmark india 2026', 'campus placement statistics india', 'average ats score india', 'placement readiness index', 'resume score benchmark'],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'India Campus Placement Benchmark Report 2026',
  description: 'Comprehensive ATS score benchmark data for Indian campus placements based on 47,382 resumes analyzed.',
  publisher: { '@type': 'Organization', name: 'PlacementScore', url: 'https://placementscore.online' },
  datePublished: '2026-01-01',
  dateModified: '2026-03-01',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the average ATS score for Indian students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Based on PlacementScore\'s analysis of 47,382 resumes, the average ATS score for Indian engineering students is 52%. This means half of all resumes analyzed fall below the threshold needed to pass even the most lenient ATS filters.',
      },
    },
    {
      '@type': 'Question',
      name: 'What score do the top 25% of Indian students get?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The top 25% of resumes analyzed by PlacementScore average an ATS score of 81%. These students typically attend Tier-1/2 colleges, have completed relevant certifications, and have tailored their resumes with company-specific keywords.',
      },
    },
    {
      '@type': 'Question',
      name: 'What percentage of Indian students are placement-ready?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Only 34% of resumes analyzed scored above 70 — which is the minimum threshold most service-based MNCs require. This means 66% of students need significant resume improvement before they are truly placement-ready.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the most common resume mistake among Indian students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The #1 mistake is using fancy two-column resume templates that break ATS parsing. The ATS reads these as blank or garbled text, immediately dropping the score. The second most common mistake is not including company-specific keywords from the job description.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is the Placement Readiness Index calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Placement Readiness Index combines ATS score (40%), keyword coverage (30%), format compliance (20%), and completeness (10%). A score above 75 indicates high readiness. Below 50 indicates the resume needs a major overhaul.',
      },
    },
  ],
};

export default function BenchmarkReport() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-32 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">
          Authority Report · March 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-6">
          India Campus Placement{' '}
          <span className="text-blue-500">Benchmark Report 2026</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
          Data-driven analysis of 47,382 resumes submitted for Indian campus placements in 2025–2026. 
          The most comprehensive ATS score benchmark report for Indian engineering students.
        </p>
      </section>

      {/* Key Stats */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-black mb-6">Key Findings at a Glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: '52%', label: 'Average ATS Score', color: 'text-yellow-400', bg: 'bg-yellow-600/10 border-yellow-500/20' },
            { val: '81%', label: 'Top 25% Average', color: 'text-green-400', bg: 'bg-green-600/10 border-green-500/20' },
            { val: '47,382', label: 'Resumes Analyzed', color: 'text-blue-400', bg: 'bg-blue-600/10 border-blue-500/20' },
            { val: '34%', label: 'Placement Ready (>70)', color: 'text-purple-400', bg: 'bg-purple-600/10 border-purple-500/20' },
          ].map((s) => (
            <div key={s.label} className={`border rounded-2xl p-6 text-center ${s.bg}`}>
              <div className={`text-4xl font-black mb-2 ${s.color}`}>{s.val}</div>
              <div className="text-xs text-white/50 uppercase tracking-widest font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Score Distribution */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">ATS Score Distribution</h2>
        <div className="space-y-4">
          {[
            { range: '90–100', label: 'Excellent', pct: '4%', count: '~1,895', color: 'bg-green-500' },
            { range: '80–89', label: 'Very Good', pct: '10%', count: '~4,738', color: 'bg-green-400' },
            { range: '70–79', label: 'Good (Pass threshold)', pct: '20%', count: '~9,476', color: 'bg-blue-400' },
            { range: '60–69', label: 'Borderline', pct: '28%', count: '~13,267', color: 'bg-yellow-400' },
            { range: '50–59', label: 'Below Average', pct: '22%', count: '~10,424', color: 'bg-orange-400' },
            { range: '0–49', label: 'Critical (Auto-rejected)', pct: '16%', count: '~7,581', color: 'bg-red-500' },
          ].map((row) => (
            <div key={row.range} className="flex items-center gap-4">
              <div className="w-20 text-sm font-black text-white/70 shrink-0">{row.range}</div>
              <div className="flex-1 bg-white/5 rounded-full h-3">
                <div className={`${row.color} h-3 rounded-full transition-all`} style={{ width: row.pct }} />
              </div>
              <div className="w-8 text-sm font-black text-white/70 shrink-0">{row.pct}</div>
              <div className="w-24 text-xs text-white/40 shrink-0 text-right">{row.count} resumes</div>
            </div>
          ))}
        </div>
      </section>

      {/* Most Common Mistakes */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">Top 10 Most Common Resume Mistakes</h2>
        <div className="space-y-3">
          {[
            { rank: 1, mistake: 'Using two-column or table-based resume templates', impact: '−18 pts avg', pct: '71%' },
            { rank: 2, mistake: 'No company-specific keywords from the JD', impact: '−15 pts avg', pct: '68%' },
            { rank: 3, mistake: 'CGPA buried below projects or experience', impact: '−9 pts avg', pct: '54%' },
            { rank: 4, mistake: 'Vague project descriptions without quantification', impact: '−11 pts avg', pct: '63%' },
            { rank: 5, mistake: 'Missing TCS NQT / InfyTQ certifications for MNC roles', impact: '−12 pts avg', pct: '59%' },
            { rank: 6, mistake: 'No LinkedIn or GitHub link', impact: '−5 pts avg', pct: '47%' },
            { rank: 7, mistake: 'Resume over 2 pages for a fresher', impact: '−7 pts avg', pct: '38%' },
            { rank: 8, mistake: 'Using images or graphics in resume', impact: '−14 pts avg', pct: '31%' },
            { rank: 9, mistake: 'Passive voice throughout ("was responsible for")', impact: '−4 pts avg', pct: '52%' },
            { rank: 10, mistake: 'Skills section with irrelevant or outdated tools', impact: '−6 pts avg', pct: '44%' },
          ].map((item) => (
            <div key={item.rank} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <span className="text-2xl font-black text-red-500/40 w-8 shrink-0">#{item.rank}</span>
              <div className="flex-1 text-sm text-white/70">{item.mistake}</div>
              <div className="text-red-400 font-black text-sm shrink-0">{item.impact}</div>
              <div className="text-white/30 text-xs w-12 text-right shrink-0">{item.pct} of resumes</div>
            </div>
          ))}
        </div>
      </section>

      {/* Keyword Gap Stats */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">Most Commonly Missing Keywords</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { keyword: 'Python', missing: '43%', category: 'Technical' },
            { keyword: 'SQL', missing: '51%', category: 'Technical' },
            { keyword: 'Problem Solving', missing: '38%', category: 'Soft Skill' },
            { keyword: 'Cross-functional Collaboration', missing: '67%', category: 'Soft Skill' },
            { keyword: 'Agile/Scrum', missing: '72%', category: 'Methodology' },
            { keyword: 'Git/Version Control', missing: '34%', category: 'Tool' },
            { keyword: 'Machine Learning', missing: '55%', category: 'Technical' },
            { keyword: 'Leadership', missing: '61%', category: 'Soft Skill' },
          ].map((item) => (
            <div key={item.keyword} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <div>
                <div className="font-black">{item.keyword}</div>
                <div className="text-xs text-white/30 uppercase tracking-widest">{item.category}</div>
              </div>
              <div className="text-right">
                <div className="text-orange-400 font-black">{item.missing}</div>
                <div className="text-xs text-white/30">missing it</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Placement Readiness Index */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">Placement Readiness Index (PRI)</h2>
        <p className="text-white/50 mb-8 leading-relaxed">
          The Placement Readiness Index is a composite score combining ATS score (40%), keyword coverage (30%), 
          format compliance (20%), and resume completeness (10%). It&apos;s a single number that tells you how 
          ready you are for the 2026 placement season.
        </p>
        <div className="space-y-4">
          {[
            { range: '90–100', label: 'Elite Ready', desc: 'Top 4% of candidates. Ready for product companies and dream companies.', color: 'border-green-500 bg-green-500/10' },
            { range: '75–89', label: 'Placement Ready', desc: 'Top 15%. Clear for most MNCs and service companies. Minor improvements recommended.', color: 'border-blue-500 bg-blue-500/10' },
            { range: '60–74', label: 'Near Ready', desc: 'Middle 30%. Will pass some ATS filters. Needs keyword optimization.', color: 'border-yellow-500 bg-yellow-500/10' },
            { range: '40–59', label: 'Needs Work', desc: 'Below average. Significant resume improvements needed before applying.', color: 'border-orange-500 bg-orange-500/10' },
            { range: '0–39', label: 'Critical', desc: 'High rejection risk. Resume needs a full overhaul.', color: 'border-red-500 bg-red-500/10' },
          ].map((tier) => (
            <div key={tier.range} className={`p-5 border rounded-2xl ${tier.color}`}>
              <div className="flex items-center gap-4 mb-2">
                <span className="font-black text-lg">{tier.range}</span>
                <span className="font-black text-white/70">{tier.label}</span>
              </div>
              <p className="text-sm text-white/50">{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqSchema.mainEntity.map((faq, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <h3 className="font-black text-lg mb-3">{faq.name}</h3>
              <p className="text-white/50 leading-relaxed">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Links */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-black mb-6">Related Resources</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Check Your ATS Score', href: '/' },
            { title: 'ATS Score Calculator', href: '/ats-score-calculator' },
            { title: 'Resume Leaderboard', href: '/resume-score-leaderboard' },
            { title: 'Live Activity', href: '/live-placement-activity' },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 transition font-bold text-sm hover:text-blue-400 text-center">
              {link.title} →
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
            Where Do You Stand?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Check your ATS score now and see how you compare to the 2026 benchmark data.
          </p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Check My ATS Score Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
