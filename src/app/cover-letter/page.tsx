"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, FileText, Send, Building2, Briefcase, 
  Sparkles, Download, Lock, CreditCard, ChevronRight,
  Copy, Check, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useSession } from "next-auth/react";
import { ExpertGate } from "@/components/ExpertGate";

export default function CoverLetterGenerator() {
  const { data: session } = useSession();
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [experience, setExperience] = useState("Entry Level");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  const isExpert = session?.user?.email === "admin@placementscore.online";

  const generateLetter = async () => {
    if (!role || !company) return alert("Please fill all fields.");
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, company, experience })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Failed to generate.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!isExpert) return;
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const { height } = page.getSize();
      
      const lines = result.coverLetter.split('\n');
      let y = height - 50;
      for (const line of lines) {
        page.drawText(line, { x: 50, y, size: 10, font });
        y -= 15;
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CoverLetter_${company}.pdf`;
      link.click();
    } catch (err) {
      alert("PDF generation failed.");
    }
  };

  const copyText = () => {
    if (!isExpert) return;
    navigator.clipboard.writeText(result.coverLetter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.05] blur-[120px] rounded-full" />
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-tight italic">AI COVER <br /> <span className="text-blue-500">LETTER</span></h1>
          <p className="text-xl text-white/40 font-medium italic">Generate high-impact, ATS-optimized cover letters tailored to your target role and company.</p>
        </div>

        <ExpertGate isExpert={isExpert}>
          <div className="grid lg:grid-cols-1 gap-12 text-left">
            {!result ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0A0A] p-8 md:p-16 rounded-[60px] border border-white/5 shadow-2xl space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest text-left block">Job Role</label>
                    <div className="relative">
                        <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input 
                          type="text" 
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. SDE-1"
                          className="w-full p-6 pl-16 bg-black border border-white/10 rounded-3xl outline-none focus:border-blue-600 font-bold transition-all"
                        />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest text-left block">Target Company</label>
                    <div className="relative">
                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input 
                          type="text" 
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. TCS"
                          className="w-full p-6 pl-16 bg-black border border-white/10 rounded-3xl outline-none focus:border-blue-600 font-bold transition-all"
                        />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest text-left block">Experience</label>
                  <select 
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full p-6 bg-black border border-white/10 rounded-3xl outline-none focus:border-blue-600 font-bold appearance-none cursor-pointer"
                  >
                      <option>Fresher / Entry Level</option>
                      <option>Junior (1-3 Years)</option>
                      <option>Mid-Level (3-7 Years)</option>
                      <option>Senior (7+ Years)</option>
                  </select>
                </div>
                <button 
                  onClick={generateLetter}
                  disabled={isLoading}
                  className="w-full py-8 bg-blue-600 rounded-[40px] font-[1000] text-2xl hover:bg-blue-500 transition-all shadow-2xl flex items-center justify-center gap-4 uppercase italic disabled:opacity-50 text-white"
                >
                  {isLoading ? "Neural Processing..." : <>Generate Professional Letter <Sparkles className="w-6 h-6" /></>}
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                <div className="bg-[#0A0A0A] p-10 md:p-16 rounded-[60px] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-12">
                      <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter text-blue-500 flex items-center gap-3">
                          <FileText className="w-6 h-6" /> Generated Letter
                      </h3>
                      <div className="flex gap-4">
                          <button onClick={copyText} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
                            {isCopied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                          </button>
                          <button onClick={() => setResult(null)} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-red-600/20 transition-all text-white/40 hover:text-red-500">
                            <Trash2 className="w-6 h-6" />
                          </button>
                      </div>
                    </div>
                    
                    <div className="p-10 bg-black/50 rounded-[40px] border border-white/5 font-mono text-base leading-relaxed text-white/60 min-h-[500px] whitespace-pre-wrap">
                        {result.coverLetter}
                    </div>
                </div>
                
                <div className="flex justify-center">
                    <button onClick={downloadPDF} className="px-16 py-8 bg-white text-black rounded-[40px] font-[1000] text-3xl shadow-2xl hover:bg-blue-600 hover:text-white transition-all uppercase italic tracking-tighter flex items-center gap-4">
                      Download Optimized PDF <Download className="w-8 h-8" />
                    </button>
                </div>
              </motion.div>
            )}
          </div>
        </ExpertGate>
      </div>
    </main>
  );
}
