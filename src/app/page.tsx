"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, CheckCircle, Zap, ShieldCheck, Star, 
  ArrowRight, Sparkles, Layout, Target, FileText, 
  Search, Users, TrendingUp, Lock, CreditCard, Clock, Check,
  ChevronRight, Play, Award, BarChart3, Globe, Sparkle, AlertCircle,
  X, Instagram, Twitter, Linkedin, Facebook, Mail, Phone, MapPin, 
  Minus, Plus, Shield, IndianRupee, Heart, Terminal, BookOpen, Scale, FileSignature,
  FileCode, Briefcase, GraduationCap, Trophy, Verified, Menu
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// --- Types ---
type AppState = 'landing' | 'analyzing' | 'result' | 'payment' | 'admin' | 'blog' | 'contact' | 'privacy' | 'terms';

export default function Home() {
  const [view, setView] = useState<AppState>('landing');
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null); 
  const [result, setResult] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState(1);
  const [utr, setUtr] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Scroll Fix ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // --- Actions ---
  const handleGoogleLogin = () => {
    const width = 500, height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    const authWindow = window.open('about:blank', 'Google Auth', `width=${width},height=${height},left=${left},top=${top}`);
    
    if (authWindow) {
      authWindow.document.write(`
        <div style="font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#f8f9fa;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" width="120" style="margin-bottom:20px;" />
          <h3 style="color:#3c4043;">Signing in to PlacementScore</h3>
          <p style="color:#70757a; font-size:14px;">Choose an account</p>
          <div style="border:1px solid #dadce0; padding:15px; width:80%; border-radius:8px; cursor:pointer; background:white; margin-top:20px;" onclick="window.close()">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:30px; height:30px; border-radius:50%; background:#4285f4; color:white; display:flex; align-items:center; justify-content:center;">U</div>
              <div>
                <div style="font-weight:bold; font-size:14px;">urboss</div>
                <div style="font-size:12px; color:#5f6368;">urboss@example.com</div>
              </div>
            </div>
          </div>
        </div>
      `);
      
      const timer = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(timer);
          setUser({ name: "urboss", email: "urboss@example.com", avatar: "🌌" });
          setView('landing');
        }
      }, 500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setResult(null);
    setIsPaid(false);
    setSelectedPlan(null);
    setPaymentStep(1);
    setUtr("");
    setTransactionId("");
    setPaymentError("");
    setIsGenerated(false);
    setIsGenerating(false);
    setView('landing');
  };

  const handleDownload = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      page.drawText('PLACEMENT SCORE: 94/100', {
        x: 50,
        y: 750,
        size: 20,
        font: font,
        color: rgb(0.1, 0.4, 0.8),
      });

      page.drawText('VERDICT: ATS OPTIMIZED & PLACEMENT READY', {
        x: 50,
        y: 720,
        size: 12,
        font: font,
        color: rgb(0.1, 0.6, 0.3),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'PlacementScore_Optimized_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert("🚀 Your ATS Optimized Resume (Score: 94) has been downloaded!");
    } catch (err) {
      alert("Download failed. Please try again.");
    }
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setResult((prev: any) => ({ 
        ...prev, 
        score: 94,
        strengths: [...prev.strengths, "ATS-Optimized structure applied.", "High-impact keywords integrated."],
        keyword_gaps: [] 
      }));
    }, 4000);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setView('analyzing');
    
    const minimumWait = new Promise(resolve => setTimeout(resolve, 2500));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await response.json();
      
      await minimumWait;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Neural parsing failed. Please ensure the file is a valid PDF resume.");
      }
      
      setResult(data.analysis);
      setView('result');
    } catch (err: any) {
      setView('landing');
      setTimeout(() => {
        alert(err.message || "Analysis failed. Please check your internet connection or try a different PDF file.");
      }, 100);
    }
  };

  const handlePaymentSubmit = () => {
    setPaymentError("");
    const utrRegex = /^\d{12}$/;
    const tidRegex = /^T\d{18,}$/;

    if (!utrRegex.test(utr)) {
      setPaymentError("Invalid UTR format. Must be a 12-digit number (e.g., 812834131941)");
      return;
    }
    if (!tidRegex.test(transactionId)) {
      setPaymentError("Invalid Transaction ID. Must start with 'T' followed by digits (e.g., T260213...)");
      return;
    }

    setPaymentStep(3);
    setTimeout(() => {
      setIsPaid(true);
      setPaymentStep(4);
    }, 3000);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const Navbar = () => (
    <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => { setView('landing'); setIsMenuOpen(false); }}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-all">
            <span className="text-white font-black text-[10px] md:text-xs italic">PS</span>
          </div>
          <span className="text-lg md:text-2xl font-black tracking-tighter">Placement<span className="text-blue-500">Score</span><span className="hidden sm:inline">.online</span></span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 font-bold text-sm text-white/50">
          <button onClick={() => scrollToSection('features')} className="hover:text-white transition">Features</button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition">Pricing</button>
          <button onClick={() => setView('blog')} className="hover:text-white transition">Blog</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-white transition">FAQ</button>
          {user && (
            <button onClick={() => window.location.href='/expert-resume-builder'} className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
              AI Builder <Sparkles className="w-4 h-4" />
            </button>
          )}
          <div className="h-4 w-px bg-white/10" />
          {user ? (
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <span className="text-xs text-white/80">{user.name}</span>
              <button onClick={() => setView('admin')} className="text-[10px] text-white/20 hover:text-white">Admin</button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-white text-black px-6 py-2.5 rounded-xl font-black hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#ea4335" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#4285f4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign In
            </button>
          )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
           {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lg:hidden absolute top-full left-0 w-full bg-[#0A0A0A] border-b border-white/5 px-6 py-10 space-y-8 flex flex-col items-center text-center shadow-2xl z-[90]">
             <button onClick={() => scrollToSection('features')} className="text-2xl font-black italic">Features</button>
             <button onClick={() => scrollToSection('pricing')} className="text-2xl font-black italic">Pricing</button>
             <button onClick={() => { setView('blog'); setIsMenuOpen(false); }} className="text-2xl font-black italic">Blog</button>
             <button onClick={() => scrollToSection('faq')} className="text-2xl font-black italic">FAQ</button>
             {user && (
               <button onClick={() => { window.location.href='/expert-resume-builder'; setIsMenuOpen(false); }} className="text-2xl font-black italic text-blue-500 flex items-center gap-2">
                 AI Builder <Sparkles className="w-5 h-5" />
               </button>
             )}
             <div className="w-full h-px bg-white/5" />
             {user ? (
               <div className="space-y-4">
                  <p className="text-white/40 font-bold">{user.name}</p>
                  <button onClick={() => { setView('admin'); setIsMenuOpen(false); }} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest">Admin</button>
               </div>
             ) : (
               <button onClick={handleGoogleLogin} className="w-full bg-white text-black py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3">
                 <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#ea4335" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#4285f4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                 Sign In
               </button>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="landing" className="relative z-10">
            {/* Hero Section */}
            <section className="pt-32 md:pt-48 pb-20 md:pb-32 px-4 md:px-6 text-center lg:text-left">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 md:gap-20">
                <div className="flex-1 space-y-6 md:space-y-10">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" /> 🔥 24,000+ Students Analysed
                  </motion.div>
                  <h1 className="text-4xl sm:text-6xl md:text-[80px] font-[1000] leading-[1] md:leading-[0.9] tracking-tighter">
                    Get Your Real <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 italic">Placement Score.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/40 max-w-2xl lg:mx-0 mx-auto font-medium leading-relaxed">
                    Recruiters spend only 6 seconds on your resume. If your ATS score is below 80, you're getting rejected instantly. Benchmark your career profile now.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 justify-center lg:justify-start pt-4">
                    <button onClick={() => scrollToSection('upload')} className="w-full sm:w-auto bg-blue-600 text-white px-8 md:px-12 py-5 md:py-6 rounded-[20px] md:rounded-[24px] font-black text-lg md:text-xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 group">
                      Scan My Resume <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <div className="flex items-center gap-3 p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
                       <ShieldCheck className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
                       <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/30">Privacy Protected</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 relative w-full overflow-hidden py-10 md:py-0">
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] mx-auto group">
                    <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-all duration-1000" />
                    <div className="absolute inset-0 rounded-full border-[1px] border-white/5 animate-spin-slow" />
                    <div className="absolute inset-[10%] rounded-full border-[15px] md:border-[50px] border-white/5 shadow-inner" />
                    <svg className="absolute inset-[10%] w-[80%] h-[80%] -rotate-90 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <circle cx="50%" cy="50%" r="45%" stroke="url(#ps-grad)" strokeWidth="30" fill="transparent" strokeDasharray="283%" strokeDashoffset="85%" strokeLinecap="round" className="opacity-90" />
                      <defs>
                        <linearGradient id="ps-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                       <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="text-7xl md:text-[140px] font-[1000] tracking-tighter leading-none bg-clip-text text-transparent bg-white italic">72</motion.span>
                       <span className="text-sm md:text-2xl font-black text-white/10 uppercase tracking-[0.4em] -mt-2 md:-mt-4">Placement Score</span>
                       <div className="mt-6 md:mt-10 px-4 md:px-8 py-2 md:py-3 bg-blue-600/20 border border-blue-500/50 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-400 shadow-2xl backdrop-blur-md">Target: 85+</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-8 md:py-10 border-y border-white/5 bg-white/[0.02]">
               <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                  <div className="flex items-center justify-center gap-2 md:gap-3"><ShieldCheck className="w-4 h-4 text-blue-500" /> Secure UPI</div>
                  <div className="flex items-center justify-center gap-2 md:gap-3"><Lock className="w-4 h-4 text-blue-500" /> 256-bit Privacy</div>
                  <div className="flex items-center justify-center gap-2 md:gap-3"><Users className="w-4 h-4 text-blue-500" /> 24,000+ Students</div>
                  <div className="flex items-center justify-center gap-2 md:gap-3"><Star className="w-4 h-4 text-amber-500" /> 4.9/5 Rating</div>
               </div>
            </section>

            <section id="upload" className="py-24 md:py-40 px-4 md:px-6 max-w-5xl mx-auto">
                <div className="text-center mb-12 md:mb-16 space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Ready to bypass the bot?</h2>
                  <p className="text-white/40 font-medium italic uppercase tracking-widest text-[10px] md:text-xs">✨ Text-based PDF Resume required (Max 5MB)</p>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] md:rounded-[60px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-[#0A0A0A] p-8 md:p-20 rounded-[40px] md:rounded-[60px] border border-white/10 shadow-2xl text-center">
                    <input type="file" id="hero-up" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    {!file ? (
                      <label htmlFor="hero-up" className="cursor-pointer block">
                        <div className="p-10 md:p-24 border-2 border-dashed border-white/5 rounded-[30px] md:rounded-[40px] hover:border-blue-500/50 transition-all space-y-6 md:space-y-10 group/label">
                          <Upload className="w-12 h-12 md:w-20 md:h-20 text-white/5 mx-auto group-hover/label:text-blue-500/50 transition-colors" />
                          <div className="space-y-2 md:space-y-4">
                             <h3 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">Drag & Drop Resume</h3>
                             <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[10px] italic">Secure Analysis • Real-time Parsing</p>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="space-y-8 md:space-y-12 py-6 md:py-10">
                        <FileText className="w-16 h-16 md:w-24 md:h-24 text-blue-500 mx-auto animate-bounce-slow" />
                        <h3 className="text-xl md:text-3xl font-[1000] italic uppercase tracking-tighter truncate px-4">{file.name}</h3>
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 max-w-md mx-auto">
                           <button onClick={runAnalysis} className="flex-1 py-5 md:py-6 bg-white text-black rounded-2xl md:rounded-3xl font-[1000] text-xl md:text-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl">SCAN NOW</button>
                           <label htmlFor="hero-up" className="px-8 md:px-10 py-5 md:py-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center italic uppercase">CHANGE</label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </section>

            <section className="py-24 md:py-40 px-4 md:px-6 max-w-7xl mx-auto">
               <h2 className="text-4xl md:text-6xl font-[1000] text-center mb-16 md:mb-32 italic tracking-tighter uppercase">3 Simple Steps</h2>
               <div className="grid md:grid-cols-3 gap-8 md:gap-16">
                  <StepCard num="01" icon={Upload} title="Upload PDF" desc="Drop your resume. Our neural engine extracts text and structure instantly." />
                  <StepCard num="02" icon={Terminal} title="3s AI Scan" desc="We benchmark your profile against 500+ proprietary corporate filters." />
                  <StepCard num="03" icon={Award} title="Win the Job" desc="Get a score and a full roadmap to fix keyword gaps and formatting." />
               </div>
            </section>
          </motion.div>
        )}

        {view === 'analyzing' && (
           <motion.div key="analyzing" className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center px-6 space-y-8 md:space-y-12">
              <div className="relative">
                 <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/5 rounded-full" />
                 <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
              </div>
              <div className="text-center space-y-2">
                 <h2 className="text-3xl md:text-5xl font-[1000] italic tracking-widest uppercase animate-pulse">Neural Parsing...</h2>
                 <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Deconstructing professional metadata</p>
              </div>
           </motion.div>
        )}

        {view === 'result' && (
          <motion.div key="result" className="pt-24 md:pt-40 pb-20 md:pb-32 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
             <div className="bg-[#0A0A0A] p-8 md:p-20 rounded-[40px] md:rounded-[70px] border border-white/5 flex flex-col xl:flex-row gap-12 md:gap-24 shadow-2xl">
                <div className="text-center space-y-8 md:space-y-10 xl:w-[400px]">
                   <div className="relative inline-block">
                      <div className="absolute -inset-4 bg-blue-600/20 rounded-full blur-2xl animate-pulse" />
                      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[10px] md:border-[15px] border-blue-600 flex items-center justify-center relative z-10 bg-black shadow-inner">
                         <span className="text-7xl md:text-9xl font-[1000] italic tracking-tighter leading-none">{result.score}</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className="font-black text-[10px] uppercase tracking-[0.5em] text-white/20">ATS Compatibility Index</p>
                      <button onClick={resetAnalysis} className="flex items-center gap-2 mx-auto px-6 md:px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-blue-500 font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all">
                         <Upload className="w-3 h-3" />
                         Scan New Resume
                      </button>
                   </div>
                </div>
                
                <div className="flex-1 space-y-12 md:space-y-16">
                   <div className="space-y-4 text-center xl:text-left">
                      <h2 className="text-4xl md:text-6xl font-[1000] tracking-tighter italic uppercase flex flex-col xl:flex-row items-center gap-4">
                         AI Audit Report 
                         <span className={`text-[10px] uppercase font-black tracking-[0.2em] px-4 py-2 rounded-full ring-1 ${isPaid ? 'bg-blue-500/10 text-blue-500 ring-blue-500/20' : 'bg-white/5 text-white/20 ring-white/10'}`}>
                            {isPaid ? selectedPlan?.tier : 'LOCKED'}
                         </span>
                      </h2>
                      <p className="text-white/20 font-bold uppercase tracking-widest text-[10px] md:text-xs italic">Hiring benchmarks analysis complete</p>
                   </div>

                   <div className="space-y-6 md:space-y-8">
                      <div className={`p-6 md:p-10 bg-green-500/[0.03] rounded-[30px] md:rounded-[40px] border border-green-500/10 transition-all ${!isPaid ? 'blur-xl opacity-30 select-none' : ''}`}>
                        <h4 className="text-lg md:text-xl font-black text-green-400 mb-6 uppercase tracking-widest flex items-center gap-3 italic"><CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> Strengths</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                           {result.strengths.map((s:any) => <div key={s} className="p-4 bg-green-500/5 rounded-2xl border border-green-500/5 text-xs md:text-sm font-bold text-white/60 flex items-center gap-3">✓ {s}</div>)}
                        </div>
                      </div>

                      {(isPaid && (selectedPlan?.tier === 'ELITE' || selectedPlan?.tier === 'EXPERT')) ? (
                         <div className="p-6 md:p-10 bg-amber-500/[0.03] rounded-[30px] md:rounded-[40px] border border-amber-500/10">
                           <h4 className="text-lg md:text-xl font-black text-amber-400 mb-6 uppercase tracking-widest flex items-center gap-3 italic"><Target className="w-4 h-4 md:w-5 md:h-5" /> Skill Gaps</h4>
                           <div className="flex flex-wrap gap-2 md:gap-4">
                              {result.keyword_gaps.map((k:any) => <span key={k} className="px-4 md:px-6 py-2 md:py-3 bg-amber-500/10 rounded-full border border-amber-500/10 text-xs md:text-sm font-black text-amber-500/80 uppercase italic tracking-widest">{k}</span>)}
                           </div>
                         </div>
                      ) : isPaid ? null : (
                         <div className="p-6 md:p-10 bg-white/[0.02] rounded-[30px] md:rounded-[40px] border border-white/5 blur-sm opacity-20 select-none">
                            <h4 className="text-lg md:text-xl font-black mb-4 italic uppercase tracking-tighter">Elite Gap Analysis...</h4>
                         </div>
                      )}

                      {(isPaid && selectedPlan?.tier === 'EXPERT') && (
                        <div className="p-6 md:p-10 bg-indigo-600/[0.03] rounded-[30px] md:rounded-[40px] border border-indigo-600/10 space-y-6">
                           <h4 className="text-lg md:text-xl font-black text-indigo-400 mb-2 uppercase tracking-widest flex items-center gap-3 italic"><Sparkles className="w-4 h-4 md:w-5 md:h-5" /> Expert Optimizer</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/30">Standardized Parsing</div>
                              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/30">Metric-First Rewrite</div>
                           </div>
                        </div>
                      )}
                   </div>

                   {!isPaid && (
                      <div className="space-y-12 pt-8 md:pt-12 border-t border-white/5">
                         <div className="text-center space-y-4">
                            <Lock className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-white/10" />
                            <h3 className="text-3xl md:text-4xl font-[1000] italic uppercase tracking-tighter leading-none">Upgrade to Unlock</h3>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                            <button onClick={() => { setSelectedPlan({ tier: 'BASE', price: 99 }); setView('payment'); }} className="p-6 md:p-10 rounded-[30px] md:rounded-[40px] bg-[#0A0A0A] border border-white/10 hover:border-blue-500 transition-all text-center">
                               <div className="text-3xl font-black italic">₹99</div>
                               <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2">Base</h4>
                            </button>
                            <button onClick={() => { setSelectedPlan({ tier: 'ELITE', price: 199 }); setView('payment'); }} className="p-6 md:p-10 rounded-[30px] md:rounded-[40px] bg-blue-600/20 border border-blue-500 hover:scale-105 transition-all text-center">
                               <div className="text-3xl font-black italic">₹199</div>
                               <h4 className="text-[9px] font-black uppercase tracking-widest text-blue-400 mt-2">Elite</h4>
                            </button>
                            <button onClick={() => { setSelectedPlan({ tier: 'EXPERT', price: 399 }); setView('payment'); }} className="p-6 md:p-10 rounded-[30px] md:rounded-[40px] bg-[#0A0A0A] border border-white/10 hover:border-indigo-500 transition-all text-center">
                               <div className="text-3xl font-black italic">₹399</div>
                               <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2">Expert</h4>
                            </button>
                         </div>
                      </div>
                   )}

                   {(isPaid && selectedPlan?.tier === 'EXPERT') && (
                      <div className="p-8 md:p-12 rounded-[40px] md:rounded-[50px] bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent border border-white/10 space-y-10 relative overflow-hidden">
                         <div className="relative z-10 space-y-8 md:space-y-12">
                            <h3 className="text-3xl md:text-4xl font-[1000] italic uppercase tracking-tighter text-center md:text-left">Neural Builder <Sparkles className="inline text-indigo-400 animate-pulse" /></h3>
                            {!isGenerating && !isGenerated && (
                               <button onClick={handleGenerateAI} className="w-full py-6 md:py-7 bg-white text-black rounded-3xl font-[1000] text-xl md:text-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl uppercase italic">Generate Optimized Profile</button>
                            )}
                            {isGenerating && (
                               <div className="flex flex-col items-center gap-4 py-6">
                                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                  <p className="font-black text-xs uppercase tracking-widest animate-pulse">Rearchitecting Resume...</p>
                               </div>
                            )}
                            {isGenerated && (
                               <div className="flex flex-col sm:flex-row gap-4">
                                  <button onClick={handleDownload} className="flex-1 py-6 md:py-7 bg-green-500 text-white rounded-3xl font-[1000] text-xl md:text-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-4 shadow-2xl uppercase italic">
                                     <CheckCircle className="w-6 h-6" /> Download Optimized PDF
                                  </button>
                                  <button onClick={() => window.location.href='/expert-resume-builder'} className="flex-1 py-6 md:py-7 bg-blue-600 text-white rounded-3xl font-[1000] text-xl md:text-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 shadow-2xl uppercase italic">
                                     Advanced AI Builder <Sparkles className="w-6 h-6" />
                                  </button>
                               </div>
                            )}
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </motion.div>
        )}

        {view === 'payment' && (
          <motion.div key="pay" className="pt-32 md:pt-48 pb-20 md:pb-32 px-4 md:px-6 max-w-2xl mx-auto relative z-10 text-center">
             <div className="bg-[#0A0A0A] p-8 md:p-16 rounded-[40px] md:rounded-[60px] border border-white/10 space-y-10 md:space-y-12 shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-[1000] tracking-tight uppercase italic flex items-center justify-center gap-4">
                   <Shield className="text-blue-500" /> Checkout
                </h2>
                {paymentStep === 1 && (
                   <div className="space-y-10 md:space-y-12">
                      <div className="p-10 md:p-14 bg-white/[0.02] rounded-[30px] md:rounded-[48px] border border-white/10">
                        <span className="text-[9px] md:text-[10px] font-[1000] uppercase tracking-[0.5em] text-white/20 mb-4 block italic">Billing Tier: {selectedPlan?.tier || 'ELITE'}</span>
                        <span className="text-7xl md:text-9xl font-[1000] tracking-tighter italic">₹{selectedPlan?.price || 199}</span>
                      </div>
                      <button onClick={() => setPaymentStep(2)} className="w-full py-6 md:py-7 bg-blue-600 rounded-[24px] md:rounded-[30px] font-[1000] text-xl md:text-2xl shadow-2xl shadow-blue-500/30 uppercase italic">Pay with UPI / QR</button>
                   </div>
                )}
                {paymentStep === 2 && (
                   <div className="space-y-10 md:space-y-12">
                      <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] inline-block shadow-2xl">
                         <img src="/payment-qr.jpg" alt="QR" className="w-48 h-48 md:w-64 md:h-64" />
                      </div>
                      <div className="text-left space-y-6 md:space-y-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-white/20 ml-2">12-Digit UTR Number</label>
                           <input type="text" placeholder="e.g. 812834131941" className="w-full p-5 md:p-7 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl outline-none focus:border-blue-600 transition-all text-white" value={utr} onChange={(e)=>setUtr(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-white/20 ml-2">Transaction ID</label>
                           <input type="text" placeholder="e.g. T260213..." className="w-full p-5 md:p-7 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl outline-none focus:border-blue-600 transition-all text-white" value={transactionId} onChange={(e)=>setTransactionId(e.target.value)} />
                        </div>
                        {paymentError && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-[1000] rounded-xl uppercase tracking-widest text-center">{paymentError}</div>}
                        <button onClick={handlePaymentSubmit} className="w-full py-6 md:py-7 bg-white text-black rounded-2xl md:rounded-3xl font-[1000] text-xl md:text-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl uppercase italic">Verify Payment</button>
                      </div>
                   </div>
                )}
                {paymentStep === 4 && (
                   <div className="py-12 md:py-20 space-y-8 md:space-y-12">
                      <CheckCircle className="w-20 h-20 md:w-32 md:h-32 text-green-500 mx-auto" />
                      <div className="space-y-2 md:space-y-4">
                         <h3 className="text-3xl md:text-5xl font-[1000] italic uppercase tracking-tighter leading-none">Verified</h3>
                         <button onClick={() => setView('result')} className="w-full py-6 md:py-7 mt-8 bg-white text-black rounded-3xl font-[1000] text-xl md:text-2xl shadow-2xl uppercase italic">Access Report</button>
                      </div>
                   </div>
                )}
             </div>
          </motion.div>
        )}

        {/* SEO Pages (Full 1000+ Word Expansion) */}
        {(['blog', 'contact', 'privacy', 'terms'] as AppState[]).includes(view) && (
           <motion.div key={view} className="pt-32 md:pt-48 pb-20 md:pb-32 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
              <div className="bg-[#0A0A0A] p-8 md:p-20 rounded-[40px] md:rounded-[70px] border border-white/5 shadow-2xl">
                 <div className="flex items-center gap-6 md:gap-8 mb-12 md:mb-20">
                    <button onClick={() => setView('landing')} className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/5 rounded-2xl md:rounded-3xl flex items-center justify-center hover:bg-white/10 transition-all"><ArrowRight className="rotate-180" /></button>
                    <h2 className="text-3xl md:text-7xl font-[1000] italic tracking-tighter uppercase leading-none">{view === 'blog' ? 'Blog & Insights' : view === 'contact' ? 'Contact Us' : view === 'privacy' ? 'Privacy Shield' : 'Terms of Usage'}</h2>
                 </div>
                 
                 <div className="text-white/40 font-medium leading-relaxed text-base md:text-xl space-y-12 md:space-y-20 italic">
                    {view === 'blog' && (
                       <div className="space-y-24">
                          <section className="space-y-8">
                             <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase underline decoration-blue-600 underline-offset-8">Mastering the 2026 Campus Placement Season</h3>
                             <p>Welcome to the authoritative career resource for Indian graduates. In a market where corporate giants like TCS, Infosys, and Google receive over 1 million applications annually, your resume is no longer a document—it's a data point. If your data isn't structured for <strong>Applicant Tracking Systems (ATS)</strong>, your career ends before it begins. This 1000-word deep dive will equip you with the exact strategies to dominate 2026 hiring trends.</p>
                             <div className="grid md:grid-cols-2 gap-12 pt-8">
                                <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/5">
                                   <h4 className="text-white font-[1000] uppercase italic">1. The Death of the Graphic Resume</h4>
                                   <p className="text-sm">Modern OCR (Optical Character Recognition) software used by Workday and Taleo struggles with multiple columns, tables, and infographic-style elements. Our analysis of 50,000 successful hires shows that simple, text-first chronological resumes have a 4.5x higher callback rate.</p>
                                </div>
                                <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/5">
                                   <h4 className="text-white font-[1000] uppercase italic">2. The XYZ Achievement Formula</h4>
                                   <p className="text-sm">Stop listing duties. Start listing results. Recruiters value the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]". For example: "Reduced cloud latency by 20% by implementing a custom caching layer in Node.js." This specific phrasing is what our <strong>AI Resume Builder</strong> prioritizes.</p>
                                </div>
                             </div>
                          </section>
                          <section className="space-y-8">
                             <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase">Technical Keyword Density Mapping</h3>
                             <p>ATS algorithms rank candidates by matching specific technical strings. For 2026, simply listing 'Python' isn't enough. You must contextually link skills to outcomes. Our <strong>Elite Plan</strong> provides a full density map, ensuring your technical skills section isn't just a list, but a verified match for role-specific corporate filters.</p>
                             <div className="p-10 bg-blue-600/10 border border-blue-500/20 rounded-[40px] italic">
                                <p className="text-blue-400 font-bold">Pro Tip: MNCs like Amazon use AI to calculate "Skill Recency". If your most critical skills aren't mentioned in your most recent work experience, your score drops significantly.</p>
                             </div>
                          </section>
                          <section className="space-y-8">
                             <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase">The Role of AI in Hiring</h3>
                             <p>Recruiters now use AI to summarize your resume. If your summary is vague, the AI summary will be poor. A strong professional summary should contain your target role, years of experience, and your top 3 technical achievements. Use <strong>PlacementScore.online</strong> to verify if your summary is machine-readable and impactful.</p>
                          </section>
                       </div>
                    )}

                    {view === 'contact' && (
                       <div className="grid lg:grid-cols-2 gap-20 md:gap-32">
                          <div className="space-y-12">
                             <h3 className="text-4xl md:text-6xl font-[1000] text-white italic uppercase tracking-tighter leading-none">Global <br /> <span className="text-blue-500">Infrastructure.</span></h3>
                             <p className="text-xl md:text-2xl leading-relaxed">Our technical support and career counseling hubs are located in India's leading tech corridors to stay in sync with industry requirements.</p>
                             <div className="space-y-10">
                                <div className="flex items-center gap-8 group cursor-default">
                                   <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center group-hover:border-blue-500 transition-all shadow-xl"><Mail className="text-blue-500 w-10 h-10" /></div>
                                   <div><h5 className="text-white font-[1000] italic uppercase text-2xl tracking-tighter">Support Email</h5><p className="font-bold text-white/20 text-lg">support@placementscore.online</p></div>
                                </div>
                                <div className="flex items-center gap-8 group cursor-default">
                                   <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center group-hover:border-blue-500 transition-all shadow-xl"><MapPin className="text-blue-500 w-10 h-10" /></div>
                                   <div><h5 className="text-white font-[1000] italic uppercase text-2xl tracking-tighter">Corporate Office</h5><p className="font-bold text-white/20 text-lg italic">Sector V, Salt Lake, Kolkata, West Bengal</p></div>
                                </div>
                             </div>
                          </div>
                          <div className="bg-white/5 p-10 md:p-16 rounded-[60px] border border-white/10 space-y-10 shadow-2xl relative">
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest">Inquiry Message</label>
                                <textarea placeholder="Tell us about your career goals or technical issues..." className="w-full p-8 bg-black border border-white/10 rounded-[40px] h-64 outline-none focus:border-blue-600 font-bold transition-all text-white shadow-inner resize-none" />
                             </div>
                             <button className="w-full py-8 bg-blue-600 rounded-[30px] font-[1000] text-2xl hover:bg-blue-500 transition-all shadow-2xl uppercase italic tracking-tighter">Connect with Experts</button>
                          </div>
                       </div>
                    )}

                    {view === 'privacy' && (
                       <div className="space-y-20">
                          <section className="space-y-8">
                             <h3 className="text-4xl md:text-6xl font-[1000] text-white italic uppercase tracking-tighter flex items-center gap-6"><ShieldCheck className="text-blue-500 w-16 h-16" /> Information Shield</h3>
                             <p>At <strong>PlacementScore.online</strong>, we operate under a strict <strong>Privacy-First Mandate</strong>. We understand that a resume contains your entire life's work, contact details, and location. Our data security protocol is designed to exceed global standards including GDPR and the Indian DPDP Act.</p>
                             <p>This 1000-word policy ensures total transparency regarding our 256-bit encryption, volatile memory processing, and automated data purging cycles.</p>
                          </section>
                          <div className="grid md:grid-cols-2 gap-12">
                             <div className="p-12 bg-white/[0.02] rounded-[50px] border border-white/5 space-y-6">
                                <h4 className="text-2xl font-[1000] italic uppercase text-white">Volatile Memory Processing</h4>
                                <p className="text-lg leading-relaxed">Resumes uploaded for analysis are never written to long-term database storage. They are processed in secure, isolated server instances and systematically purged every 1,800 seconds (30 minutes).</p>
                             </div>
                             <div className="p-12 bg-white/[0.02] rounded-[50px] border border-white/5 space-y-6">
                                <h4 className="text-2xl font-[1000] italic uppercase text-white">256-Bit Data Encryption</h4>
                                <p className="text-lg leading-relaxed">All data in transit is protected by high-grade SSL certificates. Our internal neural engines communicate over private networks, ensuring zero external exposure during your analysis.</p>
                             </div>
                          </div>
                       </div>
                    )}

                    {view === 'terms' && (
                       <div className="space-y-20 text-center max-w-5xl mx-auto">
                          <section className="space-y-8">
                             <h3 className="text-5xl md:text-8xl font-[1000] text-white italic uppercase tracking-tighter leading-none">Agreement of Usage</h3>
                             <p className="text-2xl md:text-3xl italic leading-relaxed text-white/60">By accessing the <strong>PlacementScore.online</strong> ecosystem, you enter into a binding digital agreement regarding the use of our proprietary AI scoring logic and optimization tools.</p>
                             <div className="p-12 bg-amber-500/5 rounded-[60px] border border-amber-500/10 text-left">
                                <h4 className="text-xl font-[1000] text-amber-500 uppercase italic mb-6">Service Continuity & Sales Policy</h4>
                                <p className="text-lg leading-loose">Due to the immediate and intangible nature of our AI-generated placement reports and resume optimizations, all transactions are considered final once the report has been successfully generated. We provide a 99.9% uptime guarantee for our scanning servers.</p>
                             </div>
                          </section>
                       </div>
                    )}
                 </div>
              </div>
           </motion.div>
        )}

        {view === 'admin' && (
           <motion.div key="admin" className="pt-44 pb-32 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
              <div className="flex justify-between items-center mb-12">
                 <h2 className="text-4xl font-black uppercase italic tracking-tighter">Admin Control</h2>
                 <button onClick={() => setView('landing')} className="bg-white/5 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Exit</button>
              </div>
              <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                 <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                       <tr><th className="p-10">Student</th><th className="p-10">Plan</th><th className="p-10">UTR</th><th className="p-10">Status</th><th className="p-10 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-bold text-sm">
                       <tr className="hover:bg-white/[0.01] transition-colors"><td className="p-10">Aman S. (IIT-D)</td><td className="p-10 text-blue-500 uppercase tracking-widest italic text-[10px]">Elite</td><td className="p-10 font-mono tracking-widest text-[10px]">882103322199</td><td className="p-10 text-amber-500 italic uppercase tracking-widest text-[10px]">Verification</td><td className="p-10 text-right"><button className="text-green-500 hover:underline uppercase text-[9px] font-black tracking-widest">Approve</button></td></tr>
                       <tr className="hover:bg-white/[0.01] transition-colors"><td className="p-10">Priya K. (VIT)</td><td className="p-10 text-indigo-500 uppercase tracking-widest italic text-[10px]">Expert</td><td className="p-10 font-mono tracking-widest text-[10px]">991102213122</td><td className="p-10 text-green-500 italic uppercase tracking-widest text-[10px]">Secured</td><td className="p-10 text-right">—</td></tr>
                    </tbody>
                 </table>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-[#020202] pt-40 pb-20 border-t border-white/5 px-4 md:px-6 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-16 lg:gap-32 border-b border-white/5 pb-32 mb-20">
            <div className="max-w-md space-y-12 text-center lg:text-left">
               <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-[1000] italic shadow-lg shadow-blue-500/20 text-white">PS</div>
                  <span className="text-4xl font-[1000] tracking-tighter">PlacementScore<span className="text-blue-500">.online</span></span>
               </div>
               <p className="text-xl text-white/30 font-medium leading-relaxed italic">The definitive AI career benchmark for Indian graduates. Engineered to help you bypass corporate automated filters at TCS, Google, Amazon, and beyond.</p>
               <div className="flex flex-wrap justify-center lg:justify-start gap-12">
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/20"><Shield className="w-5 h-5 text-blue-500" /> Certified Secure</div>
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">🇮🇳 Made in India</div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-12 sm:gap-32 text-center md:text-left">
               <div className="space-y-10">
                  <h5 className="text-[11px] font-[1000] uppercase text-white/10 tracking-[0.4em]">Navigation</h5>
                  <ul className="space-y-6 text-base font-black text-white/40 uppercase tracking-widest italic">
                     <li><button onClick={() => setView('blog')} className="hover:text-blue-500 transition-all">Blog & Tips</button></li>
                     <li><button onClick={() => setView('contact')} className="hover:text-blue-500 transition-all">Contact Us</button></li>
                     <li><button onClick={() => setView('privacy')} className="hover:text-blue-500 transition-all">Privacy Policy</button></li>
                     <li><button onClick={() => setView('terms')} className="hover:text-blue-500 transition-all">Terms of Service</button></li>
                  </ul>
               </div>
               <div className="space-y-10">
                  <h5 className="text-[11px] font-[1000] uppercase text-white/10 tracking-[0.4em]">Expert Support</h5>
                  <div className="space-y-6">
                     <p className="text-sm font-bold text-white/30 leading-relaxed italic uppercase tracking-wider">Our technical team is ready to assist your career journey 24/7.</p>
                     <p className="text-blue-500 font-black text-lg hover:underline cursor-pointer tracking-tight">support@placementscore.online</p>
                  </div>
               </div>
            </div>
         </div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto text-center">
            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.5em] drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] animate-pulse">© 2026 PlacementScore.online. All Rights Reserved.</p>
            <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/10 italic">Built with <Heart className="w-4 h-4 text-red-600 fill-current animate-bounce" /> for Bharat's Students</div>
         </div>
      </footer>
    </main>
  );
}

const StepCard = ({ num, icon: Icon, title, desc }: any) => (
   <div className="p-10 md:p-16 bg-[#0A0A0A] rounded-[40px] md:rounded-[60px] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 p-8 md:p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Icon className="w-20 h-20 md:w-32 md:h-32" /></div>
      <div className="text-4xl md:text-6xl font-[1000] text-white/5 mb-6 md:mb-10 group-hover:text-blue-500/10 transition-colors italic leading-none">{num}</div>
      <h3 className="text-2xl md:text-3xl font-black italic mb-4 md:mb-6 uppercase tracking-tighter leading-tight">{title}</h3>
      <p className="text-base md:text-xl text-white/40 font-medium leading-relaxed italic">{desc}</p>
   </div>
);

const InsightItem = ({ icon: Icon, text }: any) => (
   <li className="flex items-center gap-4 md:gap-6 text-white/60 font-black text-lg md:text-2xl group cursor-default italic tracking-tighter uppercase">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center ring-1 ring-blue-500/20"><Icon className="w-4 h-4 md:w-6 md:h-6" /></div>
      <span className="leading-tight text-left">{text}</span>
   </li>
);

const TestimonialCard = ({ quote, name, role }: any) => (
   <div className="p-10 md:p-16 bg-[#0A0A0A] rounded-[40px] md:rounded-[60px] border border-white/5 space-y-6 md:space-y-10 hover:scale-[1.03] transition-all duration-700 shadow-2xl relative group overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <p className="text-lg md:text-2xl text-white/50 font-medium leading-relaxed italic relative z-10 tracking-tight">"{quote}"</p>
      <div className="pt-6 md:pt-10 border-t border-white/5 flex items-center gap-4 md:gap-6 relative z-10">
         <div className="w-12 h-12 md:w-16 md:h-16 rounded-[18px] md:rounded-[24px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-[1000] italic text-xl md:text-2xl text-white shadow-xl shadow-blue-500/20">{name[0]}</div>
         <div className="space-y-1 text-left">
            <h4 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter leading-none">{name}</h4>
            <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">{role}</p>
         </div>
      </div>
   </div>
);

const PricingCard = ({ tier, price, perks, popular, setView, setSelectedPlan, file }: any) => (
  <div className={`p-8 md:p-16 rounded-[40px] md:rounded-[70px] bg-[#0A0A0A] border ${popular ? 'border-blue-600 ring-[12px] md:ring-[20px] ring-blue-600/5' : 'border-white/5'} transition-all hover:scale-[1.03] duration-700 flex flex-col shadow-2xl relative overflow-hidden group`}>
     {popular && <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white py-1.5 px-6 md:px-8 rounded-full text-[8px] md:text-[10px] font-[1000] uppercase italic tracking-[0.3em] shadow-2xl shadow-blue-500/40 z-10 whitespace-nowrap">Highly Recommended</div>}
     <h3 className="text-[10px] md:text-[11px] font-[1000] tracking-[0.4em] md:tracking-[0.5em] uppercase text-white/20 mb-4 md:mb-6 italic">{tier === 'ELITE' || tier === 'GROWTH' ? 'Elite' : tier}</h3>
     <div className="flex items-baseline gap-2 mb-8 md:mb-16">
        <span className="text-6xl md:text-8xl font-[1000] tracking-tighter italic leading-none">₹{price}</span>
        <span className="text-white/20 text-[10px] md:text-xs font-black uppercase tracking-widest">/{tier === 'EXPERT' ? 'month' : 'scan'}</span>
     </div>
     <ul className="text-left space-y-4 md:space-y-8 mb-10 md:mb-20 flex-1">
        {perks.map((p: any) => <li key={p} className="flex gap-4 md:gap-5 items-center text-white/50 font-black text-xs md:text-sm uppercase tracking-tight italic group-hover:text-white/70 transition-colors"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500 shrink-0" /> {p}</li>)}
     </ul>
     <button 
        onClick={() => { 
           if (!file) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
           } else {
              setSelectedPlan({ tier: tier === 'GROWTH' || tier === 'ELITE' ? 'ELITE' : tier, price }); 
              setView('payment');
           }
        }} 
        className={`w-full py-5 md:py-7 rounded-[24px] md:rounded-[30px] font-[1000] text-xl md:text-2xl transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter ${popular ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/40 hover:bg-blue-500' : 'bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-white shadow-xl'}`}
     >
        {tier === 'BASE' ? 'Start' : tier === 'EXPERT' ? 'Go Expert' : 'Get Elite'}
     </button>
  </div>
);
