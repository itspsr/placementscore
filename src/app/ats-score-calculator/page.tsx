"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calculator, Target, Briefcase, 
  FileText, Award, Layers, Zap, Lock, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function ScoreCalculator() {
  const [formData, setFormData] = useState({
    exp: 0,
    words: 0,
    skills: 0,
    projects: 0,
    sections: 0,
    certs: 0
  });

  const [score, setScore] = useState<number | null>(null);

  const calculate = () => {
    // Basic heuristic calculation
    let base = 40;
    base += Math.min(formData.exp * 5, 20);
    base += formData.words > 400 ? 10 : 5;
    base += Math.min(formData.skills * 2, 15);
    base += Math.min(formData.projects * 4, 12);
    base += Math.min(formData.sections * 2, 10);
    base += Math.min(formData.certs * 3, 9);
    
    setScore(Math.min(base, 98));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/[0.05] blur-[120px] rounded-full" />
      
      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-4 text-center md:text-left">
              <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-4 group">
                 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                 Back to Home
              </Link>
              <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-tight">ATS SCORE <br /> <span className="text-blue-500">CALCULATOR</span></h1>
              <p className="text-xl text-white/40 font-medium italic">Instant manual estimation based on industry standard weights.</p>
           </div>
           
           <div className="w-64 h-64 rounded-full border-[15px] border-white/5 flex flex-col items-center justify-center text-center relative group">
              <AnimatePresence mode="wait">
                {score !== null ? (
                   <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-1">
                      <span className="text-8xl font-[1000] italic tracking-tighter">{score}</span>
                      <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Estimated Score</p>
                   </motion.div>
                ) : (
                   <Calculator className="w-20 h-20 text-white/10" />
                )}
              </AnimatePresence>
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
           <div className="bg-[#0A0A0A] p-10 md:p-14 rounded-[60px] border border-white/5 shadow-2xl space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <CalcInput label="Experience (Years)" val={formData.exp} set={(v) => setFormData({...formData, exp: v})} icon={Briefcase} />
                 <CalcInput label="Word Count" val={formData.words} set={(v) => setFormData({...formData, words: v})} icon={FileText} placeholder="e.g. 500" />
                 <CalcInput label="Skills Mentioned" val={formData.skills} set={(v) => setFormData({...formData, skills: v})} icon={Target} />
                 <CalcInput label="Projects Count" val={formData.projects} set={(v) => setFormData({...formData, projects: v})} icon={Layers} />
                 <CalcInput label="Core Sections" val={formData.sections} set={(v) => setFormData({...formData, sections: v})} icon={Calculator} placeholder="Max 10" />
                 <CalcInput label="Certifications" val={formData.certs} set={(v) => setFormData({...formData, certs: v})} icon={Award} />
              </div>
              
              <button 
                onClick={calculate}
                className="w-full py-8 bg-blue-600 rounded-[30px] font-[1000] text-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 uppercase italic"
              >
                Estimate My Score
              </button>
           </div>

           <div className="space-y-8">
              <div className="bg-white/5 p-10 rounded-[50px] border border-white/5 space-y-8 relative overflow-hidden">
                 <div className={`space-y-6 transition-all duration-1000 ${score === null ? 'blur-xl opacity-20 select-none' : ''}`}>
                    <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter">Your Profile Gap Analysis</h3>
                    <p className="text-lg text-white/50 leading-relaxed italic">"Based on your input, your resume likely lacks the <strong>semantic depth</strong> required for Fortune 500 automated filters. Your projects-to-experience ratio is below standard."</p>
                    <div className="h-px bg-white/10" />
                    <div className="space-y-4">
                       <p className="text-xs font-black uppercase text-blue-500 tracking-widest flex items-center gap-2"><Zap className="w-4 h-4 fill-current" /> High Impact Fixes:</p>
                       <ul className="text-sm font-bold text-white/40 space-y-2 italic">
                          <li>• Standardize section headers for OCR parsing.</li>
                          <li>• Increase technical keyword density by 15%.</li>
                          <li>• Quantify results in at least 3 bullet points.</li>
                       </ul>
                    </div>
                 </div>
                 
                 {score === null && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-4">
                       <Lock className="w-12 h-12 text-blue-500" />
                       <h4 className="text-xl font-black uppercase italic tracking-widest">Analysis Locked</h4>
                       <p className="text-sm text-white/40 font-medium">Fill the form to unlock your manual profile estimation.</p>
                    </div>
                 )}
              </div>

              {score !== null && (
                 <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[50px] shadow-2xl text-center space-y-6">
                    <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter leading-tight text-white">Get Your Guaranteed <br /> 90+ Score Resume</h3>
                    <Link href="/" className="inline-flex py-5 px-12 bg-white text-blue-600 rounded-2xl font-[1000] text-xl shadow-xl hover:bg-black hover:text-white transition-all uppercase italic items-center gap-3">
                       Run Neural Scan <ArrowRight />
                    </Link>
                 </motion.div>
              )}
           </div>
        </div>
      </div>
    </main>
  );
}

const CalcInput = ({ label, val, set, icon: Icon, placeholder }: any) => (
  <div className="space-y-3">
     <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest">{label}</label>
     <div className="relative">
        <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input 
          type="number" 
          value={val || ""}
          onChange={(e) => set(parseInt(e.target.value) || 0)}
          placeholder={placeholder || "0"}
          className="w-full p-5 pl-14 bg-black border border-white/10 rounded-2xl outline-none focus:border-blue-600 transition-all font-black text-xl"
        />
     </div>
  </div>
);
