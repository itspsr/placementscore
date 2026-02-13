import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.email !== "admin@placementscore.online") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter">Admin Control Center</h1>
          <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white/40 italic">
            Verified: {session.user?.email}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5 shadow-2xl space-y-4">
              <h3 className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Total Scans</h3>
              <p className="text-5xl font-[1000] italic">24,832</p>
           </div>
           <div className="bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5 shadow-2xl space-y-4">
              <h3 className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Active Revenue</h3>
              <p className="text-5xl font-[1000] italic text-blue-500">₹42.8k</p>
           </div>
           <div className="bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5 shadow-2xl space-y-4">
              <h3 className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Verified Users</h3>
              <p className="text-5xl font-[1000] italic text-indigo-500">12,401</p>
           </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              <tr>
                <th className="p-10">Student Profile</th>
                <th className="p-10">Success Tier</th>
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
                <td className="p-10 text-right"><button className="px-6 py-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-black transition-all text-[9px] uppercase font-black">Approve</button></td>
              </tr>
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-10">Priya K. (VIT)</td>
                <td className="p-10 text-indigo-500 uppercase tracking-widest italic text-[10px]">Expert</td>
                <td className="p-10 font-mono tracking-widest text-[10px]">991102213122</td>
                <td className="p-10 text-green-500 italic uppercase tracking-widest text-[10px]">Verified</td>
                <td className="p-10 text-right">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
