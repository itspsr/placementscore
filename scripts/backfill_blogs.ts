
import { createClient } from '@supabase/supabase-js';
import { generateBlogArticle } from '../src/lib/blogEngine'; // Assuming I can import this, or I'll reimplement the call
// Since I can't easily import from src in a standalone script without proper tsconfig paths in this env,
// I will replicate the generation logic or use the API if possible.
// Using API is safer/easier if I have the SECRET.
// I'll use the local logic copy for the script to avoid rate limits/timeouts on the API.

// ... wait, I need the Gemini Key.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TOPICS = [
  "How to Beat the ATS Resume Scanner in 2026",
  "Top 10 Resume Keywords for Software Engineers",
  "Resume Format Guide for Freshers 2026",
  "Common Resume Mistakes That Get You Rejected",
  "How to Write a Resume Summary That Stands Out",
  "Listing Projects on Your Resume: The Right Way",
  "Education Section on Resume: Do Marks Matter?",
  "Skills Section: Hard Skills vs Soft Skills",
  "How to Optimize Your LinkedIn Profile for Recruiters",
  "Cover Letter Guide for 2026 Internships",
  "TCS NQT Resume Preparation Guide",
  "Infosys Certification Exam Resume Tips",
  "Accenture Hiring Process and Resume Hacks",
  "Google Internship Resume Examples",
  "Amazon SDE Resume Keywords",
  "Microsoft Resume Tips for Freshers",
  "Action Verbs to Use in Your Resume",
  "How to Quantify Your Achievements on a Resume",
  "Resume Font and Layout Best Practices 2026",
  "One Page vs Two Page Resume: What is Better?"
];

async function generateBackfill() {
  const startDate = new Date('2026-02-01T10:00:00Z');
  const today = new Date();
  
  let currentDate = startDate;
  let topicIndex = 0;

  while (currentDate <= today) {
    if (topicIndex >= TOPICS.length) topicIndex = 0; // Cycle topics if needed
    const topic = TOPICS[topicIndex];
    
    console.log(`Generating for ${currentDate.toISOString().split('T')[0]}: ${topic}`);

    try {
      // Re-implementing simplified generation call here to avoid import issues
      const prompt = `
        Write a 1500-word SEO blog on "${topic}".
        Target: Indian Engineering Students.
        Return JSON: { "title": "string", "slug": "string", "meta_description": "string", "content": "markdown", "keywords": ["k1", "k2"], "faq_schema": {} }
      `;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 2000, temperature: 0.7 }
          })
        }
      );

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const content = JSON.parse(jsonStr);
        
        // Ensure slug is unique-ish
        const slug = content.slug + '-' + currentDate.getTime();

        const { error } = await supabase.from('blogs').insert({
          title: content.title,
          slug: slug,
          meta_description: content.meta_description,
          content: content.content,
          keywords: content.keywords,
          cluster: "Resume Tips",
          faq_schema: content.faq_schema,
          created_at: currentDate.toISOString(),
          published: true,
          source: "ai-backfill"
        });

        if (error) console.error("DB Error:", error);
        else console.log("Saved:", slug);
      } else {
        console.error("Gemini Error: No text returned");
      }

    } catch (e) {
      console.error("Error generating:", e);
    }

    // Advance date by 1 day
    currentDate.setDate(currentDate.getDate() + 1);
    topicIndex++;
    
    // Rate limit
    await new Promise(r => setTimeout(r, 2000));
  }
}

generateBackfill();
