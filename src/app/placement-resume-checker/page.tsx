import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Placement Resume Checker — Score Your Resume Before Campus Placements | PlacementScore',
  description: 'Free placement resume checker for Indian engineering students. Get instant ATS score, keyword analysis, and company-specific tips for TCS, Infosys, Wipro 2026 placements.',
  keywords: ['placement resume checker', 'campus placement resume', 'placement ready resume', 'resume check for placements', 'engineering resume checker india'],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What should a placement resume look like for Indian MNCs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A placement resume for Indian MNCs should be 1 page, single-column format, include CGPA prominently (minimum 6.5+), list technical skills matching the JD, include 2–3 quantified projects, and use standard section headers like Education, Skills, Projects, and Certifications. Avoid graphics, tables, or colored text.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I check if my resume is placement-ready?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your PDF resume to PlacementScore\'s free checker. You\'ll get an instant ATS score, keyword gap analysis comparing your resume against company JDs, a readability report, and specific recommendations for improvement. Aim for 75+ before applying.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a good ATS score for campus placements in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For mass recruiters (TCS, Infosys, Wipro), a score of 70+ is solid. For dream companies and product firms, aim for 80+. The top 25% of resumes analyzed by PlacementScore score 81% or higher. The national average is 52%, meaning most students have significant room to improve.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I tailor my resume for each company during placements?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, absolutely. TCS looks for TCS NQT-specific keywords. Infosys prioritizes InfyTQ certifications. Google India focuses on algorithms and system design. PlacementScore\'s company-specific guides help you tailor your resume for each target company without starting from scratch.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the most common placement resume mistakes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Top mistakes: (1) Using two-column or table-based templates that break ATS parsing, (2) Not including CGPA or burying it at the bottom, (3) Copying generic project descriptions without keywords, (4) File size over 2MB, (5) Using a .docx with complex formatting instead of clean PDF, (6) Missing certifications relevant to target companies.',
      },
    },
  ],
};

export default function PlacementResumeChecker() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="pt-32 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">
          Placement Resume Checker · India 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-6">
          Placement Resume Checker —{' '}
          <span className="text-blue-500">Score Before You Apply</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed mb-8">
          Know exactly how your resume performs before your next campus drive. 
          Instant ATS score, keyword gap, and company-specific guidance.
        </p>
        <Link href="/" className="inline-block bg-blue-600 text-white font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-500 transition shadow-2xl shadow-blue-500/30">
          Check My Resume Free →
        </Link>
      </section>

      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          Why Most Placement Resumes Fail Before a Human Reads Them
        </h2>
        <div className="text-white/60 space-y-4 leading-relaxed">
          <p>
            India&apos;s campus placement season is fiercely competitive. TCS alone receives 
            3 million+ applications annually for 40,000 seats. Infosys, Wipro, and Accenture 
            face similar volumes. The only way companies manage this at scale is through ATS 
            — Applicant Tracking Systems — that automatically screen and score every resume.
          </p>
          <p>
            The brutal truth: 78% of resumes are rejected by ATS before any recruiter reads them. 
            Not because candidates are unqualified — but because their resume format, keyword density, 
            and structure doesn&apos;t match what the ATS is scanning for. A student with a 9.2 CGPA 
            loses to a 7.5 CGPA student simply because the 7.5 CGPA student used the right keywords.
          </p>
          <p>
            PlacementScore&apos;s placement resume checker gives you the same intelligence companies 
            use — before you click submit. See exactly where your score drops, which keywords are 
            missing, and how to fix it in under 10 minutes.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          The Placement Resume Checklist (2026 Edition)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              category: 'Format & Parsing',
              items: [
                'Single-column layout (no tables)',
                'Standard PDF format, under 2MB',
                'No graphics, images, or icons',
                'Arial, Calibri, or Times New Roman font',
                '10–12pt body text, 16pt headers',
              ],
            },
            {
              category: 'Contact & Identity',
              items: [
                'Full name in large bold at top',
                'LinkedIn URL (up to date)',
                'GitHub/portfolio link (for tech roles)',
                'City, State (not full address)',
                'Professional email address',
              ],
            },
            {
              category: 'Education Section',
              items: [
                'CGPA prominently placed (X.XX/10)',
                'Graduation year clearly stated',
                'College name in full + abbreviation',
                'Branch/stream spelled out',
                '12th % if above 80%',
              ],
            },
            {
              category: 'Skills & Keywords',
              items: [
                'Company-specific keywords from JD',
                'Technical skills section (not buried)',
                'Programming languages listed',
                'Tools and frameworks explicitly named',
                'Soft skills with evidence',
              ],
            },
            {
              category: 'Projects',
              items: [
                '2–3 projects with quantified outcomes',
                'Tech stack listed for each project',
                'Action verbs: "built", "developed", "reduced"',
                'GitHub links for major projects',
                'Impact stated (users, performance, scale)',
              ],
            },
            {
              category: 'Certifications & Extra',
              items: [
                'TCS NQT / Infosys InfyTQ certifications',
                'NPTEL, Coursera, or similar courses',
                'Hackathon mentions with rank/recognition',
                'Internship experience if available',
                'No "hobbies" section (wastes space)',
              ],
            },
          ].map((section) => (
            <div key={section.category} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <h3 className="font-black text-blue-400 mb-4 uppercase text-sm tracking-widest">{section.category}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          Company-Specific Placement Resume Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'TCS Resume Guide', href: '/company/tcs-resume-score' },
            { name: 'Infosys Resume Guide', href: '/company/infosys-resume-score' },
            { name: 'Wipro Resume Guide', href: '/company/wipro-resume-score' },
            { name: 'Accenture Resume Guide', href: '/company/accenture-resume-score' },
            { name: 'Cognizant Resume Guide', href: '/company/cognizant-resume-score' },
            { name: 'All Company Guides', href: '/ats-resume-score-india' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 transition font-bold text-sm hover:text-blue-400"
            >
              {link.name} →
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
            Is Your Resume Placement-Ready?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Upload your resume now and find out your ATS score, keyword gaps, and what to fix before the next campus drive.
          </p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Check My Placement Resume →
          </Link>
        </div>
      </section>
    </div>
  );
}
