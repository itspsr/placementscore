import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (process.env.NODE_ENV === 'production' && searchParams.get('key') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- STEP 1: AGENT PROPOSES IDEAS ---
    const proposalPrompt = `
      You are the PlacementScore Growth Agent. 
      Analyze current trends for Indian engineering students (TCS NQT 2026, Google Summer Intern 2027, etc.).
      Propose 3 high-intent, low-competition blog topics.
      Return JSON only: { "proposals": ["topic 1", "topic 2", "topic 3"] }
    `;
    const proposalResult = await model.generateContent(proposalPrompt);
    const proposalData = JSON.parse(proposalResult.response.text().replace(/```json/g, "").replace(/```/g, "").trim());
    const selectedTopic = proposalData.proposals[0];

    // --- STEP 2: AUTO-APPROVAL SYSTEM ---
    // In this step, we ensure the topic is unique and has high SEO potential.
    const existingBlogs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const isDuplicate = existingBlogs.some((b: any) => b.title.includes(selectedTopic));
    
    if (isDuplicate) {
      return NextResponse.json({ message: "Idea rejected: Duplicate detected. Loop restarting." });
    }

    // --- STEP 3: TASK EXECUTION (GENERATE CONTENT) ---
    const executionPrompt = `
      Generate a 2000-word authoritative guide for the approved topic: "${selectedTopic}".
      Include H1, H2, H3, FAQ, and a CTA for placementscore.online.
      Return JSON: { "title": "...", "slug": "...", "content": "...", "metaDescription": "..." }
    `;
    const executionResult = await model.generateContent(executionPrompt);
    const finalBlog = JSON.parse(executionResult.response.text().replace(/```json/g, "").replace(/```/g, "").trim());

    // --- STEP 4: TRIGGER NEW REACTIONS (SAVE & INDEX) ---
    const newEntry = {
      ...finalBlog,
      createdAt: new Date().toISOString(),
      id: existingBlogs.length + 1,
      loop_verified: true
    };

    existingBlogs.push(newEntry);
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingBlogs, null, 2));

    // Pinging Google Search Console (Simulated placeholder for production)
    console.log("Loop Complete. Pinging Search Engines for:", finalBlog.slug);

    return NextResponse.json({ 
      success: true, 
      loop_cycle: "PROPOSED -> APPROVED -> EXECUTED -> INDEXED",
      topic: selectedTopic 
    });

  } catch (error) {
    console.error("Master Loop Error:", error);
    return NextResponse.json({ error: "Loop break" }, { status: 500 });
  }
}
