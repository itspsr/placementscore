import { Metadata } from 'next';
import Link from 'next/link';
import { leaderboard } from '@/data/leaderboard';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Resume Score Leaderboard — Top 100 ATS Scores This Week | PlacementScore',
  description: 'See the top 100 ATS resume scores from Indian students this week. Ranked by college and role. Updated weekly. Are you on the leaderboard?',
  keywords: ['resume score leaderboard india', 'top ats score india', 'best resume score campus placement', 'ats leaderboard 2026'],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How can I get on the PlacementScore leaderboard?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scan your resume on PlacementScore, optimize it using our recommendations, and achieve a high ATS score. The leaderboard is updated weekly and shows the top 100 anonymized scores from verified resume scans.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is the leaderboard anonymous?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We anonymize all entries to protect student privacy. Resumes contain sensitive information. Only initials, college name, and target role are shown — never full names, email addresses, or resume content.',
      },
    },
    {
      '@type': 'Question',
      name: 'What score do I need to be in the top 100?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently, the minimum score to enter the top 100 is 68. The top 10 scores are above 86. To crack the top 25, you need a score of 82+. Focus on keyword optimization and format compliance to maximize your score.',
      },
    },
  ],
};

function getMedalColor(rank: number) {
  if (rank === 1) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
  if (rank === 2) return 'text-slate-300 bg-slate-300/10 border-slate-300/30';
  if (rank === 3) return 'text-amber-600 bg-amber-600/10 border-amber-600/30';
  return 'text-white/50 bg-white/[0.02] border-white/5';
}

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-400';
  if (score >= 80) return 'text-blue-400';
  if (score >= 70) return 'text-yellow-400';
  return 'text-orange-400';
}

export default function ResumeScoreLeaderboard() {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 100);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-32 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">
          Updated Weekly · March 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-6">
          Resume Score{' '}
          <span className="text-blue-500">Leaderboard</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
          Top 100 ATS resume scores from Indian students this week. All entries anonymized. 
          Updated every Monday.
        </p>
      </section>

      {/* Top 3 Podium */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-12">
        <h2 className="text-lg font-black uppercase tracking-widest text-white/30 mb-6">🏆 This Week&apos;s Top 3</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((entry) => (
            <div key={entry.rank} className={`border rounded-3xl p-8 text-center ${getMedalColor(entry.rank)}`}>
              <div className="text-4xl mb-2">{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}</div>
              <div className="text-5xl font-black mb-1">{entry.score}</div>
              <div className="text-sm font-black opacity-70 mb-3">ATS Score</div>
              <div className="text-lg font-black">{entry.initials}</div>
              <div className="text-sm opacity-70">{entry.college}</div>
              <div className="text-xs opacity-50 mt-1">{entry.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Table */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                <th className="text-left py-4 pr-4 w-16">Rank</th>
                <th className="text-left py-4 pr-4 w-24">Score</th>
                <th className="text-left py-4 pr-4">College</th>
                <th className="text-left py-4 pr-4">Role</th>
                <th className="text-right py-4 w-16">Init.</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((entry) => (
                <tr key={entry.rank} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="py-3 pr-4 text-white/40 font-black">#{entry.rank}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-lg ${getScoreColor(entry.score)}`}>{entry.score}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-1.5 w-16">
                        <div
                          className={`h-1.5 rounded-full ${entry.score >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                          style={{ width: `${entry.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-white/70">{entry.college}</td>
                  <td className="py-3 pr-4 text-sm text-white/50">{entry.role}</td>
                  <td className="py-3 text-right text-sm font-black text-white/30">{entry.initials}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center text-xs text-white/20 uppercase tracking-widest mt-6">
          Showing top 100 · Updated weekly · All entries anonymized
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8">FAQ</h2>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Check Your Score', href: '/' },
            { title: 'Benchmark Report', href: '/placement-benchmark-report-2026' },
            { title: 'Live Activity', href: '/live-placement-activity' },
            { title: 'ATS Score India', href: '/ats-resume-score-india' },
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
            Aim for the Top 100
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Start with a free ATS scan. Optimize your resume. Get on the board.
          </p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Check My ATS Score →
          </Link>
        </div>
      </section>
    </div>
  );
}
