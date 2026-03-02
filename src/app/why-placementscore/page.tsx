import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Why PlacementScore? — Built for India, Not Silicon Valley | PlacementScore',
  description: 'Why generic ATS tools fail Indian students. The manifesto behind PlacementScore — India\'s only ATS checker built specifically for campus placements, Indian MNCs, and Indian recruiters.',
  keywords: ['why placementscore', 'ats checker for indian students', 'placement resume tool india', 'ats tool vs placementscore'],
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PlacementScore',
  url: 'https://placementscore.online',
  description: 'India\'s #1 AI ATS Resume Score Platform built specifically for Indian campus placements.',
  foundingDate: '2025',
  areaServed: 'IN',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why do international ATS checkers fail Indian students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'International tools are trained on US/UK job markets where work experience dominates, CGPA is irrelevant, and company-specific keywords differ entirely. They don\'t know what "TCS NQT," "InfyTQ," or "CGPA 8.4/10" means in the Indian recruitment context. Their keyword databases are wrong for Indian JDs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes an Indian placement resume different?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Indian fresher resumes are judged by CGPA, college tier, branch of study, company-specific certifications (TCS NQT, InfyTQ), project quality, and Indian JD keyword alignment. US/UK resumes prioritize work experience, LinkedIn activity, and different skillsets. An ATS tool built for one cannot serve the other.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is PlacementScore free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The core ATS score check is completely free — no sign-up required. Upload your resume and get your score in 30 seconds. Advanced features like company-specific optimization, expert resume rewriting, and detailed keyword reports are available in the Expert Plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is PlacementScore\'s ATS simulation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PlacementScore\'s scoring engine is calibrated against real Indian JDs from TCS, Infosys, Wipro, Accenture, and 50+ other companies. We analyze keyword frequency, section structure, CGPA placement, and format compliance — the same signals Indian ATS systems actually use.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PlacementScore work for all Indian colleges?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Whether you\'re from IIT Delhi, NIT Trichy, VIT Vellore, or a local engineering college — PlacementScore analyzes your resume against the same ATS systems your target companies use. College tier affects benchmark scores, not the accuracy of the analysis.',
      },
    },
  ],
};

