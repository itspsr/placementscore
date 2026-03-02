import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'AI Resume Optimization India — Boost Your ATS Score Instantly | PlacementScore',
  description: 'AI-powered resume optimization for Indian students. Boost your ATS score from 50 to 80+ with targeted keyword insertion, format fixes, and company-specific tips.',
  keywords: ['ai resume optimization india', 'resume optimization for placements', 'ai resume checker india', 'resume score boost india', 'ats optimization freshers'],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does AI resume optimization work for Indian students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PlacementScore\'s AI analyzes your resume against a database of Indian company JDs (TCS, Infosys, Wipro, etc.), identifies keyword gaps, checks ATS formatting compliance, and provides specific actionable recommendations. The average student improves their score by 23 points after following the optimization suggestions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can AI optimization guarantee placement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No tool can guarantee placement. What AI optimization does is maximize your chance of passing the ATS filter and reaching a human recruiter — which is the first critical hurdle. Students who optimize their resume to 80+ are 3x more likely to receive interview calls than those with sub-60 scores.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly can I improve my ATS score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most students see meaningful improvement in 10–30 minutes. Simple fixes like adding missing keywords, reformatting the education section, and quantifying project outcomes can jump your score by 15–25 points. More significant improvements (restructuring the entire resume) take 1–2 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is AI resume optimization safe — will my resume sound robotic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PlacementScore suggests keywords and structural improvements, but you write the content. The AI identifies what\'s missing and where — you decide how to phrase it. This ensures your resume sounds authentically human while being ATS-optimized. We never auto-generate fake experience.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between ATS optimization and resume writing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Resume writing is about crafting compelling content. ATS optimization is about making sure that content is readable and rankable by automated systems. You need both. PlacementScore focuses on the optimization layer — ensuring your already-written content passes the ATS gate.',
      },
    },
  ],
};

export default function AIResumeOptimizationIndia() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="pt-32 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">
          AI Resume Optimization · India 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-6">
          AI Resume Optimization India —{' '}
          <span className="text-blue-500">Boost Your ATS Score Instantly</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed mb-8">
          From 50 to 80+ in under 30 minutes. AI-powered analysis built for Indian campus 
          placements — not US job boards.
        </p>
        <Link href="/" className="inline-block bg-blue-600 text-white font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-500 transition shadow-2xl shadow-blue-500/30">
          Optimize My Resume Free →
        </Link>
      </section>

      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          What AI Resume Optimization Actually Fixes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              problem: 'Generic Keywords',
              fix: 'Company-Specific Keywords',
              desc: 'Replace vague skills like "good communication" with company JD-exact phrases like "cross-functional team collaboration" or "agile sprint participation."',
              icon: '🎯',
            },
            {
              problem: 'Broken ATS Format',
              fix: 'Clean Parseable Structure',
              desc: 'Convert multi-column layouts, tables, and text boxes into clean single-column formats that ATS software can parse without errors.',
              icon: '📋',
            },
            {
              problem: 'Unquantified Achievements',
              fix: 'Impact Numbers',
              desc: 'Transform "worked on machine learning project" into "built ML classifier with 94% accuracy on 10K dataset, reducing manual review time by 60%."',
              icon: '📊',
            },
            {
              problem: 'Missing Section Headers',
              fix: 'ATS-Standard Headers',
              desc: 'ATS looks for exact section names: "Work Experience" not "My Journey", "Skills" not "What I Know". Correct headers ensure proper parsing.',
              icon: '🏷️',
            },
            {
              problem: 'Buried CGPA',
              fix: 'Top-Positioned Education',
              desc: 'Indian ATS systems specifically filter for CGPA. It must appear prominently — typically within the first 20 lines of text, in standard X.XX/10 format.',
              icon: '🎓',
            },
            {
              problem: 'Missing Certifications',
              fix: 'Certification Signal Boost',
              desc: 'TCS NQT, Infosys InfyTQ, NPTEL certifications are high-weight keywords. Adding them can boost your score by 8–15 points instantly.',
              icon: '🏆',
            },
          ].map((item) => (
            <div key={item.problem} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-400/70 line-through text-sm">{item.problem}</span>
                <span className="text-white/30">→</span>
                <span className="text-green-400 text-sm font-bold">{item.fix}</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">
          Average Score Improvement by Fix Type
        </h2>
        <div className="space-y-3">
          {[
            { fix: 'Adding company-specific keywords', points: '+18 pts', width: '60%' },
            { fix: 'Fixing resume format/layout', points: '+12 pts', width: '40%' },
            { fix: 'Quantifying project achievements', points: '+9 pts', width: '30%' },
            { fix: 'Adding certifications', points: '+11 pts', width: '37%' },
            { fix: 'Fixing education section placement', points: '+7 pts', width: '23%' },
            { fix: 'Using action verbs', points: '+5 pts', width: '17%' },
          ].map((item) => (
            <div key={item.fix} className="flex items-center gap-4">
              <div className="w-48 text-sm text-white/50 shrink-0">{item.fix}</div>
              <div className="flex-1 bg-white/5 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: item.width }} />
              </div>
              <div className="text-green-400 font-black text-sm w-16 text-right">{item.points}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'ATS Resume Score India', href: '/ats-resume-score-india' },
            { title: 'Placement Resume Checker', href: '/placement-resume-checker' },
            { title: 'ATS Score Calculator', href: '/ats-score-calculator' },
            { title: 'TCS Resume Guide', href: '/company/tcs-resume-score' },
            { title: 'Benchmark Report 2026', href: '/placement-benchmark-report-2026' },
            { title: 'Why PlacementScore?', href: '/why-placementscore' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 transition font-bold text-sm hover:text-blue-400"
            >
              {link.title} →
            </Link>
          ))}
        </div>
      </section>

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

      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
            Start Optimizing Your Resume Now
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Free. No sign-up. Results in 30 seconds. Join 47,000+ Indian students who&apos;ve already optimized.
          </p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Optimize My Resume Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
