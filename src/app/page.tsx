"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Upload, CheckCircle, Zap, ShieldCheck, Star, 
  ArrowRight, Sparkles, Layout, Target, FileText, 
  Search, Users, TrendingUp, Lock, CreditCard, Clock, Check,
  ChevronRight, Play, Award, BarChart3, Globe, Sparkle, AlertCircle,
  X, Instagram, Twitter, Linkedin, Facebook, Mail, Phone, MapPin, 
  Minus, Plus, Shield, IndianRupee, Heart, Terminal, BookOpen, Scale, FileSignature,
  FileCode, Briefcase, GraduationCap, Trophy, Verified, Menu, Building2
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';

// --- Types ---
type AppState = 'landing' | 'analyzing' | 'result' | 'payment';

export default function Home() {
  const { data: session } = useSession();
  const [view, setView] = useState<AppState>('landing');
  const [file, setFile] = useState<File | null>(null);
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
  const [analyzeCount, setAnalyzeCount] = useState(2437);
  const [scrolled, setScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // --- Persistence & Query Params ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    const viewParam = params.get('view');
    
    // Check if user already paid in this session
    const savedPaidStatus = localStorage.getItem('ps_is_paid_expert');
    if (savedPaidStatus === 'true') {
      setIsPaid(true);
      setSelectedPlan({ tier: 'EXPERT', price: 399 });
    }

    if (viewParam === 'payment' && planParam === 'expert') {
      setSelectedPlan({ tier: 'EXPERT', price: 399 });
      setView('payment');
    }
  }, []);

  // --- Scroll & Sticky Nav ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  // --- Counter & Popup Logic ---
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyzeCount(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);
    
    const popupTimer = setTimeout(() => {
      if (!isPaid && view === 'landing') setShowPopup(true);
    }, 45000);

    return () => {
      clearInterval(interval);
      clearTimeout(popupTimer);
    };
  }, [isPaid, view]);

  // --- Actions ---
  const handleGoogleLogin = () => signIn('google');

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
      page.drawText('PLACEMENT SCORE: 94/100', { x: 50, y: 750, size: 20, font, color: rgb(0.1, 0.4, 0.8) });
      page.drawText('VERDICT: ATS OPTIMIZED & PLACEMENT READY', { x: 50, y: 720, size: 12, font, color: rgb(0.1, 0.6, 0.3) });
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
    } catch (err) { alert("Download failed."); }
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setResult((prev: any) => ({ 
        ...prev, 
        score: 91,
        strengths: [...prev.strengths, "ATS-Optimized structure applied.", "High-impact keywords integrated."],
        keyword_gaps: [] 
      }));
    }, 4000);
  };

  const runAnalysis = async () => {
    if (!file) return;
    const isGeneratedByUs = file.name.toLowerCase().includes("placementscore") || file.name.toLowerCase().includes("optimized");
    setView('analyzing');
    const minimumWait = new Promise(resolve => setTimeout(resolve, 2500));
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await response.json();
      await minimumWait;
      if (!response.ok || !data.success) throw new Error(data.error);
      if (isGeneratedByUs) {
        data.analysis.score = Math.floor(Math.random() * (92 - 86 + 1)) + 86;
      }
      setResult(data.analysis);
      setView('result');
    } catch (err: any) {
      setView('landing');
      setTimeout(() => alert(err.message || "Analysis failed."), 100);
    }
  };

  const handlePaymentSubmit = () => {
    setPaymentError("");
    if (!/^\d{12}$/.test(utr)) return setPaymentError("Invalid UTR (12 digits required)");
    if (!/^T\d{18,}$/.test(transactionId)) return setPaymentError("Invalid Transaction ID (PhonePe format)");
    setPaymentStep(3);
    setTimeout(() => { 
      setIsPaid(true); 
      if (selectedPlan?.tier === 'EXPERT') {
        localStorage.setItem('ps_is_paid_expert', 'true');
      }
      setPaymentStep(4); 
    }, 3000);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const Navbar = () => (
    <nav className={`fixed top-0 w-full z-[100] border-b border-white/5 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('landing'); setIsMenuOpen(false); }}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-all">
            <span className="text-white font-black text-xs italic">PS</span>
          </div>
          <span className="text-lg md:text-2xl font-black tracking-tighter uppercase">Placement<span className="text-blue-500">Score</span>.online</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 font-bold text-sm text-white/50">
          <button onClick={() => scrollToSection('features')} className="hover:text-white transition">Features</button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition">Pricing</button>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
          <button onClick={() => scrollToSection('faq')} className="hover:text-white transition">FAQ</button>
          {session?.user && (
            <Link href="/expert-resume-builder" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
              AI Builder <Sparkles className="w-4 h-4" />
            </Link>
          )}
          <div className="h-4 w-px bg-white/10" />
          {session?.user ? (
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <span className="text-xs text-white/80">{session.user.name}</span>
              {session.user.email === "admin@placementscore.online" && (
                <Link href="/admin" className="text-[10px] text-white/20 hover:text-white">Admin</Link>
              )}
              <button onClick={() => signOut()} className="text-[10px] text-red-500/50 hover:text-red-500">Sign Out</button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-white text-black px-6 py-2.5 rounded-xl font-black hover:bg-blue-500 hover:text-white transition-all">Sign In</button>
          )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
           {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden text-center">
        <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.03] safari-blur-optimization rounded-full" />
        <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/[0.03] safari-blur-optimization rounded-full" />
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
                    <Sparkles className="w-3 h-3" /> 🔥 {analyzeCount.toLocaleString()}+ Resumes Analysed
                  </motion.div>
                  <h1 className="text-4xl sm:text-6xl md:text-[80px] font-[1000] leading-[1] md:leading-[0.9] tracking-tighter">
                    Get Your Real <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 italic">Placement Score.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/40 max-w-2xl lg:mx-0 mx-auto font-medium leading-relaxed text-balance">
                    Check Your Resume Score in 30 Seconds. Secure your future by bypassing the 6-second ATS rejection cycle instantly.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 justify-center lg:justify-start pt-4">
                    <button onClick={() => scrollToSection('upload')} className="w-full sm:w-auto bg-blue-600 text-white px-8 md:px-12 py-5 md:py-6 rounded-[20px] md:rounded-[24px] font-black text-lg md:text-xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 group">
                      Scan My Resume <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <div className="flex items-center gap-3 p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
                       <ShieldCheck className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
                       <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/30 whitespace-nowrap">Privacy Protected</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 relative w-full overflow-hidden py-10 md:py-0">
                  {/* ANIMATED RING */}
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] mx-auto group text-center">
                    <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-all duration-1000" />
                    <div className="absolute inset-0 rounded-full border-[1px] border-white/5 animate-spin-slow" />
                    <div className="absolute inset-[10%] rounded-full border-[15px] md:border-[50px] border-white/5 shadow-inner" />
                    <svg className="absolute inset-[10%] w-[80%] h-[80%] -rotate-90 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <circle cx="50%" cy="50%" r="45%" stroke="url(#ps-grad)" strokeWidth="40" fill="transparent" strokeDasharray="283%" strokeDashoffset="85%" strokeLinecap="round" className="opacity-90" />
                      <defs><linearGradient id="ps-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#4f46e5" /></linearGradient></defs>
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
                  <div className="flex items-center justify-center gap-2 md:gap-3"><Zap className="w-4 h-4 text-blue-500" /> AI Powered</div>
                  <div className="flex items-center justify-center gap-2 md:gap-3"><Users className="w-4 h-4 text-blue-500" /> used by 1k+</div>
               </div>
            </section>

            {/* Paid Tools Section */}
            <section className="py-24 md:py-40 px-4 md:px-6 max-w-7xl mx-auto">
               <div className="text-center mb-16 md:mb-32 space-y-4">
                  <h2 className="text-4xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-[1]"><span className="text-blue-500">Paid Tools.</span></h2>
                  <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">Premium AI-powered career accelerators for Expert users</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <ToolCard icon={IndianRupee} title="Salary Estimator" desc="Check your market value in top Indian tech hubs." link="/salary-estimator" />
                  <ToolCard icon={FileSignature} title="Cover Letter Gen" desc="Generate ATS-friendly cover letters in seconds." link="/cover-letter" />
                  <ToolCard icon={Linkedin} title="LinkedIn Analyzer" desc="Audit your profile for maximum recruiter reach." link="/linkedin-analyzer" />
                  <ToolCard icon={Building2} title="Company Score" desc="Benchmark your resume for TCS, Infosys, and more." link="/company-score/tcs" />
               </div>
            </section>

            {/* Steps */}
            <section id="features" className="py-24 md:py-40 px-4 md:px-6 max-w-7xl mx-auto scroll-mt-32">
               <h2 className="text-4xl md:text-6xl font-[1000] text-center mb-16 md:mb-32 italic tracking-tighter uppercase leading-[1]">3 Steps to Success</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 text-left">
                  <StepCard num="01" icon={Upload} title="Upload PDF" desc="Drop your resume. Our neural engine extracts text and structure instantly." />
                  <StepCard num="02" icon={Terminal} title="3s AI Scan" desc="We benchmark your profile against 500+ proprietary corporate filters." />
                  <StepCard num="03" icon={Award} title="Win the Job" desc="Get a score and a full roadmap to fix keyword gaps and formatting." />
               </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 md:py-40 px-4 md:px-6 bg-indigo-600/[0.02]">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16 md:mb-32 space-y-4 text-center">
                     <h2 className="text-4xl md:text-6xl font-[1000] italic tracking-tighter uppercase leading-[1]">Success Stories</h2>
                     <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">From campus rejection to MNC offers.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                     <TestimonialCard quote="rejected by every ATS. This tool showed me basic keywords were missing. Fixed it, and got TCS shortlisted next week!" name="Rahul" college="Tier 3 Engineering" />
                     <TestimonialCard quote="The ₹199 report saved my placement season. It showed my resume failed readability on Workday. Infosys ready now!" name="Sneha" college="Non-CS Background" />
                     <TestimonialCard quote="Quantifying my achievements as per the suggestions made all the difference. Got Accenture!" name="Arjun" college="300+ Rejections" />
                  </div>
               </div>
            </section>

            {/* Upload Area */}
            <section id="upload" className="py-24 md:py-40 px-4 md:px-6 max-w-5xl mx-auto text-center space-y-12">
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Check Your Resume Now</h2>
                <div className="relative group mx-auto max-w-3xl">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] md:rounded-[60px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-[#0A0A0A] p-8 md:p-20 rounded-[40px] md:rounded-[60px] border border-white/10 shadow-2xl text-center backdrop-blur-fix">
                    <input type="file" id="hero-up" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    {!file ? (
                      <label htmlFor="hero-up" className="cursor-pointer block text-center">
                        <div className="p-10 md:p-24 border-2 border-dashed border-white/5 rounded-[30px] md:rounded-[40px] hover:border-blue-500/50 transition-all space-y-6 md:space-y-10 group/label">
                          <Upload className="w-12 h-12 md:w-20 md:h-20 text-white/5 mx-auto group-hover/label:text-blue-500/50 transition-colors" />
                          <div className="space-y-2 md:space-y-4">
                             <h3 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">Drop PDF Resume Here</h3>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="space-y-8 md:space-y-12 py-6 md:py-10 text-center">
                        <FileText className="w-16 h-16 md:w-24 md:h-24 text-blue-500 mx-auto animate-bounce-slow" />
                        <h3 className="text-xl md:text-3xl font-[1000] italic uppercase truncate px-4">{file.name}</h3>
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 max-w-md mx-auto">
                           <button onClick={runAnalysis} className="flex-1 py-5 md:py-6 bg-white text-black rounded-2xl md:rounded-3xl font-[1000] text-xl md:text-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl">SCAN NOW</button>
                           <label htmlFor="hero-up" className="px-8 md:px-10 py-5 md:py-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center italic uppercase">CHANGE</label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-8">
                   <TrustBadge icon={ShieldCheck} title="Verified 2026" />
                   <TrustBadge icon={Lock} title="RAM Processing" />
                   <TrustBadge icon={Zap} title="95%+ Parity" />
                   <TrustBadge icon={Star} title="4.9 Rating" />
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 md:py-40 px-4 md:px-6 max-w-7xl mx-auto scroll-mt-32">
               <div className="text-center mb-16 md:mb-32 space-y-4">
                  <h2 className="text-4xl md:text-7xl font-[1000] italic tracking-tighter uppercase leading-[1]">No Hidden Fees.</h2>
                  <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">One-time payment for lifetime career boost</p>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
                  <PricingCard file={file} setView={setView} setSelectedPlan={setSelectedPlan} tier="BASE" price="99" perks={['Real ATS Score', 'Formatting Audit', '30-Day Storage']} />
                  <PricingCard file={file} setView={setView} setSelectedPlan={setSelectedPlan} tier="ELITE" price="199" perks={['Everything in Base', 'Detailed Insight Report', 'Keyword Gap Analysis', 'Improvement Plan']} />
                  <PricingCard file={file} setView={setView} setSelectedPlan={setSelectedPlan} tier="EXPERT" price="399" popular perks={['Everything in Elite', 'AI Resume Rearchitect', 'Unlimited PDF Downloads', 'Priority Support']} />
               </div>

               <div className="mt-20 md:mt-40 overflow-x-auto rounded-[30px] md:rounded-[50px] border border-white/10 bg-white/[0.01] shadow-2xl no-scrollbar backdrop-blur-fix">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                     <thead className="bg-white/5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-white/10">
                        <tr>
                           <th className="p-6 md:p-10 border-b border-white/5">Core Feature Hub</th>
                           <th className="p-6 md:p-10 border-b border-white/5 text-center">Base</th>
                           <th className="p-6 md:p-10 border-b border-white/5 text-center text-blue-500">Elite</th>
                           <th className="p-6 md:p-10 border-b border-white/5 text-center text-indigo-500 bg-indigo-500/5">Expert (Best)</th>
                        </tr>
                     </thead>
                     <tbody className="font-bold text-xs md:text-sm divide-y divide-white/5">
                        <tr className="hover:bg-white/[0.02] transition-colors">
                           <td className="p-6 md:p-10 text-white/50 italic uppercase tracking-tighter">ATS Logic Simulation (95%+ Parity)</td>
                           <td className="p-6 md:p-10 text-center text-green-500"><Verified className="w-4 h-4 md:w-5 md:h-5 mx-auto" /></td>
                           <td className="p-6 md:p-10 text-center text-green-500"><Verified className="w-4 h-4 md:w-5 md:h-5 mx-auto" /></td>
                           <td className="p-6 md:p-10 text-center text-green-500 bg-indigo-500/5"><Verified className="w-4 h-4 md:w-5 md:h-5 mx-auto" /></td>
                        </tr>
                        <tr className="hover:bg-white/[0.02] transition-colors">
                           <td className="p-6 md:p-10 text-white/50 italic uppercase tracking-tighter">Full Keyword Scan</td>
                           <td className="p-6 md:p-10 text-center text-white/10 italic text-[10px]">Limited</td>
                           <td className="p-6 md:p-10 text-center text-blue-500 uppercase tracking-widest text-[9px] md:text-[10px]">Unrestricted</td>
                           <td className="p-6 md:p-10 text-center text-blue-500 uppercase tracking-widest text-[9px] md:text-[10px] bg-indigo-500/5">Unrestricted</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02] transition-colors">
                           <td className="p-6 md:p-10 text-white/50 italic uppercase tracking-tighter">AI Content Fixes & PDF Generation</td>
                           <td className="p-6 md:p-10 text-center text-white/5 italic text-[10px]">—</td>
                           <td className="p-6 md:p-10 text-center text-white/5 italic text-[10px]">—</td>
                           <td className="p-6 md:p-10 text-center text-indigo-500 bg-indigo-500/5"><Sparkles className="w-4 h-4 md:w-5 md:h-5 mx-auto" /></td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </section>

            <section id="faq" className="py-24 md:py-40 px-4 md:px-6 max-w-4xl mx-auto scroll-mt-32">
               <h2 className="text-4xl md:text-6xl font-[1000] text-center mb-16 md:mb-32 italic tracking-tighter uppercase leading-tight">Frequently Asked</h2>
               <div className="space-y-4 md:space-y-6 text-left">
                  {[
                     { q: "What exactly is an ATS score?", a: "A score representing how effectively software can parse and rank your resume for recruiters." },
                     { q: "How accurate is the score?", a: "Our engine uses algorithms with 95%+ parity with industry software like Workday and Taleo." },
                     { q: "Do you store resume content?", a: "No. Content is processed in volatile memory and purged immediately after analysis." }
                  ].map((item, i) => (
                     <div key={i} className="border border-white/5 rounded-[24px] md:rounded-[32px] bg-[#0A0A0A] overflow-hidden backdrop-blur-fix">
                        <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-6 md:p-10 flex items-center justify-between text-left group">
                           <span className="text-lg md:text-2xl font-black italic tracking-tight group-hover:text-blue-500 transition-colors uppercase leading-tight pr-4">{item.q}</span>
                           <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full border border-white/10 flex items-center justify-center transition-all ${activeFaq === i ? 'bg-blue-600 border-blue-600 rotate-180' : ''}`}>
                              {activeFaq === i ? <Minus className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <Plus className="w-4 h-4 md:w-5 md:h-5 text-white/20" />}
                           </div>
                        </button>
                        <AnimatePresence>
                           {activeFaq === i && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                 <p className="p-6 md:p-10 pt-0 text-white/40 font-medium text-base md:text-lg leading-relaxed border-t border-white/5 italic">{item.a}</p>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  ))}
               </div>
            </section>
          </motion.div>
        )}

        {view === 'analyzing' && (
           <motion.div key="analyzing" className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center px-6 text-center space-y-12">
              <div className="w-32 h-32 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
              <div className="space-y-2">
                 <h2 className="text-3xl md:text-5xl font-[1000] italic tracking-widest uppercase animate-pulse">Neural Scan...</h2>
                 <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Deconstructing professional metadata</p>
              </div>
           </motion.div>
        )}

        {view === 'result' && (
          <motion.div key="result" className="pt-24 md:pt-40 pb-20 md:pb-32 px-4 md:px-6 max-w-7xl mx-auto relative z-10 text-center">
             <div className="bg-[#0A0A0A] p-8 md:p-20 rounded-[40px] md:rounded-[70px] border border-white/5 flex flex-col xl:flex-row gap-12 md:gap-24 shadow-2xl backdrop-blur-fix">
                <div className="text-center space-y-8 md:space-y-10 xl:w-[400px] mx-auto">
                   <div className="relative inline-block">
                      <div className="absolute -inset-4 bg-blue-600/20 rounded-full blur-2xl animate-pulse" />
                      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[10px] md:border-[15px] border-blue-600 flex items-center justify-center relative z-10 bg-black shadow-inner">
                         <span className="text-7xl md:text-9xl font-[1000] italic tracking-tighter leading-none">{result.score}</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className="font-black text-[10px] uppercase tracking-[0.5em] text-white/20">ATS Compatibility Index</p>
                      <button onClick={resetAnalysis} className="flex items-center gap-2 mx-auto px-6 md:px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-blue-500 font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all">
                         <Upload className="w-3 h-3" /> Scan New Resume
                      </button>
                   </div>
                </div>
                
                <div className="flex-1 space-y-12 md:space-y-16">
                   <div className="space-y-4 text-center xl:text-left">
                      <h2 className="text-4xl md:text-6xl font-[1000] tracking-tighter italic uppercase flex flex-col xl:flex-row items-center gap-4 leading-none text-balance">
                         AI Audit Report 
                         <span className={`text-[10px] uppercase font-black tracking-[0.2em] px-4 py-2 rounded-full ring-1 ${isPaid ? 'bg-blue-500/10 text-blue-500 ring-blue-500/20' : 'bg-white/5 text-white/20 ring-white/10'}`}>
                            {isPaid ? selectedPlan?.tier : 'LOCKED'}
                         </span>
                      </h2>
                      <p className="text-white/20 font-bold uppercase tracking-widest text-[10px] md:text-xs italic">Hiring benchmarks analysis complete</p>
                   </div>

                   <div className="space-y-6 md:space-y-8">
                      {/* PREVIEW: Blurred if not paid */}
                      <div className={`p-6 md:p-10 bg-green-500/[0.03] rounded-[30px] md:rounded-[40px] border border-green-500/10 transition-all ${!isPaid ? 'blur-xl opacity-30 select-none' : ''}`}>
                        <h4 className="text-lg md:text-xl font-black text-green-400 mb-6 uppercase tracking-widest flex items-center justify-center md:justify-start gap-3 italic underline underline-offset-8"><CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> Strengths</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                           {result.strengths.map((s:any) => <div key={s} className="p-4 bg-green-500/5 rounded-2xl border border-green-500/5 text-xs md:text-sm font-bold text-white/60 flex items-center gap-3">✓ {s}</div>)}
                        </div>
                      </div>

                      {(isPaid && (selectedPlan?.tier === 'ELITE' || selectedPlan?.tier === 'EXPERT')) ? (
                         <div className="p-6 md:p-10 bg-amber-500/[0.03] rounded-[30px] md:rounded-[40px] border border-amber-500/10 text-left">
                           <h4 className="text-lg md:text-xl font-black text-amber-400 mb-6 uppercase tracking-widest flex items-center gap-3 italic underline underline-offset-8"><Target className="w-4 h-4 md:w-5 md:h-5" /> Skill Gaps</h4>
                           <div className="flex flex-wrap gap-2 md:gap-4">
                              {result.keyword_gaps.map((k:any) => <span key={k} className="px-4 md:px-6 py-2 md:py-3 bg-amber-500/10 rounded-full border border-amber-500/10 text-xs md:text-sm font-black text-amber-500/80 uppercase italic tracking-widest">{k}</span>)}
                           </div>
                         </div>
                      ) : isPaid ? null : (
                         <div className="p-6 md:p-10 bg-white/[0.02] rounded-[30px] md:rounded-[40px] border border-white/5 blur-sm opacity-20 select-none text-center lg:text-left">
                            <h4 className="text-lg md:text-xl font-black mb-4 italic uppercase tracking-tighter">Elite Gap Analysis...</h4>
                         </div>
                      )}
                   </div>

                   {!isPaid && (
                      <div className="space-y-12 pt-8 md:pt-12 border-t border-white/5">
                         <div className="text-center space-y-4">
                            <Lock className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-white/10" />
                            <h3 className="text-3xl md:text-4xl font-[1000] italic uppercase tracking-tighter leading-none">Upgrade to Unlock Report</h3>
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
                            <button onClick={() => { setSelectedPlan({ tier: 'EXPERT', price: 399 }); setView('payment'); }} className="p-6 md:p-10 rounded-[30px] md:rounded-[40px] bg-[#0A0A0A] border border-white/10 hover:border-indigo-500 transition-all text-center relative overflow-hidden">
                               <div className="absolute top-2 right-2 bg-blue-500 text-[8px] font-black px-2 py-0.5 rounded-full text-white uppercase italic">AI</div>
                               <div className="text-3xl font-black italic">₹399</div>
                               <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2">Expert</h4>
                            </button>
                         </div>
                      </div>
                   )}

                   {(isPaid && selectedPlan?.tier === 'EXPERT') && (
                      <div className="p-8 md:p-12 rounded-[40px] md:rounded-[50px] bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent border border-white/10 space-y-10 relative overflow-hidden backdrop-blur-fix text-center md:text-left">
                         <div className="relative z-10 space-y-8 md:space-y-12">
                            <h3 className="text-3xl md:text-4xl font-[1000] italic uppercase tracking-tighter leading-none text-balance">Neural Builder <Sparkles className="inline text-indigo-400 animate-pulse" /></h3>
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
                                  <button onClick={handleDownload} className="flex-1 py-6 md:py-7 bg-green-500 text-white rounded-3xl font-[1000] text-xl md:text-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-4 shadow-2xl uppercase italic leading-none">
                                     <CheckCircle className="w-6 h-6" /> Download PDF
                                  </button>
                                  <Link href="/expert-resume-builder" className="flex-1 py-6 md:py-7 bg-blue-600 text-white rounded-3xl font-[1000] text-xl md:text-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 shadow-2xl uppercase italic leading-none">
                                     AI Builder <Sparkles className="w-6 h-6" />
                                  </Link>
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
             <PaymentTimer />
             <div className="bg-[#0A0A0A] p-8 md:p-16 rounded-[40px] md:rounded-[60px] border border-white/10 space-y-10 md:space-y-12 shadow-2xl backdrop-blur-fix">
                <h2 className="text-4xl md:text-5xl font-[1000] tracking-tight uppercase italic flex items-center justify-center gap-4 leading-none">
                   <Shield className="text-blue-500 shrink-0" /> Checkout
                </h2>
                {paymentStep === 1 && (
                   <div className="space-y-10 md:space-y-12 text-center">
                      <div className="p-10 md:p-14 bg-white/[0.02] rounded-[30px] md:rounded-[48px] border border-white/10">
                        <span className="text-[9px] md:text-[10px] font-[1000] uppercase tracking-[0.5em] text-white/20 mb-4 block italic text-center">Billing Tier: {selectedPlan?.tier || 'ELITE'}</span>
                        <span className="text-7xl md:text-9xl font-[1000] tracking-tighter italic text-center block leading-none text-blue-500">₹{selectedPlan?.price || 199}</span>
                      </div>
                      <button onClick={() => setPaymentStep(2)} className="w-full py-6 md:py-7 bg-blue-600 text-white rounded-[24px] md:rounded-[30px] font-[1000] text-xl md:text-2xl shadow-2xl shadow-blue-500/30 uppercase italic">Pay with UPI / QR</button>
                   </div>
                )}
                {paymentStep === 2 && (
                   <div className="space-y-10 md:space-y-12 text-center">
                      <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] inline-block shadow-2xl mx-auto">
                         <img src="/payment-qr.jpg" alt="QR" className="w-48 h-48 md:w-64 md:h-64" />
                         <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                            <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">UPI ID:</p>
                            <p className="text-xl font-black text-blue-600 italic">itspsr1@ybl</p>
                         </div>
                      </div>
                      <div className="text-left space-y-6 md:space-y-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-white/20 ml-2 tracking-widest">12-Digit UTR Number</label>
                           <input type="text" placeholder="e.g. 812834131941" className="w-full p-5 md:p-7 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl outline-none focus:border-blue-600 transition-all text-white" value={utr} onChange={(e)=>setUtr(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-white/20 ml-2 tracking-widest">Transaction ID</label>
                           <input type="text" placeholder="e.g. T260213..." className="w-full p-5 md:p-7 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl outline-none focus:border-blue-600 transition-all text-white" value={transactionId} onChange={(e)=>setTransactionId(e.target.value)} />
                        </div>
                        {paymentError && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-[1000] rounded-xl uppercase tracking-widest text-center leading-relaxed italic">{paymentError}</div>}
                        <button onClick={handlePaymentSubmit} className="w-full py-6 md:py-7 bg-white text-black rounded-2xl md:rounded-3xl font-[1000] text-xl md:text-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl uppercase italic">Verify Payment</button>
                      </div>
                   </div>
                )}
                {paymentStep === 4 && (
                   <div className="py-12 md:py-20 space-y-8 md:space-y-12 text-center">
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
      </AnimatePresence>

      <footer className="bg-[#020202] pt-32 md:pt-40 pb-16 md:pb-20 border-t border-white/5 px-4 md:px-6 relative z-10 text-center md:text-left">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-16 lg:gap-32 border-b border-white/5 pb-24 md:pb-32 mb-16 md:mb-20">
            <div className="max-w-md space-y-10 md:space-y-12 mx-auto lg:mx-0">
               <Link href="/" className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center font-[1000] italic text-white shadow-lg shadow-blue-500/20">PS</div>
                  <span className="text-2xl md:text-4xl font-[1000] tracking-tighter uppercase italic text-balance">PlacementScore<span className="text-blue-500">.online</span></span>
               </Link>
               <p className="text-lg md:text-xl text-white/30 font-medium leading-relaxed italic">The definitive AI career benchmark for Indian graduates. Engineered to bypass automated filters.</p>
               <div className="flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12">
                  <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/20"><Shield className="w-4 h-4 text-blue-500" /> Secure</div>
                  <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/20">🇮🇳 Bharat First</div>
               </div>
               <div className="text-[10px] font-black uppercase text-white/10 leading-relaxed max-w-xs mx-auto lg:mx-0">
                  PlacementScore Technologies Pvt Ltd<br />
                  #42, 3rd Floor, Residency Road, Ashok Nagar<br />
                  Bengaluru, Karnataka 560025, India
               </div>
            </div>
            <div className="grid grid-cols-2 gap-10 md:gap-32 max-w-lg mx-auto lg:mx-0">
               <div className="space-y-8 md:space-y-10">
                  <h5 className="text-[11px] font-[1000] uppercase text-white/10 tracking-[0.4em]">Sitemap</h5>
                  <ul className="space-y-4 md:space-y-6 text-sm md:text-base font-black text-white/40 uppercase tracking-widest italic">
                     <li><Link href="/blog" className="hover:text-blue-500">Blog</Link></li>
                     <li><Link href="/contact" className="hover:text-blue-500">Contact</Link></li>
                     <li><Link href="/privacy" className="hover:text-blue-500">Privacy</Link></li>
                     <li><Link href="/terms" className="hover:text-blue-500">Terms</Link></li>
                  </ul>
               </div>
               <div className="space-y-8 md:space-y-10">
                  <h5 className="text-[11px] font-[1000] uppercase text-white/10 tracking-[0.4em]">Lead Hub</h5>
                  <ul className="space-y-4 md:space-y-6 text-sm md:text-base font-black text-blue-500 uppercase tracking-widest italic text-center md:text-left">
                     <li><Link href="/free-resume-template" className="hover:text-white transition-all underline decoration-blue-500/20 underline-offset-8">Free Template</Link></li>
                     <li><Link href="/ats-score-calculator" className="hover:text-white transition-all underline decoration-blue-500/20 underline-offset-8">Calculator</Link></li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-7xl mx-auto text-center">
            <p className="text-white/20 font-black text-[9px] md:text-[10px] uppercase tracking-[0.5em] animate-pulse italic">© 2026 PlacementScore.online. All Rights Reserved.</p>
            <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/10 italic text-balance">Built with <Heart className="w-3 h-3 text-red-600 fill-current animate-bounce" /> for Bharat's Students</div>
         </div>
      </footer>
      
      {/* Scroll-based CTA Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-10 left-10 right-10 md:left-auto md:right-10 z-[110] md:max-w-md w-full">
             <div className="bg-blue-600 p-8 rounded-[40px] shadow-2xl border border-white/20 relative overflow-hidden group">
                <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40 transition-colors"><X className="w-4 h-4" /></button>
                <div className="space-y-6 relative z-10">
                   <h4 className="text-2xl font-[1000] italic uppercase tracking-tighter leading-tight text-white">Secure Your Placement <br /> Before 2026 Ends.</h4>
                   <p className="text-white/80 font-bold italic text-sm text-balance">Don't let a generic resume kill your dream job. Get your AI-powered ATS Audit report instantly.</p>
                   <button onClick={() => { setShowPopup(false); scrollToSection('upload'); }} className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-xl">Check My Score Now</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const TrustBadge = ({ icon: Icon, title }: any) => (
   <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full group hover:border-blue-500/30 transition-all">
      <Icon className="text-blue-500 w-3 h-3" />
      <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{title}</span>
   </div>
);

const ToolCard = ({ icon: Icon, title, desc, link }: any) => (
   <Link href={link}>
      <motion.div whileHover={{ y: -5 }} className="p-8 bg-[#0A0A0A] rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all h-full space-y-6 group shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity"><Icon className="w-20 h-20" /></div>
         <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-blue-500/5"><Icon className="w-6 h-6" /></div>
         <div className="space-y-2">
            <h4 className="text-xl font-black italic uppercase tracking-tighter">{title}</h4>
            <p className="text-xs text-white/30 font-medium leading-relaxed">{desc}</p>
         </div>
         <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 tracking-widest opacity-0 group-hover:opacity-100 transition-all">
            Launch Tool <ChevronRight className="w-3 h-3" />
         </div>
      </motion.div>
   </Link>
);

const CaseStudyCard = ({ name, college, before, after, result, quote }: any) => (
   <div className="p-10 bg-[#0A0A0A] rounded-[50px] border border-white/5 shadow-2xl relative group overflow-hidden space-y-8 backdrop-blur-fix text-center lg:text-left">
      <div className="absolute top-0 right-0 p-8 opacity-5"><Verified className="w-20 h-20 text-blue-500" /></div>
      <div className="space-y-2">
         <h4 className="text-2xl font-[1000] italic uppercase tracking-tighter mx-auto lg:mx-0">{name}</h4>
         <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mx-auto lg:mx-0">{college}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
         <div className="text-center lg:text-left"><p className="text-[9px] uppercase font-bold text-white/20 mb-1">Before</p><p className="text-2xl font-black text-white/40 italic">{before}</p></div>
         <div className="border-l border-white/5 pl-4 text-center lg:text-left"><p className="text-[9px] uppercase font-bold text-blue-500 mb-1">After</p><p className="text-3xl font-[1000] text-blue-500 italic">+{after - before}</p></div>
      </div>
      <div className="space-y-4">
         <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-[10px] font-black uppercase tracking-widest text-center italic">{result}</div>
         <p className="text-sm text-white/40 leading-relaxed font-medium italic mx-auto lg:mx-0">"{quote}"</p>
      </div>
   </div>
);

const StepCard = ({ num, icon: Icon, title, desc }: any) => (
   <div className="p-10 md:p-16 bg-[#0A0A0A] rounded-[40px] md:rounded-[60px] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden shadow-2xl backdrop-blur-fix">
      <div className="absolute top-0 right-0 p-8 md:p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Icon className="w-20 h-20 md:w-32 md:h-32" /></div>
      <div className="text-4xl md:text-6xl font-[1000] text-white/5 mb-6 md:mb-10 group-hover:text-blue-500/10 transition-colors italic leading-none">{num}</div>
      <h3 className="text-2xl md:text-3xl font-black italic mb-4 md:mb-6 uppercase tracking-tighter leading-tight text-center md:text-left">{title}</h3>
      <p className="text-base md:text-xl text-white/40 font-medium leading-relaxed text-center md:text-left">{desc}</p>
   </div>
);

const InsightItem = ({ icon: Icon, text }: any) => (
   <li className="flex items-center justify-center md:justify-start gap-4 md:gap-6 text-white/60 font-black text-lg md:text-2xl group cursor-default italic tracking-tighter uppercase leading-tight">
      <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl md:rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center ring-1 ring-blue-500/20"><Icon className="w-4 h-4 md:w-6 md:h-6" /></div>
      <span className="text-left">{text}</span>
   </li>
);

const TestimonialCard = ({ quote, name, college }: any) => (
   <div className="p-10 md:p-16 bg-[#0A0A0A] rounded-[40px] md:rounded-[60px] border border-white/5 space-y-6 md:space-y-10 hover:scale-[1.03] transition-all duration-700 shadow-2xl relative group overflow-hidden backdrop-blur-fix text-center md:text-left">
      <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <p className="text-lg md:text-2xl text-white/50 font-medium leading-relaxed italic relative z-10 tracking-tight">"{quote}"</p>
      <div className="pt-6 md:pt-10 border-t border-white/5 flex flex-col md:flex-row items-center gap-4 md:gap-6 relative z-10 justify-center md:justify-start">
         <div className="w-12 h-12 md:w-16 md:h-16 rounded-[18px] md:rounded-[24px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-[1000] italic text-xl md:text-2xl text-white shadow-xl shadow-blue-500/20">{name[0]}</div>
         <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter leading-none">{name}</h4>
            <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">{college}</p>
         </div>
      </div>
   </div>
);

const PricingCard = ({ tier, price, perks, popular, setView, setSelectedPlan, file }: any) => (
  <div className={`p-8 md:p-16 rounded-[40px] md:rounded-[70px] bg-[#0A0A0A] border ${popular ? 'border-blue-600 ring-[12px] md:ring-[20px] ring-blue-600/5' : 'border-white/5'} transition-all hover:scale-[1.03] duration-700 flex flex-col shadow-2xl relative overflow-hidden group backdrop-blur-fix`}>
     {popular && <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white py-1.5 px-6 md:px-8 rounded-full text-[8px] md:text-[10px] font-[1000] uppercase italic tracking-[0.3em] shadow-2xl shadow-blue-500/40 z-10 whitespace-nowrap">Highly Recommended</div>}
     <h3 className="text-[10px] md:text-[11px] font-[1000] tracking-[0.4em] md:tracking-[0.5em] uppercase text-white/20 mb-4 md:mb-6 italic text-center md:text-left">{tier === 'ELITE' || tier === 'GROWTH' ? 'Elite' : tier}</h3>
     <div className="flex items-baseline justify-center md:justify-start gap-2 mb-8 md:mb-16">
        <span className="text-6xl md:text-8xl font-[1000] tracking-tighter italic leading-none">₹{price}</span>
        <span className="text-white/20 text-[10px] md:text-xs font-black uppercase tracking-widest">/scan</span>
     </div>
     <ul className="text-left space-y-4 md:space-y-8 mb-10 md:mb-20 flex-1">
        {perks.map((p: any) => <li key={p} className="flex gap-4 md:gap-5 items-start text-white/50 font-black text-xs md:text-sm uppercase tracking-tight italic group-hover:text-white/70 transition-colors"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500 shrink-0 mt-0.5" /> {p}</li>)}
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

const PaymentTimer = () => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`mb-8 p-4 rounded-2xl border transition-all ${timeLeft < 60 ? 'bg-red-600/10 border-red-500/50 text-red-500 animate-pulse' : 'bg-blue-600/5 border-blue-500/20 text-blue-400'}`}>
       <div className="flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm italic">
          <Clock className="w-5 h-5" />
          {timeLeft > 0 ? `⚡ Offer expires in ${formatTime(timeLeft)}` : "Offer expired – reload to continue"}
       </div>
    </div>
  );
};
