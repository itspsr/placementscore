"use client";

import React, { useState } from 'react';
import { ArrowLeft, FileText, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function WordCountCheckerClient() {
  const [text, setText] = useState("");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  let status = "neutral";
  let msg = "Paste your resume text to analyze.";

  if (wordCount > 0) {
    if (wordCount < 400) {
      status = "bad";
      msg = "Too short! ATS engines prefer 450-800 words.";
    } else if (wordCount > 1000) {
      status = "bad";
      msg = "Too long! Keep it concise (1-2 pages).";
    } else {
      status = "good";
      msg = "Perfect length for 2026 standards.";
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter">
            Resume Word <span className="text-blue-500">Counter</span>
          </h1>
          <p className="text-xl text-white/40 font-medium italic">Check if your resume meets the 450-800 word ATS sweet spot.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your full resume content here..."
              className="w-full h-96 bg-[#0A0A0A] border border-white/10 rounded-[30px] p-8 text-white/80 outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-8">
            <div
              className={`p-10 rounded-[40px] border transition-all text-center space-y-4 ${
                status === 'good'
                  ? 'bg-green-500/10 border-green-500/20'
                  : status === 'bad'
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="text-8xl font-[1000] italic tracking-tighter leading-none">{wordCount}</div>
              <p className="font-black uppercase tracking-[0.3em] text-xs opacity-50">Words</p>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                  status === 'good'
                    ? 'bg-green-500 text-white'
                    : status === 'bad'
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white/40'
                }`}
              >
                {status === 'good' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : status === 'bad' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                {status === 'neutral' ? 'Waiting...' : status === 'good' ? 'Optimized' : 'Needs Fix'}
              </div>
              <p className="text-sm font-medium italic opacity-70">{msg}</p>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[30px] space-y-4">
              <h4 className="font-black uppercase tracking-widest text-xs text-blue-500">Why it matters</h4>
              <p className="text-sm text-white/40 leading-relaxed">
                Resumes under 400 words lack keyword density for matching algorithms. Resumes over 1000 words (for freshers) get penalized for relevance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
