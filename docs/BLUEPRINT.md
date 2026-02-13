# PlacementScore.online - Product Blueprint

## 1. Core Vision
AI-powered ATS Resume Analyzer + Premium Resume Rewriter targeted at Indian students and freshers.

## 2. Monetization (INR)
- **Base (₹99):** ATS Score (60-65 max), basic feedback, 24hr storage.
- **Growth (₹199):** Detailed gaps, recruiter readability, missing skills, 7-day storage.
- **Expert (₹399):** AI Rewrite, ATS PDF download, quantified metrics, industry tailoring.

## 3. Tech Stack
- **Frontend:** Next.js 14 (App Router), TailwindCSS, Framer Motion.
- **Backend:** Next.js API Routes (Node.js).
- **AI:** OpenAI GPT-4o-mini (Analysis, Rewrite, Keyword Extraction).
- **DB/Auth:** Supabase (PostgreSQL + Auth).
- **Payment:** Razorpay.
- **Parsing:** `pdf-parse`.

## 4. Database Schema (Supabase)
- `users`: id, email, created_at.
- `resumes`: id, user_id, original_text, score, plan_id, analysis_json, created_at.
- `payments`: id, user_id, plan_id, razorpay_id, status, created_at.

## 5. Scoring Logic
`score = (keywords * 0.25) + (formatting * 0.20) + (verbs * 0.20) + (metrics * 0.20) + (structure * 0.15)`
*Note: Cap free score at 65.*
