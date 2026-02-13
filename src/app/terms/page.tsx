import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | PlacementScore.online",
  description: "Terms and conditions for using the PlacementScore AI analysis engine.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pt-32">
      <div className="max-w-4xl mx-auto space-y-16">
        <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter">Usage Agreement</h1>
        <div className="prose prose-invert max-w-none text-white/40 font-medium leading-loose text-lg space-y-10 italic">
          <p>By accessing the <strong>PlacementScore.online</strong> ecosystem, you agree to comply with and be bound by the following terms. These terms are designed to ensure a fair, transparent, and high-quality experience for all job-seeking students.</p>
          
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">1. Digital Delivery Policy</h2>
          <p>PlacementScore provides immediate, intangible digital reports. Due to the high computational costs of running neural analysis, all transactions for the <strong>Base</strong>, <strong>Elite</strong>, and <strong>Expert</strong> plans are considered final once the report generation process has initiated.</p>

          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">2. Proprietary Scoring Logic</h2>
          <p>The "Placement Score" is a statistical estimate based on industry benchmarks. While our engine maintains 95%+ logic parity with top corporate scanners, we do not guarantee employment outcomes, as final hiring decisions remain with the employers.</p>

          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">3. Acceptable Use</h2>
          <p>Users are prohibited from attempting to reverse-engineer our scoring weights or using automated scripts to scrape analysis data. Any breach of this clause will result in immediate and permanent account suspension without refund.</p>
        </div>
      </div>
    </main>
  );
}