export default function WhyPlacementScore() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-32 pb-16 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Our Manifesto</div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-6">
          Why{' '}
          <span className="text-blue-500">PlacementScore?</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
          Generic ATS tools were not built for you. We were.
        </p>
      </section>

      {/* Section 1 */}
      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">
          Why Generic ATS Tools Fail Indian Students
        </h2>
        <div className="text-white/60 space-y-4 leading-relaxed">
          <p>
            Walk through any popular ATS checker online — Resume Worded, Jobscan, Zety — and you&apos;ll 
            notice something immediately: they score your resume against generic templates designed for 
            American or European job seekers. They don&apos;t know what TCS NQT is. They don&apos;t 
            recognize InfyTQ. They don&apos;t understand why CGPA matters. They&apos;ve never seen an 
            Indian engineering JD.
          </p>
          <p>
            When an IIT Bombay graduate with a 9.1 CGPA and three strong ML projects uploads their 
            resume to a generic ATS checker, they often score 45–55. Not because the resume is bad — 
            because the tool doesn&apos;t understand Indian resumes. It penalizes them for not having 
            &quot;work experience,&quot; doesn&apos;t recognize NPTEL certifications, and flags their CGPA format 
            as incorrect.
          </p>
          <p>
            This isn&apos;t a minor calibration issue. It&apos;s a fundamental mismatch. These tools were trained 
            on US/UK job data. They&apos;re measuring you by the wrong ruler.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">
          Why Placement Resumes ≠ International Resumes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
            <h3 className="font-black text-red-400 mb-4 uppercase text-sm tracking-widest">International Resume Logic</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>• Work experience is everything</li>
              <li>• GPA rarely mentioned after first job</li>
              <li>• Resume can be 2+ pages</li>
              <li>• Objective sections are outdated</li>
              <li>• No company-specific certifications</li>
              <li>• References &quot;available on request&quot;</li>
            </ul>
          </div>
          <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
            <h3 className="font-black text-blue-400 mb-4 uppercase text-sm tracking-widest">Indian Placement Resume Logic</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>• CGPA is a hard filter (6.5–7.0+)</li>
              <li>• Projects replace work experience</li>
              <li>• 1 page is mandatory for freshers</li>
              <li>• TCS NQT / InfyTQ certs matter</li>
              <li>• College tier signals candidate quality</li>
              <li>• Technical skills section is weighted heavily</li>
            </ul>
          </div>
        </div>
        <div className="text-white/60 space-y-4 leading-relaxed">
          <p>
            Indian campus placements operate on a completely different set of rules. Recruiters from 
            TCS, Infosys, and Wipro look at a resume and immediately scan for: CGPA ≥ threshold, 
            branch (CSE/IT preferred for software roles), relevant certifications (TCS NQT, InfyTQ), 
            project complexity, and technical skill match.
          </p>
          <p>
            Google India, Amazon, and Microsoft require a different approach — algorithm-heavy projects, 
            open source contributions, and competitive programming achievements. But still within the 
            Indian engineering graduate context, not the US new-grad context.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">
          Why Keyword Matching Alone Is Not Enough
        </h2>
        <div className="text-white/60 space-y-4 leading-relaxed">
          <p>
            Every ATS checker tells you to &quot;add keywords from the JD.&quot; That&apos;s step one — but it&apos;s not 
            the full picture. Indian ATS systems also evaluate: section structure, parsing success rate, 
            CGPA format, date formatting, file size, and — in more advanced systems — semantic relevance 
            of your project descriptions.
          </p>
          <p>
            A resume with 95% keyword coverage but a broken two-column layout will score lower than a 
            resume with 75% keyword coverage and a clean single-column structure. Why? Because the 
            ATS can&apos;t parse column-based text and treats large sections as blank — killing the score 
            regardless of what&apos;s written there.
          </p>
          <p>
            PlacementScore checks format compliance, parsing quality, keyword coverage, structural 
            integrity, and CGPA prominence — giving you a holistic score, not just a keyword count.
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-6">
          Why Recruiter Modeling Matters
        </h2>
        <div className="text-white/60 space-y-4 leading-relaxed">
          <p>
            Our scoring engine isn&apos;t just an ATS simulator — it models how Indian recruiters actually 
            behave after the ATS filter. We&apos;ve analyzed patterns across TCS NQT, Infosys InfyTQ, 
            Wipro WILP, and Accenture ASE hiring cycles to understand what human recruiters look for 
            after the automated pass.
          </p>
          <p>
            Recruiters at Indian MNCs spend an average of 6 seconds on each resume that passes the 
            ATS. In those 6 seconds, they check: (1) CGPA and college, (2) company name recognition 
            in projects, (3) skill alignment with their current hiring batch, and (4) overall visual 
            clarity. PlacementScore&apos;s Expert Plan gives you feedback on all four dimensions — not 
            just the keyword count.
          </p>
        </div>
      </section>

      {/* Section 5 — The Difference */}
      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">
          The PlacementScore Difference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { feature: 'Indian JD keyword database', desc: 'Calibrated against real TCS, Infosys, Wipro, and product company JDs from 2024–2026.' },
            { feature: 'CGPA-aware scoring', desc: 'Understands Indian CGPA format, placement, and threshold implications.' },
            { feature: 'College-tier context', desc: 'Scoring benchmarks adjusted for IIT, NIT, Deemed, and state college students.' },
            { feature: 'Format compliance check', desc: 'Detects column-based templates, images, and parsing-breaking elements.' },
            { feature: 'Company-specific guides', desc: 'Dedicated keyword guides for TCS, Infosys, Wipro, Accenture, and more.' },
            { feature: 'Placement readiness index', desc: 'Single composite score combining ATS, format, keyword, and completeness signals.' },
          ].map((item) => (
            <div key={item.feature} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-lg shrink-0">✓</span>
                <div>
                  <div className="font-black mb-1">{item.feature}</div>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-16">
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
      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: 'ATS Resume Score India', href: '/ats-resume-score-india' },
            { title: 'Placement Resume Checker', href: '/placement-resume-checker' },
            { title: 'Benchmark Report 2026', href: '/placement-benchmark-report-2026' },
            { title: 'TCS Resume Guide', href: '/company/tcs-resume-score' },
            { title: 'Resume Leaderboard', href: '/resume-score-leaderboard' },
            { title: 'Live Activity', href: '/live-placement-activity' },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 transition font-bold text-sm hover:text-blue-400">
              {link.title} →
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
            Ready to Score Your Resume?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Free. No sign-up. India&apos;s most accurate ATS checker for campus placements.
          </p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Check ATS Score Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
