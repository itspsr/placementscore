"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Sparkles, Download, Mail, ShieldCheck, 
  Send, Gift, CheckCircle2, FileText, ChevronRight
} from 'lucide-react';

export default function FreeTemplate() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate database store
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
    
    // Auto redirect to upsell after 3 seconds
    setTimeout(() => {
      window.location.href = "/?plan=expert";
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden text-center">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.05] blur-[120px] rounded-full" />
      
      <div className="max-w-2xl mx-auto relative z-10 space-y-12">
        <button onClick={() => window.location.href = '/'} className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="space-y-4">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-blue-600 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20">
              <Gift className="w-10 h-10 text-white" />
           </motion.div>
           <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-tight">FREE ATS <br /> <span className="text-blue-500">RESUME TEMPLATE</span></h1>
           <p className="text-xl text-white/40 font-medium italic">Stop getting rejected. Use the template trusted by 10,000+ successful hires.</p>
        </div>

        {!isSubmitted ? (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0A0A0A] p-10 md:p-16 rounded-[60px] border border-white/5 shadow-2xl space-y-8">
            <div className="space-y-4">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter">Where should we send it?</h3>
               <p className="text-sm text-white/20 font-bold uppercase tracking-widest">Instant access to PDF + Word versions</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your best email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-7 pl-16 bg-black border border-white/10 rounded-3xl outline-none focus:border-blue-600 transition-all font-bold text-xl"
                  />
               </div>
               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full py-8 bg-blue-600 rounded-[30px] font-[1000] text-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 uppercase italic tracking-tighter"
               >
                 {isLoading ? <><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Sending...</> : <>Get My Free Template <Send className="w-6 h-6" /></>}
               </button>
            </form>

            <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
               <ShieldCheck className="text-blue-500 w-4 h-4" /> No Spam • 100% Privacy Guaranteed
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-600/10 p-16 rounded-[60px] border border-green-500/20 space-y-8">
             <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
             <div className="space-y-2">
                <h3 className="text-4xl font-[1000] italic uppercase tracking-tighter">Check Your Inbox!</h3>
                <p className="text-white/60 font-bold italic">Template sent to {email}. Redirecting to exclusive offer...</p>
             </div>
          </motion.div>
        )}

        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 space-y-4">
              <FileText className="text-blue-500 w-6 h-6" />
              <h4 className="font-black italic uppercase tracking-widest text-xs">Standard Format</h4>
              <p className="text-xs text-white/30 font-medium">100% compatible with Workday, Taleo, and iON.</p>
           </div>
           <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 space-y-4">
              <Sparkles className="text-blue-500 w-6 h-6" />
              <h4 className="font-black italic uppercase tracking-widest text-xs">AI-Ready</h4>
              <p className="text-xs text-white/30 font-medium">Pre-structured for latent semantic indexing.</p>
           </div>
           <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 space-y-4">
              <CheckCircle2 className="text-blue-500 w-6 h-6" />
              <h4 className="font-black italic uppercase tracking-widest text-xs">MNC Approved</h4>
              <p className="text-xs text-white/30 font-medium">Tested against 500+ corporate filters.</p>
           </div>
        </div>
      </div>
    </main>
  );
}
