
"use client";

import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';

const ITEMS = [
  { cat: "Formatting", items: ["Use a standard font (Arial, Calibri)", "No columns or tables", "Consistent date format (MM/YYYY)", "PDF format (unless asked for Word)"] },
  { cat: "Content", items: ["Contact info (Email, Phone, LinkedIn)", "Professional Summary (3 lines max)", "Quantified achievements (Numbers!)", "Relevant Skills section"] },
  { cat: "ATS Optimization", items: ["Standard section headers", "Keywords from Job Description included", "No graphics/icons", "File name: Name_Role_Resume.pdf"] }
];

export default function ChecklistTool() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (item: string) => {
    setChecked(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const progress = Math.round((Object.values(checked).filter(Boolean).length / ITEMS.flatMap(c => c.items).length) * 100);

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter">Resume <span className="text-blue-500">Checklist</span></h1>
              <p className="text-xl text-white/40 font-medium italic">Don't hit send until you check these.</p>
           </div>
           <div className="text-right">
              <div className="text-6xl font-[1000] italic tracking-tighter leading-none">{progress}%</div>
              <p className="font-black uppercase tracking-widest text-xs text-white/20">Ready</p>
           </div>
        </div>

        <div className="space-y-8">
           {ITEMS.map((cat) => (
              <div key={cat.cat} className="space-y-4">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-500 border-b border-white/10 pb-4">{cat.cat}</h3>
                 <div className="space-y-3">
                    {cat.items.map((item) => (
                       <div 
                         key={item} 
                         onClick={() => toggle(item)}
                         className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${checked[item] ? 'bg-green-500/10 border-green-500/20 text-white' : 'bg-[#0A0A0A] border-white/5 text-white/50 hover:bg-white/5'}`}
                       >
                          {checked[item] ? <CheckSquare className="w-6 h-6 text-green-500" /> : <Square className="w-6 h-6" />}
                          <span className="font-bold text-lg leading-tight">{item}</span>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </div>
    </main>
  );
}
