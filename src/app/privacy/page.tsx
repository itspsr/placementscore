import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PlacementScore.online - 100% Data Security",
  description: "Learn how PlacementScore protects your resume data with 256-bit encryption and volatile memory processing.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      <div className="max-w-4xl mx-auto space-y-16">
        <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter">Privacy Shield</h1>
        <div className="prose prose-invert max-w-none text-white/40 font-medium leading-loose text-lg space-y-10 italic">
          <p>At <strong>PlacementScore.online</strong>, we handle highly sensitive professional data. Our privacy architecture is built on the principle of <strong>Zero Permanent Storage</strong>. Resumes are processed in encrypted volatile memory (RAM) and purged immediately after the 30-minute analysis window closes.</p>
          
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">1. Data Sovereignty</h2>
          <p>We believe your professional history belongs to you. We do not sell, rent, or trade your personal information to third-party recruiters, advertising agencies, or marketing companies. Our revenue model is 100% service-based (SaaS), not data-based.</p>

          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">2. AES-256 Encryption</h2>
          <p>All data transmitted to our servers is protected by high-grade SSL certificates and stored using 256-bit AES encryption at rest. This ensures that even in the unlikely event of a breach, your data remains indecipherable to unauthorized parties.</p>

          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">3. Compliance</h2>
          <p>Our platform is designed to meet and exceed global privacy standards, including the Indian Digital Personal Data Protection (DPDP) Act of 2023. We provide users with the right to request a complete data purge from our indexing buffer at any time.</p>
        </div>
      </div>
    </main>
  );
}
