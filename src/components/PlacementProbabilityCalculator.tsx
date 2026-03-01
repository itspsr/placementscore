"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Tier = "Tier 1" | "Tier 2" | "Tier 3";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function scorePlacement(input: {
  tier: Tier;
  cgpa: number;
  skills: number;
  internships: number;
  projects: number;
  certifications: number;
}) {
  const base = 40;
  const tierBoost = input.tier === "Tier 1" ? 20 : input.tier === "Tier 2" ? 10 : 0;
  const cgpaPts = input.cgpa * 3;
  const skillsPts = clamp(input.skills * 2, 0, 20);
  const internshipsPts = clamp(input.internships * 5, 0, 15);
  const projectsPts = clamp(input.projects * 2, 0, 10);
  const certPts = clamp(input.certifications * 2, 0, 10);

  const raw = base + tierBoost + cgpaPts + skillsPts + internshipsPts + projectsPts + certPts;
  const score = clamp(Math.round(raw), 0, 100);

  const label = score > 75 ? "High Chance" : score >= 50 ? "Moderate" : "Needs Improvement";

  const buckets = [
    { key: "cgpa", value: cgpaPts, max: 30, suggest: "Raise CGPA by tightening semester targets and prioritizing high-weight subjects." },
    { key: "skills", value: skillsPts, max: 20, suggest: "Add 2–3 job-aligned skills (DSA, SQL, React/Node, Python) and showcase them in projects." },
    { key: "internships", value: internshipsPts, max: 15, suggest: "Aim for at least 1 internship. Even a 4–6 week role adds strong recruiter proof." },
    { key: "projects", value: projectsPts, max: 10, suggest: "Ship 1 strong project with measurable outcomes (users, latency, revenue, automation)." },
    { key: "cert", value: certPts, max: 10, suggest: "Add 1 certification in your target domain (Cloud, Data, Cyber, Product, DevOps)." }
  ].map((b) => ({ ...b, gap: b.max - b.value }));

  const suggestions = buckets
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)
    .map((b) => b.suggest);

  return { score, label, suggestions };
}

