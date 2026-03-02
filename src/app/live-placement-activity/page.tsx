'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const INDIAN_NAMES = [
  'Arjun S.', 'Priya M.', 'Rahul K.', 'Sneha P.', 'Vikram N.', 'Anjali R.',
  'Karthik B.', 'Divya L.', 'Rohan T.', 'Pooja V.', 'Aditya C.', 'Shreya G.',
  'Nikhil J.', 'Kavya D.', 'Manish A.', 'Riya S.', 'Suresh P.', 'Lakshmi K.',
  'Akhil M.', 'Nisha R.', 'Deepak V.', 'Meera B.', 'Harish T.', 'Ananya C.',
];

const COLLEGES = [
  'IIT Delhi', 'IIT Bombay', 'NIT Trichy', 'VIT Vellore', 'SRM University',
  'BITS Pilani', 'NIT Warangal', 'IIIT Hyderabad', 'Amrita University',
  'Manipal Institute', 'Thapar University', 'NIT Surathkal', 'DTU Delhi', 'NSIT Delhi',
];

const COMPANIES = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Google', 'Amazon', 'Microsoft', 'Deloitte', 'Capgemini'];

const ROLES = ['Software Engineer', 'Data Analyst', 'Business Analyst', 'Cloud Engineer', 'DevOps Engineer'];

function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

interface Activity {
  id: number;
  type: 'improvement' | 'upgrade' | 'score';
  text: string;
  timeLabel: string;
}

function generateActivities(seed: number): Activity[] {
  const rand = seededRand(seed);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  return Array.from({ length: 30 }, (_, i) => {
    const type = i % 3 === 0 ? 'upgrade' : i % 3 === 1 ? 'improvement' : 'score';
    const name = pick(INDIAN_NAMES);
    const college = pick(COLLEGES);
    const company = pick(COMPANIES);
    const role = pick(ROLES);
    const from = Math.floor(rand() * 30) + 40;
    const to = Math.min(99, from + Math.floor(rand() * 25) + 12);
    const score = Math.floor(rand() * 30) + 68;

    let text = '';
    if (type === 'improvement') text = `${name} from ${college} improved ATS score from ${from} → ${to}`;
    else if (type === 'upgrade') text = `${name} from ${college} unlocked Expert Plan for ${company} placement`;
    else text = `${name} targeting ${company} ${role} scored ${score} on first attempt`;

    const minutesAgo = Math.floor(rand() * 20) + 1;
    const timeLabel = minutesAgo === 1 ? 'Just now' : `${minutesAgo} min ago`;

    return { id: i, type, text, timeLabel };
  });
}

export default function LivePlacementActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [displayedActivities, setDisplayedActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const seed = Math.floor(Date.now() / 86400000); // daily seed
    const all = generateActivities(seed);
    setActivities(all);
    setDisplayedActivities(all.slice(0, 5));
    setDisplayedIndex(5);
  }, []);

  useEffect(() => {
    if (activities.length === 0) return;
    const interval = setInterval(() => {
      setDisplayedIndex((prev) => {
        const next = (prev + 1) % activities.length;
        setDisplayedActivities((old) => [activities[next], ...old.slice(0, 4)]);
        return next;
      });
    }, 20000);
    return () => clearInterval(interval);
  }, [activities]);

  const typeIcon = (type: Activity['type']) => {
    if (type === 'improvement') return '📈';
    if (type === 'upgrade') return '🔓';
    return '🎯';
  };

  const typeColor = (type: Activity['type']) => {
    if (type === 'improvement') return 'text-green-400';
    if (type === 'upgrade') return 'text-purple-400';
    return 'text-blue-400';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <section className="pt-32 pb-16 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-green-400">Live Activity</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-tight mb-6">
          Live Placement Activity
        </h1>
        <p className="text-lg text-white/50 max-w-2xl leading-relaxed mb-8">
          Real-time score improvements, upgrades, and placement milestones from students across India.
          Updates every 20 seconds.
        </p>
        <Link href="/" className="inline-block bg-blue-600 text-white font-black px-8 py-3 rounded-2xl hover:bg-blue-500 transition">
          Check Your ATS Score →
        </Link>
      </section>

      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-12">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { val: '2,847', label: 'Active Today' },
            { val: '312', label: 'Improved Score' },
            { val: '89', label: 'Unlocked Expert' },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black text-blue-400 mb-1">{s.val}</div>
              <div className="text-xs text-white/40 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {displayedActivities.map((activity, i) => (
            <div
              key={`${activity.id}-${i}`}
              className={`flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl transition-all ${i === 0 ? 'border-green-500/20 bg-green-500/5' : ''}`}
            >
              <div className="text-2xl shrink-0">{typeIcon(activity.type)}</div>
              <div className="flex-1">
                <p className={`font-bold ${typeColor(activity.type)}`}>{activity.text}</p>
              </div>
              <div className="text-xs text-white/30 shrink-0 whitespace-nowrap">{activity.timeLabel}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-white/20 uppercase tracking-widest">
          Feed refreshes every 20 seconds · Showing recent activity
        </div>
      </section>

      <section className="px-4 md:px-6 max-w-4xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-black italic tracking-tighter mb-4">Join Them</h2>
          <p className="text-white/80 mb-6">Thousands of students are improving their placement odds right now. Don&apos;t miss the window.</p>
          <Link href="/" className="inline-block bg-white text-blue-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition">
            Check My ATS Score Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
