import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Shield, Users, IndianRupee, Verified, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // HYPER-STRICT GATING: Only allow specific admin email
  if (!session || session.user?.email !== "admin@placementscore.online") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/[0.02] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 text-left">
            <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-4 group">
               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               Exit Console
            </Link>
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter">Admin Dashboard</h1>
            <p className="text-white/30 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
               <Lock className="w-3 h-3 text-blue-500" /> Secure Terminal: {session.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
             <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Live Authority Node</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <AdminStatCard title="Total Scans" value="24,832" icon={Users} />
           <AdminStatCard title="Revenue (MTD)" value="₹42.8k" icon={IndianRupee} color="text-blue-500" />
           <AdminStatCard title="Verified Users" value="12,401" icon={Shield} color="text-indigo-500" />
        </div>

        {/* Request Table */}
        <div className="bg-[#0A0A0A] rounded-[50px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-3xl">
          <div className="p-10 border-b border-white/5">
             <h4 className="text-xl font-[1000] italic uppercase tracking-tighter">Transaction Verification Pool</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
                <tr>
                  <th className="p-10 text-left">Student profile</th>
                  <th className="p-10 text-left">Success Tier</th>
                  <th className="p-10 text-left">UTR Payload</th>
                  <th className="p-10 text-left">Security Status</th>
                  <th className="p-10 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-bold text-sm">
                <AdminRow name="Aman S. (IIT-D)" tier="Elite" utr="882103322199" status="Awaiting Proof" color="text-blue-500" />
                <AdminRow name="Priya K. (VIT)" tier="Expert" utr="991102213122" status="Verified" color="text-indigo-500" verified />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

const AdminStatCard = ({ title, value, icon: Icon, color = "" }: any) => (
  <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-4">
     <div className="flex items-center justify-between">
        <h3 className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">{title}</h3>
        <Icon className="text-blue-500 w-5 h-5" />
     </div>
     <p className={`text-6xl font-[1000] italic ${color}`}>{value}</p>
  </div>
);

const AdminRow = ({ name, tier, utr, status, color, verified = false }: any) => (
  <tr className="hover:bg-white/[0.01] transition-colors">
    <td className="p-10 text-left">{name}</td>
    <td className={`p-10 text-left uppercase tracking-widest italic text-[10px] ${color}`}>{tier}</td>
    <td className="p-10 text-left font-mono tracking-widest text-[10px]">{utr}</td>
    <td className="p-10 text-left text-amber-500 italic uppercase tracking-widest text-[10px]">{status}</td>
    <td className="p-10 text-right">
       {verified ? <Verified className="text-blue-500 w-5 h-5 ml-auto" /> : 
       <button className="px-6 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-black transition-all text-[9px] uppercase font-black tracking-widest">Approve</button>}
    </td>
  </tr>
);
