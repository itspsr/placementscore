import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // SECURE CRON ACCESS
  if (process.env.NODE_ENV === 'production' && searchParams.get('key') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- PHASE 1: AGENT PROPOSES IDEAS ---
    // AI analyzes current trends for Indian graduates in 2026/2027
    const proposalPrompt = `
      You are a senior SEO Growth Agent for 'placementscore.online'. 
      Analyze the current recruitment trends for Indian college students (TCS NQT 2026, Google India Internships, Resume Keywords for SDE-1).
      Propose a high-intent, low-competition blog topic that will rank on Google India.
      Return JSON only: { "topic": "Proposed Topic", "keyword": "main keyword" }
    `;
    const proposalResult = await model.generateContent(proposalPrompt);
    const proposalData = JSON.parse(proposalResult.response.text().replace(/```json/g, "").replace(/```/g, "").trim());
    const selectedTopic = proposalData.topic;

    // --- PHASE 2: AUTO-APPROVAL SYSTEM ---
    // Check against existing database to ensure no duplicates
    const existingBlogs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const isDuplicate = existingBlogs.some((b: any) => b.title.toLowerCase().includes(selectedTopic.toLowerCase()));
    
    if (isDuplicate) {
      return NextResponse.json({ message: "Loop Cycle: Idea rejected as duplicate. Restarting tomorrow." });
    }

    // --- PHASE 3: TASK EXECUTION (CONTENT GENERATION) ---
    const executionPrompt = `
      Write a 2000-word authoritative SEO blog post for the approved topic: "${selectedTopic}".
      
      Requirements:
      - Title: Max 60 chars, include keyword "${proposalData.keyword}"
      - Meta Description: Max 155 chars, high CTR for Indian students.
      - Style: Deeply technical yet encouraging.
      - Structure: H1, at least 4 H2s, and multiple H3s.
      - Use the 'XYZ formula' for resume examples.
      - Include a FAQ section with 5 questions.
      - Include internal links placeholders like [HOME] and [PRICING].

      Return JSON only:
      {
        "title": "...",
        "slug": "...",
        "metaDescription": "...",
        "content": "...",
        "cluster": "Automated Placement Guide"
      }
    `;
    const executionResult = await model.generateContent(executionPrompt);
    const finalBlog = JSON.parse(executionResult.response.text().replace(/```json/g, "").replace(/```/g, "").trim());

    // --- PHASE 4: TRIGGER NEW REACTIONS (SAVE & LOG) ---
    const newEntry = {
      ...finalBlog,
      id: existingBlogs.length + 1,
      createdAt: new Date().toISOString(),
      source: "Self-Improving AI Loop"
    };

    existingBlogs.push(newEntry);
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingBlogs, null, 2));

    console.log("Master Loop Complete: Blog published successfully.", finalBlog.slug);

    return NextResponse.json({ 
      success: true, 
      status: "EXECUTED",
      published_slug: finalBlog.slug,
      loop_verified: true
    });

  } catch (error) {
    console.error("Master Loop Failure:", error);
    return NextResponse.json({ error: "Loop break: " + error }, { status: 500 });
  }
}
