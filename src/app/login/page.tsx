"use client";

import { signIn } from "next-auth/react";
import { Shield, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.05] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/[0.05] blur-[120px] rounded-full" />

      <div className="max-w-md w-full relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0A] p-10 md:p-12 rounded-[48px] border border-white/5 shadow-2xl text-center space-y-10"
        >
          <div className="space-y-4">
             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-[1000] italic text-2xl mx-auto shadow-lg shadow-blue-500/20">PS</div>
             <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter">Sign In</h1>
             <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Secure Access for PlacementScore.online</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const email = (form.elements.namedItem('email') as HTMLInputElement).value;
              const password = (form.elements.namedItem('password') as HTMLInputElement).value;
              await signIn("credentials", { callbackUrl: "/", email, password });
            }}
          >
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none focus:border-blue-600"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="w-full py-6 bg-white text-black rounded-3xl font-[1000] text-xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group"
            >
              <Sparkles className="w-6 h-6" />
              Continue
            </button>
          </form>

          <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
             <Shield className="w-4 h-4 text-blue-500" />
             Email/Password via Supabase Auth
          </div>
        </motion.div>
      </div>
    </main>
  );
}
