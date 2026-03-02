import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ATS Resume Score Checker India — Free AI Score in 2026',
  description: 'Learn how ATS scoring works in India, why resumes get rejected, and how to improve your score quickly. Scan your resume free and rank higher.',
  alternates: { canonical: 'https://placementscore.online/ats-resume-score-checker-india' },
  openGraph: {
    title: 'ATS Resume Score Checker India — Free AI Score in 2026',
    description: 'Learn how ATS scoring works in India, why resumes get rejected, and how to improve your score quickly.',
    url: 'https://placementscore.online/ats-resume-score-checker-india',
    siteName: 'PlacementScore.online',
    type: 'article',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS Resume Score Checker India — Free AI Score in 2026',
    description: 'Learn how ATS scoring works in India, why resumes get rejected, and how to improve your score quickly.',
    images: ['/og-image.png']
  }
};

export default function AtsResumeScoreCheckerIndia() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is ATS score?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An ATS score indicates how well your resume matches a job description and how likely it is to pass automated screening.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is a good ATS score?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A score above 75 is competitive, while 80+ puts you in a top bracket for shortlisting.'
        }
      },
      {
        '@type': 'Question',
        name: 'How to increase ATS score?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Match keywords from the job description, keep formatting simple, and add measurable outcomes.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is this ATS checker free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can get a free score and upgrade for detailed insights.'
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      <Script
        id="jsonld-faq-ats"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter">ATS Resume Score Checker India</h1>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          If you are applying for placements or off‑campus roles in India, your resume is judged first by software, not a human.
          This is where an ATS resume score checker in India becomes critical. An Applicant Tracking System (ATS) scans your resume
          for keywords, structure, and measurable impact. Your score decides whether a recruiter ever sees your profile.
        </p>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          Most Indian students lose opportunities because their resumes are formatted for humans, not machines. Even strong candidates
          get rejected due to missing keywords, poor section labels, or lack of metrics. A clear ATS resume score gives you a
          measurable way to fix those issues before you apply.
        </p>
        <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">What is ATS and why it rejects resumes</h2>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          ATS platforms filter huge volumes of applications. In India, companies like TCS, Infosys, and Accenture receive tens of
          thousands of resumes per role. The ATS looks for exact keyword matches, correct formatting, and clear section hierarchy.
          If your score is low, the system automatically rejects your resume without any human review.
        </p>
        <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">How ATS scoring works</h2>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          An ATS score is usually calculated from keyword coverage, skills relevance, experience clarity, and measurable outcomes.
          For example, a resume that includes “Python”, “SQL”, and “React” in a skills section, and lists achievements like “improved
          API performance by 30%”, will score higher than a resume that lists only responsibilities.
        </p>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          Formatting also matters. Single‑column layouts, clear headings like “Experience” and “Projects”, and consistent bullet
          points help the ATS parse your content accurately. A score below 60 typically means the resume is missing critical
          keywords or lacks measurable results.
        </p>
        
        <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">Why ATS matters for Indian placements</h2>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          ATS resume score checker in India is not just a trend; it is a necessity. Campus hiring teams rely on ATS to shortlist
          quickly because placement seasons run on strict timelines. When thousands of candidates apply, the first cut is done by
          software. If your resume is not optimized for ATS parsing, your application may never be seen by a recruiter.
        </p>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          This is even more important for freshers. Without years of experience, your ATS score depends on clean structure, strong
          keywords, and clear project impact. A small improvement in score can move you from the rejected pile to the interview list.
        </p>

        <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">Common reasons resumes get rejected</h2>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          The most common reasons for rejection are simple: missing keywords, unsupported formatting, and vague descriptions. ATS
          tools look for exact matches like “React”, “SQL”, “Python”, or role-specific skills such as “data analysis” or “backend API”.
          If those terms are missing, your score drops sharply. The second issue is formatting—tables, columns, or images often break
          ATS parsing and lower your score automatically.
        </p>

        <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">A practical checklist to raise your score</h2>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          Use a single-column layout, label sections clearly, and mirror the job description language. Add at least three measurable
          results in your projects or internship section. For example: “Reduced API latency by 35%” or “Improved data accuracy by 20%”.
          These signals boost metric and structure scores. Keep your skills section grouped into languages, frameworks, and tools so
          the ATS can interpret your profile quickly.
        </p>

        <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">Why PlacementScore.online works</h2>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          PlacementScore.online is tuned for the Indian job market. It emphasizes campus placement requirements and the exact ATS
          patterns used in India. You get a clear score, a list of keyword gaps, and a prioritized improvement plan. This makes it
          easier to upgrade your resume in minutes instead of guessing what to change.
        </p>
        <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">Why a score below 60 fails in India</h2>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          Indian recruiters often rely on ATS filters because of high volume. A score below 60 usually indicates insufficient
          match against the job description. Even if you are technically strong, the ATS may still reject your resume.
          This is why most freshers see zero callbacks despite having solid projects and internships.
        </p>
        <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">How to improve your ATS resume score</h2>
        <p className="text-white/50 text-lg md:text-xl leading-relaxed">
          Use exact keywords from the role description, add metrics (percentages, time savings, scale), and keep formatting clean.
          Focus on measurable impact. Replace vague statements like “worked on a project” with “built a dashboard used by 500+ users”.
          These changes can move a score from the 40s into the 80s.
        </p>
        <div className="p-8 md:p-10 bg-white/[0.02] border border-white/10 rounded-3xl space-y-4">
          <p className="text-white/60">Ready to check your score?</p>
          <Link href="/" className="inline-flex px-6 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm">Scan Resume Now</Link>
        </div>
        <div className="space-y-4 text-white/50 text-lg md:text-xl leading-relaxed">
          <p>Helpful links:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><Link href="/" className="text-blue-400">Home</Link></li>
            <li><Link href="/blog/how-to-check-ats-score-for-tcs-nqt-2026" className="text-blue-400">How to Check ATS Score for TCS NQT 2026</Link></li>
            <li><Link href="/blog/ats-resume-score-explained-for-indian-students" className="text-blue-400">ATS Resume Score Explained for Indian Students</Link></li>
            <li><Link href="/blog/how-to-improve-resume-score-from-40-to-80" className="text-blue-400">How to Improve Resume Score from 40 to 80</Link></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
