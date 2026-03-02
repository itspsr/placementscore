import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { colleges, companies } from '@/data/seo-grid';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return colleges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const college = colleges.find((c) => c.slug === params.slug);
  if (!college) return { title: 'Not Found' };
  return {
    title: `${college.name} Placement Resume Guide 2026 | PlacementScore`,
    description: `Complete placement resume guide for ${college.name} students. Top companies hiring: ${college.topCompanies.join(', ')}. Average ATS score: ${college.avgScore}. Beat the filters in 2026.`,
  };
}

export default function CollegePage({ params }: { params: { slug: string } }) {
  const college = colleges.find((c) => c.slug === params.slug);
  if (!college) notFound();

  const collegeCompanies = companies.filter((co) =>
    college.topCompanies.some((tc) => tc === co.name)
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What companies hire from ${college.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Top companies that actively recruit from ${college.name} include ${college.topCompanies.join(', ')}, along with many other MNCs and service companies during the annual placement season.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the average ATS score for ${college.name} students?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The average ATS score for ${college.name} students is ${college.avgScore} on PlacementScore. Students who improve their score to 80+ see a significantly higher interview call rate from top MNCs.`,
        },
      },
      {
        '@type': 'Question',
        name: `How should ${college.name} students format their placement resume?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${college.name} students should use a clean one-page ATS-friendly format. Include CGPA (prominently), projects with quantified impact, relevant internships, technical skills, and certifications. Avoid fancy templates that confuse ATS parsers.`,
        },
      },
    ],
  };

  const tierTips: Record<string, string[]> = {
    IIT: [
      'IIT brand name carries weight — but your ATS score still matters for online filters.',
      'Highlight IIT-specific competitions: Mood Indigo, Kshitij, Techfest project work.',
      'Top companies use GPA cutoffs (typically 7.5+) as hard filters — show it prominently.',
      'Research papers and publications are ATS-scannable — include them if relevant.',
      'IIT alumni networks are powerful — use them to get referrals that bypass ATS.',
    ],
    NIT: [
      'NITs face competitive pools — your ATS score is critical to stand out.',
      'Include NIT branch-specific projects that demonstrate practical engineering skills.',
      'Get 1–2 solid internships — NIT students with internship experience score 15 points higher on average.',
      'Certifications from NPTEL, Coursera, or company programs (TCS NQT) add significant value.',
      'Target both service companies (TCS, Infosys) and product companies with tailored resumes.',
    ],
    Deemed: [
      'Deemed university students must compensate with exceptional certifications and projects.',
      'Platform achievements (LeetCode ratings, Kaggle rankings) help overcome tier bias.',
      'Build a strong GitHub profile — external validators matter when college brand is less recognized.',
      'Prepare for off-campus drives — many top companies conduct separate off-campus pools.',
      'Aim for ATS score 80+ to compensate and stand on merit of resume content.',
    ],
  };

  const tips = tierTips[college.tier] || tierTips['Deemed'];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-blue-400">College Guide</span>
          <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-xs font-black text-blue-300">{college.tier}</span>
          <span className="text-xs text-white/30">{college.city}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-6">
          {college.name}{' '}
          <span className="text-blue-500">Placement Resume Guide 2026</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
          A tailored placement guide for {college.name} students. Understand what top companies
          expect, how to beat ATS filters, and what score your peers are getting.
        </p>
      </section>

      {/* Stats */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-blue-400 mb-1">{college.avgScore}</div>
            <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Avg ATS Score</div>
          </div>
          <div className="bg-green-600/10 border border-green-500/20 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-green-400 mb-1">{college.topCompanies.length}+</div>
            <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Top Recruiters</div>
          </div>
          <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-purple-400 mb-1">2026</div>
            <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Placement Season</div>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-yellow-400 mb-1">{college.tier}</div>
            <div className="text-xs text-white/50 uppercase tracking-widest font-bold">College Tier</div>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">
          Top Companies Hiring from {college.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {college.topCompanies.map((company) => (
            <div key={company} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="font-black text-lg mb-1">{company}</div>
              <div className="text-xs text-white/40">Active recruiter from {college.name}</div>
              {collegeCompanies.find((c) => c.name === company) && (
                <Link
                  href={`/company/${collegeCompanies.find((c) => c.name === company)!.slug}`}
                  className="mt-3 block text-blue-400 text-xs font-bold hover:underline"
                >
                  View {company} Resume Guide →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* College-Specific Tips */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          {college.tier} Student Resume Tips
        </h2>
        <div className="space-y-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-2xl font-black text-blue-500/40 shrink-0">0{i + 1}</span>
              <p className="text-white/70 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">FAQs for {college.name} Students</h2>
        <div className="space-y-4">
          {faqSchema.mainEntity.map((faq, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <h3 className="font-black text-lg mb-3">{faq.name}</h3>
              <p className="text-white/50 leading-relaxed">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Links */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-black mb-4">More Company Guides</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {companies.map((co) => (
            <Link key={co.slug} href={`/company/${co.slug}`} className="block p-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm font-bold hover:text-blue-400 hover:border-blue-500/30 transition">
              {co.name} Resume Score →
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
            Check Your Resume Score as a {college.name} Student
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Get personalized ATS feedback and see how your resume ranks among {college.name} peers targeting top companies.
          </p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Check ATS Score Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
