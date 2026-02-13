"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Linkedin, Search, Target, TrendingUp, 
  Sparkles, Lock, CreditCard, ChevronRight, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { ExpertGate } from "@/components/ExpertGate";

export default function LinkedInAnalyzer() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isExpert, setIsExpert] = useState(false);

  useEffect(() => {
    const savedPaidStatus = localStorage.getItem('ps_is_paid_expert');
    if (savedPaidStatus === 'true' || session?.user?.email === "admin@placementscore.online") {
      setIsExpert(true);
    }
  }, [session]);

  const analyzeProfile = async () => {
    if (content.length < 50) return alert("Please paste more profile content.");
    setIsLoading(true);
    try {
      const res = await fetch('/api/linkedin-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      alert(err.message || "Analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.05] blur-[120px] rounded-full" />
      
      <div className="max-w-5xl mx-auto relative z-10 space-y-12 text-center lg:text-left">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-tight italic">LINKEDIN <br /> <span className="text-blue-500">ANALYZER</span></h1>
          <p className="text-xl text-white/40 font-medium italic">Audit your profile for maximum recruiter visibility and keyword density.</p>
        </div>

        <ExpertGate isExpert={isExpert}>
          <div className="grid lg:grid-cols-2 gap-12 text-left">
            <div className="space-y-8">
                <div className="bg-[#0A0A0A] p-8 md:p-12 rounded-[50px] border border-white/5 shadow-2xl space-y-8">
                  <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest text-left block">Paste Profile Content</label>
                      <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Copy your LinkedIn About + Experience text here..."
                        className="w-full h-80 p-6 bg-black border border-white/10 rounded-[32px] outline-none focus:border-blue-600 transition-all font-medium text-white/70 resize-none text-sm leading-relaxed"
                      />
                  </div>
                  <button 
                    onClick={analyzeProfile}
                    disabled={isLoading}
                    className="w-full py-7 bg-blue-600 rounded-3xl font-[1000] text-xl hover:bg-blue-500 transition-all shadow-2xl flex items-center justify-center gap-4 uppercase italic disabled:opacity-50"
                  >
                    {isLoading ? "Analyzing Metadata..." : <>Analyze My Visibility <Search className="w-6 h-6" /></>}
                  </button>
                </div>
                
                <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[40px] flex items-start gap-6 italic">
                  <AlertCircle className="text-blue-500 w-8 h-8 shrink-0" />
                  <p className="text-white/40 text-sm font-medium leading-relaxed">"Recruiters use advanced indexing to search for talent. If your section markers are missing, your profile is hidden."</p>
                </div>
            </div>

            <div>
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="bg-gradient-to-br from-[#0077b5]/20 to-blue-600/20 p-12 rounded-[60px] border border-white/5 shadow-2xl text-center space-y-6">
                          <div className="relative inline-block">
                              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                              <div className="w-40 h-40 rounded-full border-[10px] border-[#0077b5] flex items-center justify-center relative z-10 bg-black">
                                <span className="text-6xl font-[1000] italic tracking-tighter">{result.score}</span>
                              </div>
                          </div>
                          <div className="space-y-1">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Profile Authority Score</h3>
                              <p className="text-white/60 font-bold italic">High Visibility Optimized</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-2xl font-[1000] italic uppercase tracking-tighter text-blue-500">Critical Improvements</h4>
                            <div className="space-y-4">
                                {result.suggestions.map((s: string, i: number) => (
                                    <div key={i} className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex items-start gap-4">
                                      <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                                      <p className="text-sm font-bold text-white/60 leading-relaxed italic">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 border border-white/5 rounded-[60px] bg-white/[0.01]">
                        <Linkedin className="w-20 h-20 text-white/5" />
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white/20">Awaiting Profile</h3>
                          <p className="text-sm text-white/10 font-bold uppercase tracking-widest">Paste your content to start the visibility audit</p>
                        </div>
                    </div>
                  )}
                </AnimatePresence>
            </div>
          </div>
        </ExpertGate>
      </div>
    </main>
  );
}
