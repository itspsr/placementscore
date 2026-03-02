"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Trash2, Zap, Loader2, Plus, 
  ExternalLink, Calendar, Tag, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs-list');
      const data = await res.json();
      setBlogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      // Note: We need to create an API for deletion if it doesn't exist
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== id));
      }
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMessage("Neural Engine active: Deconstructing keywords...");
    
    try {
      const res = await fetch('/api/auto-generate-blog');
      const data = await res.json();
      
      if (data.success) {
        setMessage(`Success! Created: ${data.slug}`);
        fetchBlogs();
      } else {
        setMessage(`Failed: ${data.error}`);
      }
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <Link href="/admin" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-4 group">
               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               Back to Console
            </Link>
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter">Content <span className="text-blue-500">Pipeline</span></h1>
            <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Managing daily AI generated authority guides</p>
          </div>

          <div className="flex gap-4">
             <button 
               onClick={handleGenerate}
               disabled={isGenerating}
               className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 uppercase italic disabled:opacity-50"
             >
               {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
               Manual Generate
             </button>
          </div>
        </div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl text-blue-500 font-bold text-center italic">
            {message}
          </motion.div>
        )}

        <div className="bg-[#0A0A0A] rounded-[50px] border border-white/5 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-40 text-center space-y-4">
               <Loader2 className="w-12 h-12 animate-spin mx-auto text-white/10" />
               <p className="font-black uppercase tracking-widest text-[10px] text-white/20">Loading Database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
                  <tr>
                    <th className="p-10">Asset Title</th>
                    <th className="p-10">Topic Cluster</th>
                    <th className="p-10">Keyword focus</th>
                    <th className="p-10">Created At</th>
                    <th className="p-10 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-bold text-sm">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="p-10">
                        <div className="space-y-1">
                          <p className="text-white group-hover:text-blue-500 transition-colors">{blog.title}</p>
                          <p className="text-[10px] text-white/20 font-mono italic">/blog/{blog.slug}</p>
                        </div>
                      </td>
                      <td className="p-10">
                        <span className="px-4 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-white/40">{blog.cluster}</span>
                      </td>
                      <td className="p-10">
                         <div className="flex items-center gap-2 text-indigo-400 italic">
                           <Tag className="w-3 h-3" /> {blog.keyword || blog.keywords}
                         </div>
                      </td>
                      <td className="p-10 text-white/20 text-xs">
                        {new Date(blog.createdAt || blog.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-10 text-right">
                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/blog/${blog.slug}`} target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
                             <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(blog.id)} className="p-3 bg-red-500/10 rounded-xl hover:bg-red-500 text-red-500 hover:text-white transition-all">
                             <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
