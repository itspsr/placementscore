"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Building2, Upload, FileText, 
  Target, ShieldCheck, CheckCircle2, Star
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { ExpertGate } from "@/components/ExpertGate";

interface CompanyLandingPageProps {
  company: string;
  type: 'ats-score' | 'resume';
}

export default function CompanyLandingPage({ company, type }: CompanyLandingPageProps) {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isExpert, setIsExpert] = useState(false);

  // Normalize company name for display
  const displayCompany = company.charAt(0).toUpperCase() + company.slice(1).replace(/-/g, ' ');

  useEffect(() => {
    const savedPaidStatus = localStorage.getItem('ps_is_paid_expert');
    if (savedPaidStatus === 'true' || session?.user?.email === "admin@placementscore.online") {
      setIsExpert(true);
    }
  }, [session]);

  const handleFile = (e: any) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('company', company);

      const res = await fetch('/api/company-score', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      alert(err.message || "Scan failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const titleText = type === 'ats-score' 
    ? `${displayCompany} ATS Score Checker`
    : `${displayCompany} Resume Builder`;
    
  const subtitleText = type === 'ats-score'
    ? `Check your resume's compatibility with ${displayCompany}'s recruitment software.`
    : `Create a perfect resume optimized for ${displayCompany} roles.`;

  const canonical = type === 'ats-score'
    ? `https://placementscore.online/ats-score-for-${company}`
    : `https://placementscore.online/resume-for-${company}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://placementscore.online/" },
      {
        "@type": "ListItem",
        position: 2,
        name: type === 'ats-score' ? 'ATS Score by Company' : 'Resume Formats by Company',
        item: "https://placementscore.online/",
      },
      { "@type": "ListItem", position: 3, name: displayCompany, item: canonical },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: type === 'ats-score' ? `How do I improve my ${displayCompany} ATS score?` : `How do I make my resume match ${displayCompany} requirements?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            type === 'ats-score'
              ? `Use a clean single-column format, add job-relevant keywords, quantify projects, and mirror the ${displayCompany} JD vocabulary (truthfully).`
              : `Use ATS-safe formatting, highlight relevant skills and projects, and tailor your summary + skills section to ${displayCompany} roles and campus hiring patterns.`,
        },
      },
      {
        "@type": "Question",
        name: `Is a PDF resume okay for ${displayCompany}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes—PDF is usually best for consistency. Avoid columns/tables and ensure text is selectable (not scanned images).`,
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.05] blur-[120px] rounded-full" />
      
      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-tight">
            {displayCompany} <br /> <span className="text-blue-500">{type === 'ats-score' ? 'ATS SCORE' : 'RESUME SCAN'}</span>
          </h1>
          <p className="text-xl text-white/40 font-medium italic">{subtitleText}</p>
        </div>

        <ExpertGate isExpert={isExpert}>
          <div className="grid lg:grid-cols-2 gap-12 text-left">
            {!result ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0A0A] p-10 md:p-16 rounded-[60px] border border-white/5 shadow-2xl text-center space-y-10">
                  <div className="space-y-4">
                      <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter">Upload for {displayCompany}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Targeting {displayCompany} Campus Drive 2026</p>
                  </div>

                  <div className="relative group">
                      <input type="file" id="comp-up" className="hidden" accept=".pdf" onChange={handleFile} />
                      {!file ? (
                        <label htmlFor="comp-up" className="cursor-pointer block">
                          <div className="p-16 border-2 border-dashed border-white/5 rounded-[40px] hover:border-blue-500/50 transition-all space-y-8 group/label">
                            <Upload className="w-16 h-16 text-white/5 mx-auto group-hover/label:text-blue-500 transition-colors" />
                            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white/40">Select PDF Resume</h4>
                          </div>
                        </label>
                      ) : (
                        <div className="space-y-10 py-10">
                          <FileText className="w-16 h-16 text-blue-500 mx-auto animate-bounce-slow" />
                          <h3 className="text-xl font-bold truncate px-4">{file.name}</h3>
                          <button onClick={runAnalysis} className="w-full py-6 bg-white text-black rounded-3xl font-[1000] text-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl uppercase italic">
                            {isLoading ? "SCANNING..." : `SCAN FOR ${displayCompany.toUpperCase()}`}
                          </button>
                        </div>
                      )}
                  </div>
                  <div className="flex justify-center gap-6">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/20 tracking-widest"><ShieldCheck className="w-4 h-4 text-blue-500" /> Secure</div>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/20 tracking-widest"><Target className="w-4 h-4 text-blue-500" /> Specific</div>
                  </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 md:p-16 rounded-[70px] shadow-2xl space-y-10 relative overflow-hidden text-center">
                  <div className="absolute top-0 right-0 p-10 opacity-10"><Building2 className="w-40 h-40" /></div>
                  <div className="relative z-10 space-y-8 text-center">
                      <div className="relative inline-block mx-auto">
                        <div className="w-48 h-48 rounded-full border-[15px] border-white/20 flex items-center justify-center bg-black/40">
                            <span className="text-8xl font-[1000] italic tracking-tighter">{result.score}</span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-blue-600 rounded-full text-[10px] font-[1000] uppercase tracking-widest shadow-xl">Match Score</div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter">Analysis Complete</h3>
                        <p className="text-white/60 font-medium">Your resume has been benchmarked against standard {displayCompany} filters.</p>
                      </div>
                      <button onClick={() => setResult(null)} className="text-white/40 hover:text-white font-bold text-xs uppercase tracking-widest border-b border-white/20 pb-1 mx-auto block">Scan New File</button>
                  </div>
                </motion.div>
            )}

            <div className="bg-[#0A0A0A] p-10 rounded-[50px] border border-white/5 space-y-10 relative overflow-hidden h-full">
               <div className={`space-y-10 transition-all duration-1000 ${!result ? 'filter blur-md opacity-20' : ''}`}>
                  <div className="space-y-4">
                    <h4 className="text-2xl font-[1000] italic uppercase tracking-tighter text-blue-500">Missing {displayCompany} Keywords</h4>
                    <div className="flex flex-wrap gap-4">
                        {result?.missing?.map((k: string) => (
                          <span key={k} className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-sm font-black uppercase tracking-widest text-white/50 italic">{k}</span>
                        ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-xl font-[1000] italic uppercase tracking-tighter flex items-center gap-3"><Star className="text-amber-500 w-5 h-5 fill-current" /> Priority Fixes</h4>
                    <div className="space-y-4">
                        <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex items-start gap-4">
                          <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0 mt-0.5" />
                          <p className="text-sm font-bold text-white/60 italic leading-relaxed">Adjust section hierarchy to match {displayCompany}'s preferred format.</p>
                        </div>
                        <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex items-start gap-4">
                          <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0 mt-0.5" />
                          <p className="text-sm font-bold text-white/60 italic leading-relaxed">Increase technical density to clear the {displayCompany} NQT threshold.</p>
                        </div>
                    </div>
                  </div>
               </div>

               {!result && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                    <Target className="w-12 h-12 text-white/10" />
                    <h4 className="text-xl font-black uppercase italic tracking-widest text-white/20">Awaiting Analysis</h4>
                  </div>
               )}
            </div>
          </div>
        </ExpertGate>
      </div>
    </main>
  );
}
