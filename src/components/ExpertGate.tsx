"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CreditCard } from 'lucide-react';
import Link from 'next/link';

export function ExpertGate({ isExpert, children }: { isExpert: boolean, children: React.ReactNode }) {
  if (isExpert) return <>{children}</>;

  return (
    <div className="relative">
      <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl rounded-[60px] flex items-center justify-center p-8 border border-white/5 shadow-2xl">
        <div className="max-w-md text-center space-y-8">
          <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter">Premium Tool Locked</h2>
            <p className="text-white/40 font-medium text-sm">This AI-powered tool is exclusive to the ₹399 Expert Plan. Unlock it to accelerate your career growth.</p>
          </div>
          <Link href="/?plan=expert&view=payment" className="inline-flex w-full py-5 bg-white text-black rounded-3xl font-[1000] text-lg items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl">
            <CreditCard className="w-5 h-5" /> Upgrade to Expert — ₹399
          </Link>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">Instant Access • Secure Checkout</p>
        </div>
      </div>
      <div className="filter blur-md pointer-events-none select-none">
        {children}
      </div>
    </div>
  );
}
