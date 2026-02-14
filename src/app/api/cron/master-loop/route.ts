import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

// Initialize Supabase only if keys exist
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let existingBlogs = [];
    if (supabase) {
        const { data } = await supabase.from('blogs').select('*');
        existingBlogs = data || [];
    } else {
        existingBlogs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
        const mockTopic = "Mock AI Strategy: How to Automate Placement Prep in 2026";
        const mockEntry = {
            title: mockTopic,
            slug: `mock-loop-${Date.now()}`,
            metaDescription: "Mock meta description for automated loop.",
            content: `# ${mockTopic}\n\nThis is a mock generated blog post via the Master AI Loop.`,
            cluster: "Automated Placement Guide",
            createdAt: new Date().toISOString(),
            source: "Mock Self-Improving Loop"
        };
        
        if (supabase) {
            await supabase.from('blogs').insert([mockEntry]);
        } else {
            existingBlogs.push(mockEntry);
            fs.writeFileSync(DATA_PATH, JSON.stringify(existingBlogs, null, 2));
        }
        return NextResponse.json({ success: true, status: "MOCKED", published_slug: mockEntry.slug });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const proposalPrompt = `
      You are a senior SEO Growth Agent for 'placementscore.online'. 
      Analyze current Indian recruitment trends (TCS NQT 2026, etc.).
      Propose a unique topic. Return JSON: { "topic": "...", "keyword": "..." }
    `;
    const proposalResult = await model.generateContent(proposalPrompt);
    const proposalData = JSON.parse(proposalResult.response.text().replace(/```json/g, "").replace(/```/g, "").trim());
    const selectedTopic = proposalData.topic;

    const isDuplicate = existingBlogs.some((b: any) => b.title.toLowerCase().includes(selectedTopic.toLowerCase()));
    if (isDuplicate) return NextResponse.json({ message: "Duplicate idea rejected." });

    const executionPrompt = `Write 2000-word SEO blog for "${selectedTopic}". Return JSON: { "title": "...", "slug": "...", "metaDescription": "...", "content": "...", "cluster": "..." }`;
    const executionResult = await model.generateContent(executionPrompt);
    const finalBlog = JSON.parse(executionResult.response.text().replace(/```json/g, "").replace(/```/g, "").trim());

    const newEntry = {
      ...finalBlog,
      createdAt: new Date().toISOString(),
      source: "Self-Improving AI Loop"
    };

    if (supabase) {
        await supabase.from('blogs').insert([newEntry]);
    } else {
        newEntry.id = existingBlogs.length + 1;
        existingBlogs.push(newEntry);
        fs.writeFileSync(DATA_PATH, JSON.stringify(existingBlogs, null, 2));
    }

    return NextResponse.json({ success: true, status: "EXECUTED", published_slug: finalBlog.slug });

  } catch (error) {
    console.error("Master Loop Failure:", error);
    return NextResponse.json({ error: "Loop break: " + error.message }, { status: 500 });
  }
}
