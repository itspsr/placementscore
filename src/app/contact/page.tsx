import React from 'react';
import { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Contact Us | Support for PlacementScore.online",
  description: "Get in touch with our career experts in Gurugram and Kolkata for technical support or placement guidance.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      <div className="max-w-6xl mx-auto space-y-12">
        <BackButton />
        <div className="grid lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <h1 className="text-5xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-none text-balance">
              Global <br /> <span className="text-blue-500">Support.</span>
            </h1>
            <p className="text-xl text-white/40 leading-relaxed italic">
              Our technical support and career counseling hubs are ready to assist your journey 24/7.
            </p>
            
            <div className="space-y-10">
              <div className="flex items-center gap-8 group">
                <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center group-hover:border-blue-500 transition-all shadow-xl">
                  <Mail className="text-blue-500 w-10 h-10" />
                </div>
                <div>
                  <h5 className="text-white font-[1000] italic uppercase text-2xl tracking-tighter">Support Email</h5>
                  <p className="font-bold text-white/20 text-lg">support@placementscore.online</p>
                </div>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center group-hover:border-blue-500 transition-all shadow-xl">
                  <MapPin className="text-blue-500 w-10 h-10" />
                </div>
                <div>
                  <h5 className="text-white font-[1000] italic uppercase text-2xl tracking-tighter">Corporate Office</h5>
                  <p className="font-bold text-white/20 text-lg italic">Sector V, Salt Lake, Kolkata, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-10 md:p-16 rounded-[60px] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/20 ml-3 tracking-[0.3em]">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full p-6 bg-black border border-white/10 rounded-3xl outline-none focus:border-blue-600 font-bold transition-all text-white shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/20 ml-3 tracking-[0.3em]">Inquiry</label>
                <textarea placeholder="How can our career experts help you today?" className="w-full p-8 bg-black border border-white/10 rounded-[40px] h-48 outline-none focus:border-blue-600 font-bold transition-all text-white shadow-inner resize-none" />
              </div>
              <button className="w-full py-8 bg-blue-600 rounded-[30px] font-[1000] text-2xl hover:bg-blue-500 transition-all shadow-2xl uppercase italic tracking-tighter">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
