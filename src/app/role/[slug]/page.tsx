import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { roles, companies, colleges } from '@/data/seo-grid';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return roles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const role = roles.find((r) => r.slug === params.slug);
  if (!role) return { title: 'Not Found' };
  return {
    title: `${role.name} Resume ATS Score India 2026 | PlacementScore`,
    description: `Optimize your ${role.name} resume for Indian ATS systems. Average score: ${role.avgScore}. Top keywords, tips, and placement guide for 2026.`,
    keywords: role.keywords,
  };
}

export default function RolePage({ params }: { params: { slug: string } }) {
  const role = roles.find((r) => r.slug === params.slug);
  if (!role) notFound();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the average ATS score for a ${role.name} resume in India?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The average ATS score for ${role.name} resumes submitted to Indian companies is ${role.avgScore}. Top performers score ${role.topScore}. You need at least 70 to pass most company filters.`,
        },
      },
      {
        '@type': 'Question',
        name: `What keywords should a ${role.name} fresher include in their resume?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Essential keywords for ${role.name} in India include: ${role.keywords.join(', ')}. Add technical and soft skills that match the specific JD you're applying for.`,
        },
      },
      {
        '@type': 'Question',
        name: `How should a fresher format their ${role.name} resume for ATS?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use a clean single-column format. Include sections: Summary, Education, Skills, Projects, Internships, Certifications. Keep CGPA visible. Use standard fonts (Calibri, Arial). Avoid tables and graphics.`,
        },
      },
    ],
  };

  const roleTips: Record<string, string[]> = {
    'Software Engineer': [
      'List programming languages in order of proficiency with specific projects.',
      'Include LeetCode/HackerRank statistics if 100+ problems solved.',
      'Mention specific frameworks: React, Spring Boot, Node.js with versions.',
      'Show system design awareness: mention scalability, REST APIs, microservices.',
      'Link GitHub profile with green contribution graph — recruiters do check.',
    ],
    'Data Analyst': [
      'Quantify data scale: "Analyzed 2M row dataset using SQL and Python Pandas."',
      'Include dashboard and visualization tools: Power BI, Tableau, Excel.',
      'Mention statistical concepts: regression, hypothesis testing, cohort analysis.',
      'Showcase business impact of data work, not just technical tasks.',
      'List SQL proficiency explicitly — it is the #1 screened skill for DA roles.',
    ],
    'Business Analyst': [
      'Use business language: revenue impact, process efficiency, stakeholder management.',
      'Mention domain knowledge: banking, e-commerce, logistics where applicable.',
      'Include tools: JIRA, Confluence, Visio, MS Office, Tableau.',
      'Show communication skills through cross-functional project examples.',
      'Add MBA or relevant certification like CBAP if available.',
    ],
    'Cloud Engineer': [
      'Certify early: AWS Cloud Practitioner or Azure Fundamentals is highly valued.',
      'List cloud services used: EC2, S3, Lambda, RDS, VPC with specific projects.',
      'Include DevOps skills: Docker, Kubernetes, CI/CD pipelines, Terraform.',
      'Mention cost optimization work — cloud cost management impresses recruiters.',
      'Show security awareness: IAM, VPC security groups, encryption at rest.',
    ],
  };

  const tips = roleTips[role.name] || [
    'Tailor your resume keywords to match the job description exactly.',
    'Quantify achievements with specific numbers and percentages.',
    'Use a clean ATS-friendly format without tables or graphics.',
    'Include relevant certifications and online course completions.',
    'Highlight team projects and collaboration skills prominently.',
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">
          Role Guide · {role.name}
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-6">
          {role.name} Resume{' '}
          <span className="text-blue-500">ATS Score India 2026</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
          A complete guide to optimizing your {role.name} resume for Indian ATS systems. Learn
          which keywords to include, how to structure your resume, and what scores top candidates
          achieve.
        </p>
      </section>

      {/* Score Box */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-blue-400 mb-2">{role.avgScore}</div>
            <div className="text-sm text-white/50 uppercase tracking-widest font-bold">Avg ATS Score</div>
          </div>
          <div className="bg-green-600/10 border border-green-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-green-400 mb-2">{role.topScore}</div>
            <div className="text-sm text-white/50 uppercase tracking-widest font-bold">Top Score Seen</div>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-yellow-400 mb-2">70+</div>
            <div className="text-sm text-white/50 uppercase tracking-widest font-bold">Shortlisting Threshold</div>
          </div>
        </div>
      </section>

      {/* Keywords */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">
          Essential ATS Keywords for {role.name}
        </h2>
        <p className="text-white/60 mb-6 leading-relaxed">
          These keywords are specifically scanned by Indian ATS systems when hiring for {role.name}
          roles. Missing these can immediately drop your score below the shortlisting threshold.
        </p>
        <div className="flex flex-wrap gap-3">
          {role.keywords.map((kw) => (
            <span key={kw} className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-sm font-bold text-blue-300">
              {kw}
            </span>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          5 Role-Specific Tips to Boost Your Score
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

      {/* Related Links */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-black mb-6">Related Company Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {companies.map((company) => (
            <Link key={company.slug} href={`/company/${company.slug}`} className="block p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 transition text-sm font-bold hover:text-blue-400">
              {company.name} — {role.name} Resume Guide →
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/" className="text-blue-400 hover:underline text-sm font-bold">← Back to PlacementScore Home</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
            Score Your {role.name} Resume Now
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Upload your resume and get an instant ATS score with specific feedback for {role.name} roles in India.
          </p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Check ATS Score Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
