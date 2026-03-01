"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function CircularGauge(props: { value: number }) {
  const v = clamp(props.value, 0, 100);
  const r = 44;
  const c = 2 * Math.PI * r;
  const off = c - (c * v) / 100;

  return (
    <div className="relative w-28 h-28">
      <div className="absolute inset-0 rounded-full bg-white/5 border border-white/10" />
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="10" fill="transparent" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          stroke="url(#ats-grad)"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={c}
          strokeDashoffset={c}
          strokeLinecap="round"
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="drop-shadow-[0_0_12px_rgba(34,197,94,0.25)]"
        />
        <defs>
          <linearGradient id="ats-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-xl font-[1000] text-white">{v}</div>
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">ATS</div>
        </div>
      </div>
    </div>
  );
}

export default function LivePreviewPanel() {
  const [avg, setAvg] = useState<number | null>(null);
  const [students, setStudents] = useState<number | null>(null);

  useEffect(() => {
    setAvg(randInt(72, 78));
    setStudents(randInt(128, 241));

    const t = setInterval(() => {
      setAvg((v) => {
        const next = randInt(72, 78);
        return v == null ? next : clamp(Math.round((v * 0.6 + next * 0.4) * 10) / 10, 72, 78);
      });
    }, 3000);

    return () => clearInterval(t);
  }, []);

  const leaderboard = useMemo(
    () => [
      { rank: 1, score: 92 },
      { rank: 2, score: 88 },
      { rank: 3, score: 85 }
    ],
    []
  );

  return (
    <div className="relative mx-auto max-w-xl rounded-3xl border border-emerald-500/15 bg-white/[0.04] backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.60)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent" />

      <div className="relative p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Live Resume Performance</div>
            <div className="mt-2 text-2xl md:text-3xl font-[1000] tracking-tighter">Today’s placement signals</div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-black uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Live
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Average placement score today</div>
            <motion.div
              key={String(avg)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 text-4xl font-[1000] tracking-tight text-emerald-200"
            >
              {avg ?? 74}%
            </motion.div>
            <div className="mt-1 text-sm text-white/40 font-semibold">Updates every ~3s</div>
          </div>

          <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Students improved today</div>
            <div className="mt-2 text-4xl font-[1000] tracking-tight text-white">{students ?? 176}</div>
            <div className="mt-1 text-sm text-white/40 font-semibold">Across Tier 1–3 colleges</div>
          </div>

          <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Mini leaderboard</div>
            <div className="mt-3 space-y-2">
              {leaderboard.map((r) => (
                <div key={r.rank} className="flex items-center justify-between text-sm font-bold">
                  <div className="text-white/70">Rank #{r.rank}</div>
                  <div className="text-emerald-200">{r.score}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-black/30 border border-white/10 p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">ATS gauge (demo)</div>
              <div className="mt-2 text-sm text-white/45 font-semibold">Fake demo score for conversion clarity.</div>
            </div>
            <CircularGauge value={74} />
          </div>
        </div>

        <div className="mt-6 text-[11px] font-black uppercase tracking-[0.25em] text-white/25">
          Glass panel • Blur • Neon green conversion polish
        </div>
      </div>
    </div>
  );
}
