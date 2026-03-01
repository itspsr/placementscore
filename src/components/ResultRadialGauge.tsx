"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function ResultRadialGauge(props: { score: number }) {
  const target = clamp(props.score ?? 0, 0, 100);
  const [v, setV] = useState(0);

  useEffect(() => {
    // 0 -> overshoot -> settle (no bounce)
    const over = clamp(target + 5, 0, 100);
    setV(0);
    const t1 = setTimeout(() => setV(over), 50);
    const t2 = setTimeout(() => setV(target), 950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [target]);

  const r = 64;
  const c = 2 * Math.PI * r;
  const off = useMemo(() => c - (c * v) / 100, [c, v]);

  const tone = target < 60 ? "red" : target < 75 ? "yellow" : "green";

  return (
    <div className="relative inline-block">
      <div className="absolute -inset-6 rounded-full blur-3xl bg-emerald-500/15 animate-pulse" />
      <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px]">
        <div className="absolute inset-0 rounded-full bg-white/5 border border-white/10" />
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
          <circle cx="120" cy="120" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="16" fill="transparent" />
          <motion.circle
            cx="120"
            cy="120"
            r={r}
            stroke="url(#risk-grad)"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={c}
            strokeDashoffset={c}
            strokeLinecap="round"
            animate={{ strokeDashoffset: off }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="drop-shadow-[0_0_18px_rgba(34,197,94,0.22)]"
          />
          <defs>
            <linearGradient id="risk-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 grid place-items-center text-center">
          <motion.div
            key={String(target)}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-6xl md:text-7xl font-[1000] tracking-tighter">{target}%</div>
            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.5em] text-white/25">ATS Compatibility Index</div>
            <div
              className={
                "mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest " +
                (tone === "red"
                  ? "bg-red-500/10 border-red-500/25 text-red-200"
                  : tone === "yellow"
                    ? "bg-yellow-400/10 border-yellow-400/25 text-yellow-100"
                    : "bg-emerald-500/10 border-emerald-500/25 text-emerald-100")
              }
            >
              {tone === "red" ? "🔴 High Rejection Risk" : tone === "yellow" ? "🟡 Moderate" : "🟢 Strong Profile"}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
