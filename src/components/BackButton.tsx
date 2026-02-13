"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ text = "Back" }: { text?: string }) {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()} 
      className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors group cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {text}
    </button>
  );
}
