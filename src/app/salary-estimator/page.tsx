"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, IndianRupee, MapPin, Briefcase, 
  TrendingUp, BarChart3, Zap, ArrowRight,
  Calculator
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { ExpertGate } from "@/components/ExpertGate";

export default function SalaryEstimator() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState("Software Engineer");
  const [experience, setExperience] = useState(0);
  const [city, setCity] = useState("Bangalore");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpert, setIsExpert] = useState(false);

  useEffect(() => {
    const savedPaidStatus = localStorage.getItem('ps_is_paid_expert');
    if (savedPaidStatus === 'true' || session?.user?.email === "admin@placementscore.online") {
      setIsExpert(true);
    }
  }, [session]);

  const calculateSalary = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/salary-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, experience, city })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Failed to calculate. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.05] blur-[120px] rounded-full" />
      
      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-tight italic">SALARY <br /> <span className="text-blue-500">ESTIMATOR</span></h1>
          <p className="text-xl text-white/40 font-medium italic">Benchmark your market value for 2026-2027 in India's top tech hubs.</p>
        </div>

        <ExpertGate isExpert={isExpert}>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-[#0A0A0A] p-8 md:p-12 rounded-[50px] border border-white/5 shadow-2xl space-y-8">
              <div className="space-y-6 text-left">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest block">Job Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-5 pl-16 bg-black border border-white/10 rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none cursor-pointer"
                    >
                      <option>Software Engineer</option>
                      <option>Data Analyst</option>
                      <option>MBA / Management</option>
                      <option>BTech / Engineering</option>
                      <option>Full Stack Developer</option>
                      <option>UI/UX Designer</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest flex justify-between block">
                    Experience <span>{experience} Years</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-white/20 ml-2 tracking-widest block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                    <select 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-5 pl-16 bg-black border border-white/10 rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none cursor-pointer"
                    >
                      <option>Bangalore</option>
                      <option>Pune</option>
                      <option>Hyderabad</option>
                      <option>Mumbai</option>
                      <option>Delhi</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={calculateSalary}
                disabled={isLoading}
                className="w-full py-7 bg-blue-600 rounded-3xl font-[1000] text-xl hover:bg-blue-500 transition-all shadow-2xl flex items-center justify-center gap-3 uppercase italic disabled:opacity-50"
              >
                {isLoading ? "Calculating..." : <><Calculator className="w-5 h-5" /> Calculate My Worth</>}
              </button>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 md:p-14 rounded-[60px] shadow-2xl space-y-10 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                      <IndianRupee className="w-40 h-40" />
                    </div>
                    
                    <div className="space-y-6 relative z-10 text-center">
                      <div className="space-y-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Estimated Average Package</h3>
                        <p className="text-6xl md:text-7xl font-[1000] italic tracking-tighter">{formatPrice(result.avg)}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                         <div className="space-y-1 text-left">
                            <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Entry Band</p>
                            <p className="text-2xl font-black">{formatPrice(result.min)}</p>
                         </div>
                         <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Top 10% Band</p>
                            <p className="text-2xl font-black text-green-400">{formatPrice(result.top10)}</p>
                         </div>
                      </div>
                    </div>

                    <div className="bg-black/20 p-8 rounded-[40px] border border-white/10 relative z-10 space-y-4 text-left">
                       <div className="flex items-center gap-3">
                          <TrendingUp className="text-green-400 w-5 h-5" />
                          <h4 className="text-lg font-black italic uppercase tracking-tighter">Reach the Top Band</h4>
                       </div>
                       <p className="text-sm text-white/70 font-medium italic">"Your {result.role} profile could reach {formatPrice(result.top10)} with an optimized ATS score."</p>
                       <Link href="/" className="inline-flex py-4 px-8 bg-white text-blue-600 rounded-2xl font-[1000] text-sm uppercase italic items-center gap-2 hover:bg-black hover:text-white transition-all">
                          Optimize My Resume <ArrowRight className="w-4 h-4" />
                       </Link>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 border border-white/5 rounded-[60px] bg-white/[0.01]">
                    <BarChart3 className="w-20 h-20 text-white/5" />
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white/20">Awaiting Data</h3>
                       <p className="text-sm text-white/10 font-bold uppercase tracking-widest">Input your details to unlock salary bands</p>
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
