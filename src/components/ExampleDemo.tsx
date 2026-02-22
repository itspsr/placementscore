'use client';

import { useEffect, useState } from 'react';

const DEMOS: Record<string, { before: string[]; after: string[] }> = {
  'Data Analyst': {
    before: [
      'Worked on data projects',
      'Used Excel for reports',
      'Created charts for insights',
      'Analyzed datasets during internship',
      'Basic SQL knowledge',
      'Team collaboration experience'
    ],
    after: [
      'Cleaned 200k+ rows using Python and Pandas',
      'Built SQL pipelines cutting query time by 40%',
      'Automated dashboards in Power BI for 5 teams',
      'Delivered KPI reports with 98% accuracy',
      'Applied regression models for forecasting',
      'Improved reporting turnaround by 3 days'
    ]
  },
  'Software Developer': {
    before: [
      'Built a college project in React',
      'Worked with databases',
      'Good team player',
      'Participated in hackathons',
      'Interested in backend development',
      'Basic knowledge of APIs'
    ],
    after: [
      'Built React dashboard used by 1,200+ users',
      'Optimized SQL queries reducing latency by 32%',
      'Implemented REST APIs in Node.js and Express',
      'Added CI/CD with GitHub Actions and Docker',
      'Improved Lighthouse performance score to 94',
      'Deployed on AWS EC2 with auto-scaling'
    ]
  },
  'MBA Marketing': {
    before: [
      'Worked on marketing projects',
      'Social media experience',
      'Conducted surveys',
      'Made presentations',
      'Interested in brand management',
      'Good communication skills'
    ],
    after: [
      'Increased campaign CTR by 28% on Meta ads',
      'Ran A/B tests improving conversions by 19%',
      'Built GTM plan for a new D2C launch',
      'Optimized CRM flows increasing retention by 14%',
      'Managed ₹2L monthly ad budget with 3.2x ROAS',
      'Analyzed cohort data to reduce churn by 12%'
    ]
  },
  'Mechanical Engineer': {
    before: [
      'Completed internships in production',
      'Worked on CAD models',
      'Assisted in plant operations',
      'Prepared maintenance reports',
      'Learned manufacturing processes',
      'Team collaboration experience'
    ],
    after: [
      'Reduced downtime by 22% via preventive maintenance',
      'Designed CAD assembly with 15% weight reduction',
      'Implemented 5S improving throughput by 18%',
      'Optimized BOM reducing cost by ₹1.6L annually',
      'Led Kaizen project cutting waste by 12%',
      'Built SPC charts for quality compliance'
    ]
  }
};

export default function ExampleDemo() {
  const [role, setRole] = useState('Data Analyst');
  const [beforeScore, setBeforeScore] = useState(0);
  const [afterScore, setAfterScore] = useState(0);

  useEffect(() => {
    setBeforeScore(0);
    setAfterScore(0);
    const targetBefore = 48;
    const targetAfter = 82;
    let current = 0;
    const steps = 40;
    const interval = setInterval(() => {
      current += 1;
      setBeforeScore(Math.min(targetBefore, Math.round((targetBefore * current) / steps)));
      setAfterScore(Math.min(targetAfter, Math.round((targetAfter * current) / steps)));
      if (current >= steps) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [role]);

  const demo = DEMOS[role];

  return (
    <section className="py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-[1000] italic uppercase tracking-tighter">Real ATS Score Improvement Example</h2>
          <p className="text-white/40 text-base md:text-lg max-w-2xl mx-auto">
            See how a simple resume rewrite turns a weak ATS profile into a shortlist-ready one.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white/60">
            <span>Target Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-full px-3 py-1 text-white text-xs"
            >
              {Object.keys(DEMOS).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Before</h3>
              <div className="text-red-400 font-black text-sm">{beforeScore}%</div>
            </div>
            <ul className="space-y-2 text-sm text-white/60">
              {demo.before.map((item) => (
                <li key={item} className="flex items-start gap-2"><span className="text-white/20">•</span>{item}</li>
              ))}
            </ul>
            <div className="space-y-1 text-sm font-bold text-red-400">
              <div>❌ Weak summary</div>
              <div>❌ No measurable impact</div>
              <div>❌ Missing keywords</div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60">After</h3>
              <div className="text-emerald-400 font-black text-sm">{afterScore}%</div>
            </div>
            <ul className="space-y-2 text-sm text-white/60">
              {demo.after.map((item) => (
                <li key={item} className="flex items-start gap-2"><span className="text-white/20">•</span>{item}</li>
              ))}
            </ul>
            <div className="space-y-1 text-sm font-bold text-emerald-400">
              <div>✅ Strong summary</div>
              <div>✅ Keyword coverage improved</div>
              <div>✅ Impact metrics added</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
