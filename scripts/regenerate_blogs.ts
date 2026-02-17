
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error("Error: Missing credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const WEAK_BLOGS = [
  { id: "cb657613-d61b-4595-82dc-cadf49cb5072", topic: "ATS Resume Tips 2026" },
  { id: "df81366d-52fd-4b5d-be9b-a21cc848cc38", topic: "ATS Resume Tips 2026" },
  { id: "78747d7c-b9b1-499e-8c4a-f35aefb06623", topic: "Resume Keywords for TCS" },
  { id: "39df6c8a-d5bb-4aae-a3e6-7e1bc3cd66ab", topic: "Resume Keywords for TCS" }
];

async function generateContent(topic: string) {
  const prompt = `
    Write a 1500-word SEO optimized blog post about "${topic}".
    Target Audience: Indian Engineering Students (Tier 2/3 colleges).
    Tone: Authoritative, Mentorship, Actionable.
    Structure:
    - H1 Title (Catchy, High CTR)
    - Meta Description (Max 155 chars)
    - Introduction (Hook + Problem Statement)
    - 4-5 Detailed Sections (H2) with H3 subsections
    - Bullet points for readability
    - Internal Linking Placeholders like [LINK: /resume-builder] or [LINK: /ats-score]
    - Conclusion
    - FAQ Section (5 Questions with Schema valid JSON structure in a separate field, but include text here too)
    
    Output JSON format ONLY:
    {
      "title": "string",
      "meta_description": "string",
      "content": "markdown string",
      "keywords": ["array", "of", "strings"],
      "faq_schema": { "type": "FAQPage", "mainEntity": [...] }
    }
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
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
  
  if (!text) return null;
  
  try {
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse Gemini JSON", e);
    return null;
  }
}

async function regenerate() {
  console.log("Starting regeneration...");
  
  for (const blog of WEAK_BLOGS) {
    console.log(`Regenerating: ${blog.topic} (${blog.id})`);
    const content = await generateContent(blog.topic);
    
    if (content) {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: content.title,
          meta_description: content.meta_description,
          content: content.content,
          keywords: content.keywords,
          faq_schema: content.faq_schema,
          updated_at: new Date().toISOString()
        })
        .eq('id', blog.id);

      if (error) console.error(`Update failed for ${blog.id}:`, error);
      else console.log(`Success: ${blog.id}`);
    } else {
      console.error(`Generation failed for ${blog.id}`);
    }
    
    // Rate limit pause
    await new Promise(r => setTimeout(r, 2000));
  }
}

regenerate();
