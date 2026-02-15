import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const CLUSTERS = [
  "ATS Score Guide",
  "Campus Placement Preparation",
  "Resume Mistakes",
  "Company Specific Resume Guides",
  "Resume Format Templates"
];

const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

export async function GET(req: Request) {
  // Protect with Vercel Cron Secret
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingBlogs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    
    // Check if we have the API key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
      console.log("No GEMINI_API_KEY found, running in Mock Mode for Local Server");
      
      const cluster = CLUSTERS[existingBlogs.length % CLUSTERS.length];
      const mockBlog = {
        id: existingBlogs.length + 1,
        title: `Mock Authority Guide: ${cluster} for 2026`,
        slug: `mock-guide-${cluster.toLowerCase().replace(/ /g, '-')}-${Date.now()}`,
        metaDescription: `This is a mock generated authority guide for ${cluster}.`,
        cluster: cluster,
        createdAt: new Date().toISOString(),
        content: `# Mock Authority Guide: ${cluster}\n\nThis is a mock generated blog post because the GEMINI_API_KEY is currently missing in the environment. \n\n## Section 1\nContent would go here in a real generation.\n\n## FAQ\n1. Is this real? No, it is a mock.`
      };

      existingBlogs.push(mockBlog);
      fs.writeFileSync(DATA_PATH, JSON.stringify(existingBlogs, null, 2));
      return NextResponse.json({ success: true, slug: mockBlog.slug, mode: "mock" });
    }

    const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-flash-latest"];
    let model;
    let success = false;
    
    for (const modelName of modelsToTry) {
        try {
            model = genAI.getGenerativeModel({ model: modelName });
            // Test if model works
            await model.generateContent("test");
            success = true;
            console.log(`Using model: ${modelName}`);
            break;
        } catch (e) {
            console.log(`Model ${modelName} failed, trying next...`);
        }
    }

    if (!success) throw new Error("All Gemini models failed. Check your API key and permissions.");


    const cluster = CLUSTERS[existingBlogs.length % CLUSTERS.length];
    
    const prompt = `
      You are a senior SEO SaaS architect. Build a 2000-word authority blog for 'placementscore.online'.
      
      Rules:
      - Topic Cluster: ${cluster}
      - Focus: Indian college students (IIT, NIT, VIT, etc.)
      - Target Year: 2026/2027
      - Style: Professional, data-driven, encouraging.
      
      Requirements:
      1. Generate a unique long-tail keyword (min 4 words, low competition, Indian focus).
      2. Title: SEO Optimized (max 60 chars).
      3. Description: High CTR (max 155 chars).
      4. Content: 1500-2000 words in high-quality Markdown.
      5. Structure: H1, multiple H2s and H3s.
      6. Include a FAQ section with 5 questions.
      7. Include internal links placeholder like [LINK:HOME], [LINK:PRICING].
      
      Return as valid JSON:
      {
        "title": "...",
        "slug": "...",
        "metaDescription": "...",
        "content": "...",
        "keyword": "...",
        "cluster": "${cluster}"
      }
      JSON only, no markdown wrappers.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawJson = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const blogData = JSON.parse(rawJson);

    // Prevent duplicate slugs
    if (existingBlogs.find((b: any) => b.slug === blogData.slug)) {
      blogData.slug += `-${Date.now()}`;
    }

    const newBlog = {
      ...blogData,
      createdAt: new Date().toISOString(),
      id: existingBlogs.length + 1
    };

    existingBlogs.push(newBlog);
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingBlogs, null, 2));

    return NextResponse.json({ success: true, slug: newBlog.slug });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