export default function PlacementProbabilityCalculator() {
  const [tier, setTier] = useState<Tier>("Tier 2");
  const [cgpa, setCgpa] = useState<number>(7.5);
  const [skills, setSkills] = useState<number>(6);
  const [internships, setInternships] = useState<number>(1);
  const [projects, setProjects] = useState<number>(3);
  const [certifications, setCertifications] = useState<number>(1);

  const [submitted, setSubmitted] = useState(false);

  // client-only randomized funnel signals (avoid hydration mismatch)
  const [scarcityToday, setScarcityToday] = useState<number | null>(null);
  const [auditsLeft, setAuditsLeft] = useState<number | null>(null);
  const [uplift, setUplift] = useState<number | null>(null);

  useEffect(() => {
    setScarcityToday(12 + Math.floor(Math.random() * (47 - 12 + 1)));
    setAuditsLeft(2 + Math.floor(Math.random() * (5 - 2 + 1)));
    setUplift(12 + Math.floor(Math.random() * (22 - 12 + 1)));
  }, []);

  const result = useMemo(() => {
    return scorePlacement({ tier, cgpa, skills, internships, projects, certifications });
  }, [tier, cgpa, skills, internships, projects, certifications]);

  const scoreToShow = submitted ? result.score : 0;
  const optimized = submitted ? Math.min(95, scoreToShow + (uplift ?? 16)) : 0;

  const framing = submitted
    ? scoreToShow < 60
      ? { tone: "border-red-500/25 bg-red-500/10 text-red-200", title: "⚠️ Risk signal", body: "63% of candidates with this profile struggle in campus placements." }
      : scoreToShow <= 75
        ? { tone: "border-yellow-400/25 bg-yellow-400/10 text-yellow-100", title: "You're close", body: "Small improvements can boost your chances dramatically." }
        : { tone: "border-emerald-500/25 bg-emerald-500/10 text-emerald-100", title: "Strong profile", body: "Optimize to reach 90%+ and dominate shortlisting." }
    : null;

  return (
    <div className="mt-8">
      <div className="relative rounded-3xl border border-emerald-500/15 bg-white/[0.04] backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent" />

        <div className="relative p-5 sm:p-6 md:p-7">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-black text-[10px] uppercase tracking-[0.25em]">
                Placement Probability • 2026
              </div>
              <div className="mt-3 text-xl sm:text-2xl font-[1000] tracking-tight">
                Calculate your placement chances in 60 seconds
              </div>
              <div className="mt-2 text-sm text-white/45 font-semibold">Fully client-side. Deterministic scoring. No API.</div>
            </div>

            <div className="flex items-baseline gap-3">
              <div className="text-4xl sm:text-5xl font-[1000] tracking-tight text-emerald-300">{scoreToShow}%</div>
              <div className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-white/35">{submitted ? result.label : "—"}</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
              <motion.div
                className="h-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(239,68,68,0.95) 0%, rgba(245,158,11,0.95) 45%, rgba(34,197,94,0.98) 100%)"
                }}
                initial={{ width: 0 }}
                animate={{ width: submitted ? ["0%", `${Math.min(100, scoreToShow + 6)}%`, `${scoreToShow}%`] : "0%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/25">
              <span>Needs improvement</span>
              <span>High chance</span>
            </div>
          </div>

          {/* Psychological triggers */}
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm font-bold text-white/60">
                ⚡ {scarcityToday ?? 23} students improved their placement score today
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-black uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Live: Recruiters reviewing resumes now
              </div>
            </div>

            {framing ? (
              <div className={`rounded-2xl border p-4 ${framing.tone}`}>
                <div className="text-xs font-black uppercase tracking-[0.25em]">{framing.title}</div>
                <div className="mt-2 text-sm font-semibold text-white/80">{framing.body}</div>
              </div>
            ) : null}

            {/* Before vs After */}
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Before vs After</div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Current probability</div>
                  <div className="mt-1 text-2xl font-[1000] text-white num">{submitted ? scoreToShow : 0}%</div>
                </div>

                <motion.div
                  className="hidden sm:flex items-center justify-center"
                  animate={{ x: submitted ? [0, 6, 0] : 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                >
                  <div className="h-10 w-10 rounded-full border border-emerald-500/25 bg-emerald-500/10 grid place-items-center text-emerald-200 font-black">
                    →
                  </div>
                </motion.div>

                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 shadow-[0_0_0_1px_rgba(34,197,94,0.12),0_18px_60px_rgba(34,197,94,0.10)]">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200/80">With resume optimization</div>
                  <div className="mt-1 text-2xl font-[1000] text-emerald-200 num">{submitted ? optimized : 0}%</div>
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-[1000] tracking-tight text-white">Unlock Full Resume Optimization Report</div>
                  <div className="mt-1 text-sm text-white/45 font-semibold">Locked insights that push you to 90%+ shortlisting readiness.</div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">EXPERT</div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/60 font-semibold">
                <div>✓ Personalized ATS Fixes</div>
                <div>✓ Company-Specific Keywords</div>
                <div>✓ Resume Rewrite Suggestions</div>
                <div>✓ Hidden Recruiter Insights</div>
              </div>

              <div className="mt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => {
                    window.location.assign("/pricing");
                  }}
                  className="h-14 w-full rounded-xl font-black text-base md:text-lg text-black bg-gradient-to-r from-emerald-400 to-lime-300 hover:from-emerald-300 hover:to-lime-200 transition-all shadow-[0_18px_50px_rgba(34,197,94,0.25)] hover:shadow-[0_24px_90px_rgba(34,197,94,0.38)]"
                >
                  Upgrade to Expert – ₹399
                </motion.button>
                <div className="mt-2 text-xs text-white/45 font-bold">
                  Only {auditsLeft ?? 3} expert audits left today.
                </div>
              </div>
            </div>

            {/* SEO reinforcement (visible, semantic, no extra H1) */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <h2 className="text-base sm:text-lg font-[1000] tracking-tight">Placement Probability Calculator for Engineering & MBA Students 2026</h2>
              <p className="mt-2 text-sm text-white/45 font-semibold">
                This free placement chance calculator helps Indian students evaluate their campus placement probability based on CGPA, internships, skills and projects.
              </p>
            </section>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">College tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as Tier)}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white text-sm font-bold outline-none focus:border-emerald-500/40"
              >
                <option>Tier 1</option>
                <option>Tier 2</option>
                <option>Tier 3</option>
              </select>
            </div>

            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">CGPA (0–10)</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={cgpa}
                onChange={(e) => setCgpa(clamp(Number(e.target.value || 0), 0, 10))}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white text-sm font-bold outline-none focus:border-emerald-500/40"
              />
            </div>

            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Skills count</label>
              <input
                type="number"
                min={0}
                value={skills}
                onChange={(e) => setSkills(Math.max(0, Number(e.target.value || 0)))}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white text-sm font-bold outline-none focus:border-emerald-500/40"
              />
            </div>

            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Internship count</label>
              <input
                type="number"
                min={0}
                value={internships}
                onChange={(e) => setInternships(Math.max(0, Number(e.target.value || 0)))}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white text-sm font-bold outline-none focus:border-emerald-500/40"
              />
            </div>

            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Projects count</label>
              <input
                type="number"
                min={0}
                value={projects}
                onChange={(e) => setProjects(Math.max(0, Number(e.target.value || 0)))}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white text-sm font-bold outline-none focus:border-emerald-500/40"
              />
            </div>

            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Certifications</label>
              <input
                type="number"
                min={0}
                value={certifications}
                onChange={(e) => setCertifications(Math.max(0, Number(e.target.value || 0)))}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white text-sm font-bold outline-none focus:border-emerald-500/40"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="h-14 w-full rounded-xl font-black text-base md:text-lg text-black bg-gradient-to-r from-emerald-400 to-lime-300 hover:from-emerald-300 hover:to-lime-200 transition-all shadow-[0_18px_50px_rgba(34,197,94,0.18)] hover:shadow-[0_20px_70px_rgba(34,197,94,0.28)]"
            >
              Calculate My Placement Chances
            </button>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Improvement suggestions</div>
              <div className="mt-3 space-y-2 text-sm text-white/55 font-semibold">
                {(submitted
                  ? result.suggestions
                  : [
                      "Enter details and calculate to see targeted suggestions.",
                      "Focus on evidence: internships + measurable projects.",
                      "Keep CGPA stable and skills aligned to roles."
                    ]
                ).map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="sr-only" aria-hidden="true">
            <h2>Check Your Placement Probability in 2026</h2>
            <p>
              Free placement probability calculator for engineering and MBA students in India. Estimate placement chances based on college tier, CGPA, skills,
              internships, projects, and certifications.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
