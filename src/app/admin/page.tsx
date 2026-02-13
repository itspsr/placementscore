import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Shield, Users, IndianRupee, Verified, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // SECURE GATING: Only allow specific admin email
  if (!session || session.user?.email !== "admin@placementscore.online") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/[0.02] blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-4 group">
               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               Dashboard
            </Link>
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter">Admin Console</h1>
            <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Verified Access: {session.user?.email}</p>
          </div>
          <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-green-500">System Online</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Total Scans</h3>
                 <Users className="text-blue-500 w-5 h-5" />
              </div>
              <p className="text-6xl font-[1000] italic">24,832</p>
           </div>
           <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Active Revenue</h3>
                 <IndianRupee className="text-blue-500 w-5 h-5" />
              </div>
              <p className="text-6xl font-[1000] italic text-blue-500">₹42.8k</p>
           </div>
           <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Verified Users</h3>
                 <Shield className="text-blue-500 w-5 h-5" />
              </div>
              <p className="text-6xl font-[1000] italic text-indigo-500">12,401</p>
           </div>
        </div>

        {/* User Table */}
        <div className="bg-[#0A0A0A] rounded-[50px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-3xl">
          <div className="p-10 border-b border-white/5">
             <h4 className="text-xl font-[1000] italic uppercase tracking-tighter">Recent Verification Requests</h4>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
              <tr>
                <th className="p-10">Student</th>
                <th className="p-10">Tier</th>
                <th className="p-10">UTR Verification</th>
                <th className="p-10">Status</th>
                <th className="p-10 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-bold text-sm">
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-10">Aman S. (IIT-D)</td>
                <td className="p-10 text-blue-500 uppercase tracking-widest italic text-[10px]">Elite</td>
                <td className="p-10 font-mono tracking-widest text-[10px]">882103322199</td>
                <td className="p-10 text-amber-500 italic uppercase tracking-widest text-[10px]">Awaiting Proof</td>
                <td className="p-10 text-right">
                   <button className="px-6 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-black transition-all text-[9px] uppercase font-black tracking-widest">Approve</button>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-10">Priya K. (VIT)</td>
                <td className="p-10 text-indigo-500 uppercase tracking-widest italic text-[10px]">Expert</td>
                <td className="p-10 font-mono tracking-widest text-[10px]">991102213122</td>
                <td className="p-10 text-green-500 italic uppercase tracking-widest text-[10px]">Verified</td>
                <td className="p-10 text-right">
                   <Verified className="text-blue-500 w-5 h-5 ml-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
