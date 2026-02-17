
"use client";

import React, { useState } from 'react';
import { ArrowLeft, Target, Check, X } from 'lucide-react';
import Link from 'next/link';

export default function KeywordChecker() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [results, setResults] = useState<any>(null);

  const checkKeywords = () => {
    if (!resume || !jd) return;
    
    // Extract keywords (naive extraction: words > 4 chars)
    const jdWords = jd.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const uniqueJdWords = Array.from(new Set(jdWords)); // Basic unique
    
    // Resume words
    const resumeText = resume.toLowerCase();
    
    const matched = uniqueJdWords.filter(w => resumeText.includes(w));
    const missing = uniqueJdWords.filter(w => !resumeText.includes(w));
    
    const score = Math.round((matched.length / uniqueJdWords.length) * 100) || 0;
    
    setResults({ matched, missing, score });
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        
        <div className="space-y-4">
           <h1 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter">ATS Keyword <span className="text-blue-500">Scanner</span></h1>
           <p className="text-xl text-white/40 font-medium italic">Compare your resume against a job description instantly.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-4">1. Job Description</label>
                 <textarea 
                   value={jd}
                   onChange={(e) => setJd(e.target.value)}
                   placeholder="Paste JD here..."
                   className="w-full h-64 bg-[#0A0A0A] border border-white/10 rounded-[30px] p-6 text-white/80 outline-none focus:border-blue-500 transition-all resize-none"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-4">2. Your Resume</label>
                 <textarea 
                   value={resume}
                   onChange={(e) => setResume(e.target.value)}
                   placeholder="Paste Resume here..."
                   className="w-full h-64 bg-[#0A0A0A] border border-white/10 rounded-[30px] p-6 text-white/80 outline-none focus:border-blue-500 transition-all resize-none"
                 />
              </div>
              <button onClick={checkKeywords} className="w-full py-6 bg-blue-600 rounded-[24px] font-[1000] text-xl uppercase italic hover:bg-blue-500 transition-all">Scan Match</button>
           </div>
           
           <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 h-full relative overflow-hidden">
              {!results ? (
                 <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Target className="w-32 h-32" />
                 </div>
              ) : (
                 <div className="space-y-8">
                    <div className="text-center space-y-2">
                       <div className="text-8xl font-[1000] italic tracking-tighter leading-none text-white">{results.score}%</div>
                       <p className="font-black uppercase tracking-widest text-xs text-blue-500">Keyword Match Rate</p>
                    </div>
                    
                    <div className="space-y-4">
                       <h4 className="font-black uppercase tracking-widest text-xs text-green-500 flex items-center gap-2"><Check className="w-4 h-4" /> Found ({results.matched.length})</h4>
                       <div className="flex flex-wrap gap-2">
                          {results.matched.slice(0, 10).map((w: string) => <span key={w} className="px-3 py-1 bg-green-500/10 rounded-full text-[10px] font-bold text-green-400 uppercase">{w}</span>)}
                          {results.matched.length > 10 && <span className="px-3 py-1 text-[10px] text-white/20">...</span>}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="font-black uppercase tracking-widest text-xs text-red-500 flex items-center gap-2"><X className="w-4 h-4" /> Missing ({results.missing.length})</h4>
                       <div className="flex flex-wrap gap-2">
                          {results.missing.slice(0, 10).map((w: string) => <span key={w} className="px-3 py-1 bg-red-500/10 rounded-full text-[10px] font-bold text-red-400 uppercase">{w}</span>)}
                          {results.missing.length > 10 && <span className="px-3 py-1 text-[10px] text-white/20">...</span>}
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </main>
  );
}
