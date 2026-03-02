'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authProvider';
import { getSupabaseBrowser } from '@/lib/supabaseClient';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const userId = user?.id || null;
  const [contactNo, setContactNo] = useState(profile?.contact_no || '');
  const [jobRole, setJobRole] = useState(profile?.job_role || '');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setContactNo(profile?.contact_no || '');
    setJobRole(profile?.job_role || '');
  }, [profile]);

  const handleSave = async () => {
    if (!userId) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase
      .from('profiles')
      .update({ contact_no: contactNo || null, job_role: jobRole || null })
      .eq('id', userId);
    setStatus(error ? 'Update failed' : 'Profile updated');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight">Profile</h1>
      <div className="mt-10 space-y-4 text-white/70">
        <div><span className="text-white/40">Name:</span> {profile?.name ?? 'User'}</div>
        <div><span className="text-white/40">Email:</span> {profile?.email ?? user?.email}</div>
        <div><span className="text-white/40">Plan:</span> {profile?.plan ?? 'free'}</div>
      </div>

      <div className="mt-10 space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-white/30 ml-2 tracking-widest">Contact No</label>
          <input className="w-full p-4 bg-white/5 border border-white/10 rounded-xl" value={contactNo} onChange={(e) => setContactNo(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-white/30 ml-2 tracking-widest">Job Role</label>
          <input className="w-full p-4 bg-white/5 border border-white/10 rounded-xl" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
        </div>
        <button onClick={handleSave} className="px-6 py-3 bg-blue-600 rounded-xl font-black uppercase">Save</button>
        {status && <div className="text-xs text-white/50">{status}</div>}
      </div>
    </div>
  );
}
