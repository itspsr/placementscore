import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

export async function GET(req: Request) {
  // SECURE CRON ACCESS
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingBlogs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

    // Mock Mode Fallback
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
        console.log("No GEMINI_API_KEY found, running Master Loop in Mock Mode");
        const mockTopic = "Mock AI Strategy: How to Automate Placement Prep in 2026";
        const mockEntry = {
            id: existingBlogs.length + 1,
            title: mockTopic,
            slug: `mock-loop-${Date.now()}`,
            metaDescription: "Mock meta description for automated loop.",
            content: `# ${mockTopic}\n\nThis is a mock generated blog post via the Master AI Loop.`,
            cluster: "Automated Placement Guide",
            createdAt: new Date().toISOString(),
            source: "Mock Self-Improving Loop"
        };
        existingBlogs.push(mockEntry);
        fs.writeFileSync(DATA_PATH, JSON.stringify(existingBlogs, null, 2));
        return NextResponse.json({ success: true, status: "MOCKED", published_slug: mockEntry.slug });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
