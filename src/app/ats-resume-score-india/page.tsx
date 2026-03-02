import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'ATS Resume Score India — Free Checker for Indian Students 2026 | PlacementScore',
  description: 'Check your ATS resume score for free. Built for Indian students targeting TCS, Infosys, Wipro, Accenture & top MNCs. Instant score, keyword gap analysis, placement tips.',
  keywords: ['ats resume checker india', 'ats score india', 'resume score for tcs', 'resume score for infosys', 'placement resume checker india'],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an ATS resume score in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An ATS (Applicant Tracking System) resume score is a numerical rating that measures how well your resume matches the job description and passes automated screening filters used by Indian MNCs like TCS, Infosys, and Wipro. Scores above 70 generally pass the initial filter.',
      },
    },
    {
      '@type': 'Question',
      name: 'What ATS score do I need for Indian campus placements?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most Indian service-based MNCs (TCS, Infosys, Wipro), a score of 65–70 is the minimum. For product companies like Google, Amazon, or Microsoft India, you should aim for 80+. Top performers at IITs and NITs typically score between 85–95.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is PlacementScore free for Indian students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. PlacementScore offers a free ATS score check for all Indian students. Upload your PDF resume and get an instant score, keyword gap report, and actionable tips — no sign-up required for the basic scan.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is PlacementScore different from other ATS checkers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most ATS checkers are built for US/UK job markets. PlacementScore is built specifically for Indian campus placements — we understand CGPA-based filtering, Indian JD language, company-specific keyword databases (TCS NQT, Infosys InfyTQ), and the unique expectations of Indian recruiters.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the most common reasons Indian resumes fail ATS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The top reasons are: (1) Using fancy templates with tables and columns that ATS cannot parse, (2) Missing company-specific keywords like TCS NQT or Infosys InfyTQ, (3) Not including CGPA prominently, (4) Using images or graphics, (5) Not quantifying achievements with numbers.',
      },
    },
  ],
};

export default function ATSResumeScoreIndia() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">
          ATS Resume Score · India 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-6">
          ATS Resume Score India —{' '}
          <span className="text-blue-500">Free Checker for Indian Students</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed mb-8">
          India&apos;s most accurate ATS resume checker. Built specifically for TCS, Infosys, Wipro, 
          Accenture, and 50+ Indian MNCs. Get your score in 30 seconds.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-500 transition shadow-2xl shadow-blue-500/30"
        >
          Check My ATS Score Free →
        </Link>
      </section>

      {/* Stats */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: '47,382+', label: 'Resumes Analyzed' },
            { val: '52%', label: 'Avg ATS Score (India)' },
            { val: '81%', label: 'Top 25% Score' },
            { val: '34%', label: 'Pass Rate (>70 score)' },
          ].map((s) => (
            <div key={s.label} className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-blue-400 mb-1">{s.val}</div>
              <div className="text-xs text-white/50 uppercase tracking-widest font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What is ATS */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">
          What Is an ATS Score and Why Does It Matter for Indian Placements?
        </h2>
        <div className="text-white/60 space-y-4 leading-relaxed">
          <p>
            Applicant Tracking Systems (ATS) are software tools used by Indian MNCs and product companies 
            to automatically screen thousands of resumes before a human ever reads them. Companies like 
            TCS receive over 3 million applications annually — no recruiter can read them all manually. 
            ATS filters do the first cut.
          </p>
          <p>
            Your ATS score is a percentage rating from 0–100 that measures how well your resume matches 
            the job description, contains the right keywords, follows a parseable format, and meets 
            structural requirements. Resumes below the company threshold (typically 65–70 for service 
            MNCs, 80+ for product companies) are automatically rejected before any human sees them.
          </p>
          <p>
            The critical problem for Indian students: most ATS checkers in the market are built for US 
            and UK job markets. They don&apos;t understand Indian JD language, CGPA requirements, Indian 
            engineering curriculum keywords, or company-specific filters like TCS iON or Infosys InfyTQ. 
            PlacementScore is the first ATS checker built ground-up for the Indian placement ecosystem.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          How Indian MNCs Use ATS to Filter Resumes
        </h2>
        <div className="space-y-6">
          {[
            {
              step: '01',
              title: 'Resume Parsing',
              desc: 'ATS extracts text from your resume PDF. Fancy templates, columns, tables, and graphics cause parsing failures — the ATS reads blank sections and scores drop immediately.',
            },
            {
              step: '02',
              title: 'Keyword Matching',
              desc: 'The system scans for exact keywords from the job description. TCS NQT JDs use phrases like "problem solving," "Java programming," and "analytical thinking." Missing these = lower score.',
            },
            {
              step: '03',
              title: 'CGPA and Education Filter',
              desc: 'Indian ATS systems specifically look for CGPA thresholds (usually 6.5 or 7.0+). Your CGPA must be prominently placed and in standard format (X.XX/10 or XX%).',
            },
            {
              step: '04',
              title: 'Experience & Project Relevance',
              desc: 'For freshers, ATS looks at project descriptions, internship keywords, and certifications. Quantified achievements ("reduced load time by 40%") score higher than vague descriptions.',
            },
            {
              step: '05',
              title: 'Score Threshold Decision',
              desc: 'If your score clears the cutoff, your resume goes to a human recruiter. If not, it&apos;s auto-rejected. This is why 78% of resumes never reach a recruiter.',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-4xl font-black text-blue-500/30 shrink-0">{item.step}</span>
              <div>
                <h3 className="text-lg font-black mb-2">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company targets */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          ATS Score Targets by Company
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { company: 'TCS (NQT)', min: 65, recommended: 75, link: '/company/tcs-resume-score' },
            { company: 'Infosys (InfyTQ)', min: 65, recommended: 73, link: '/company/infosys-resume-score' },
            { company: 'Wipro (WILP)', min: 63, recommended: 70, link: '/company/wipro-resume-score' },
            { company: 'Accenture (ASE)', min: 66, recommended: 74, link: '/company/accenture-resume-score' },
            { company: 'Cognizant (GenC)', min: 64, recommended: 72, link: '/company/cognizant-resume-score' },
            { company: 'Google India', min: 80, recommended: 90, link: '/ats-resume-score-india' },
          ].map((co) => (
            <Link
              key={co.company}
              href={co.link}
              className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-blue-500/30 transition group"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-black group-hover:text-blue-400 transition">{co.company}</span>
                <span className="text-xs text-white/40">View Guide →</span>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-red-400">Min: {co.min}</span>
                <span className="text-green-400">Recommended: {co.recommended}+</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-black mb-6">Explore More Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'ATS Score Calculator', href: '/ats-score-calculator' },
            { title: 'Placement Resume Checker', href: '/placement-resume-checker' },
            { title: 'Why PlacementScore?', href: '/why-placementscore' },
            { title: 'AI Resume Optimization', href: '/ai-resume-optimization-india' },
            { title: 'Benchmark Report 2026', href: '/placement-benchmark-report-2026' },
            { title: 'Resume Leaderboard', href: '/resume-score-leaderboard' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 transition text-sm font-bold hover:text-blue-400"
            >
              {link.title} →
            </Link>
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

      {/* CTA */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
            Check Your ATS Score Right Now
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            78% of resumes score below 80. Find out where you stand and fix it before your next placement drive.
          </p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Check ATS Score Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
