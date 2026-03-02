import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { companies, roles, colleges } from '@/data/seo-grid';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const company = companies.find((c) => c.slug === params.slug);
  if (!company) return { title: 'Not Found' };
  return {
    title: `${company.name} Resume Score — ATS Optimization Guide 2026 | PlacementScore`,
    description: `Learn how to optimize your resume for ${company.fullName}. Average ATS score: ${company.avgScore}. Top keywords, tips, and checklist for ${company.name} placement 2026.`,
    keywords: company.keywords,
  };
}

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = companies.find((c) => c.slug === params.slug);
  if (!company) notFound();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What ATS score do I need for ${company.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Most ${company.name} recruiters look for a minimum ATS score of 70. The average score among candidates who received interview calls was ${company.avgScore}, with top performers scoring ${company.topScore}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What keywords should I include for ${company.name} resume?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Key terms for ${company.fullName} include: ${company.keywords.join(', ')}. Also include technical skills like Java, Python, SQL, and communication skills.`,
        },
      },
      {
        '@type': 'Question',
        name: `How does ${company.name} screen resumes in 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${company.fullName} uses automated ATS software to scan resumes before human review. Resumes below a 65 ATS score are typically filtered out in the first round.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">
          Company Guide · {company.name}
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-6">
          {company.name} Resume Score —{' '}
          <span className="text-blue-500">ATS Optimization Guide 2026</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
          Everything you need to beat {company.fullName}&apos;s ATS system and land an interview
          call in the 2026 placement season. Based on analysis of thousands of resumes submitted
          to {company.name}.
        </p>
      </section>

      {/* Score Callout */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-blue-400 mb-2">{company.avgScore}</div>
            <div className="text-sm text-white/50 uppercase tracking-widest font-bold">Avg ATS Score</div>
          </div>
          <div className="bg-green-600/10 border border-green-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-green-400 mb-2">{company.topScore}</div>
            <div className="text-sm text-white/50 uppercase tracking-widest font-bold">Top Score Seen</div>
          </div>
          <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-purple-400 mb-2">70+</div>
            <div className="text-sm text-white/50 uppercase tracking-widest font-bold">Minimum to Pass</div>
          </div>
        </div>
      </section>

      {/* Keywords */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">
          Top Keywords for {company.name}
        </h2>
        <p className="text-white/60 mb-6 leading-relaxed">
          {company.fullName}&apos;s ATS system specifically scans for these high-value terms. Missing
          even two or three of these can drop your score below the shortlisting threshold.
        </p>
        <div className="flex flex-wrap gap-3">
          {[...company.keywords, 'Java', 'Python', 'SQL', 'Communication', 'Problem Solving', 'Teamwork', 'Agile', 'Git'].map((kw) => (
            <span key={kw} className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-sm font-bold text-blue-300">
              {kw}
            </span>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          5 Tips to Maximize Your {company.name} ATS Score
        </h2>
        <div className="space-y-6">
          {[
            {
              num: '01',
              title: 'Mirror the Job Description Language',
              desc: `${company.name} JDs use specific technical vocabulary. Copy exact phrases like "${company.keywords[0]}" from the JD into your resume skills section. ATS systems reward exact matches over synonyms.`,
            },
            {
              num: '02',
              title: 'Quantify Every Achievement',
              desc: `Replace vague phrases like "helped with project" with "reduced deployment time by 40% using CI/CD pipeline." ${company.name} recruiters see 500+ resumes per opening — numbers make you memorable.`,
            },
            {
              num: '03',
              title: 'Use a Standard One-Column Format',
              desc: `${company.fullName} uses standard ATS parsers that struggle with columns, tables, and text boxes. Stick to a single-column layout in Arial or Calibri, 10–12pt font, standard section headers.`,
            },
            {
              num: '04',
              title: 'Highlight CGPA and Batch Year Prominently',
              desc: `Unlike US-style resumes, Indian MNC recruiters like ${company.name} specifically filter on CGPA (usually minimum 6.5–7.0). Place it at the top under your name and contact info.`,
            },
            {
              num: '05',
              title: 'Include Relevant Certifications',
              desc: `${company.name} values certifications that signal technical readiness. Add ${company.keywords[1]} certification, plus any relevant cloud, coding, or domain certifications you hold.`,
            },
          ].map((tip) => (
            <div key={tip.num} className="flex gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-4xl font-black text-blue-500/30">{tip.num}</span>
              <div>
                <h3 className="text-lg font-black mb-2">{tip.title}</h3>
                <p className="text-white/50 leading-relaxed">{tip.desc}</p>
              </div>
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
        <h2 className="text-2xl font-black mb-6">Related Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-white/50 uppercase text-xs tracking-widest mb-3">By Role</h3>
            <div className="space-y-2">
              {roles.map((role) => (
                <Link key={role.slug} href={`/role/${role.slug}`} className="block p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 transition text-sm font-bold hover:text-blue-400">
                  {role.name} Resume Score →
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white/50 uppercase text-xs tracking-widest mb-3">By College</h3>
            <div className="space-y-2">
              {colleges.map((college) => (
                <Link key={college.slug} href={`/college/${college.slug}`} className="block p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 transition text-sm font-bold hover:text-blue-400">
                  {college.name} Placement Guide →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
            Check Your Resume for {company.name} Now
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Get an instant ATS score and see exactly how your resume performs against {company.name}&apos;s recruitment filters.
          </p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Check ATS Score Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
