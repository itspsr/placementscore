"use client";

import { useEffect, useState } from 'react';

export function AtsMeter({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2500;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOut
      setDisplay(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [score]);

  const color = display >= 75 ? 'text-green-400' : display >= 60 ? 'text-yellow-400' : 'text-orange-400';
  const glow = display >= 75 ? 'shadow-[0_0_40px_rgba(34,197,94,0.5)]' : '';

  return (
    <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-[10px] md:border-[15px] border-blue-600 flex items-center justify-center bg-black ${glow}`}>
      <span className={`text-7xl md:text-9xl font-[1000] italic tracking-tighter leading-none ${color}`}>{display}</span>
    </div>
  );
}
