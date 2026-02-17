
"use client";

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function HeadlineGenerator() {
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("Fresher");
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    if (!role) return;
    
    const templates = [
      `${exp} ${role} seeking to leverage skills in software development for high-growth environment.`,
      `Detail-oriented ${role} with focus on scalable solutions and efficient code.`,
      `Passionate ${role} ready to contribute to engineering excellence at top MNCs.`,
      `Certified ${role} with strong foundation in DSA and System Design.`,
      `Result-driven ${role} looking for challenging opportunities in Tech.`
    ];
    
    setHeadlines(templates);
  };

  const copy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        
        <div className="text-center space-y-4">
           <h1 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter">Headline <span className="text-blue-500">Generator</span></h1>
           <p className="text-xl text-white/40 font-medium italic">Create punchy resume headlines in seconds.</p>
        </div>

        <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 space-y-8">
           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-4">Target Role</label>
                 <input 
                   type="text" 
                   value={role}
                   onChange={(e) => setRole(e.target.value)}
                   placeholder="e.g. Java Developer"
                   className="w-full p-5 bg-black border border-white/10 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-4">Experience</label>
                 <select 
                   value={exp}
                   onChange={(e) => setExp(e.target.value)}
                   className="w-full p-5 bg-black border border-white/10 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold appearance-none"
                 >
                    <option>Fresher</option>
                    <option>Entry Level</option>
                    <option>Experienced</option>
                 </select>
              </div>
           </div>
           <button onClick={generate} className="w-full py-5 bg-blue-600 rounded-[24px] font-[1000] text-xl uppercase italic hover:bg-blue-500 transition-all shadow-xl">Generate Headlines <Sparkles className="inline w-5 h-5 ml-2" /></button>
        </div>

        <div className="space-y-4">
           {headlines.map((h, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                 <p className="font-medium text-white/80">{h}</p>
                 <button onClick={() => copy(h, i)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    {copied === i ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-white/20 group-hover:text-white" />}
                 </button>
              </div>
           ))}
        </div>
      </div>
    </main>
  );
}
