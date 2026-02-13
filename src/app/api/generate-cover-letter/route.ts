import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { role, company, experience, tier } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI configuration missing" }, { status: 500 });
    }

    const prompt = `Write a highly professional and ATS-friendly cover letter for a ${role} position at ${company}. 
    Experience Level: ${experience}. 
    Focus on quantified achievements and technical alignment. 
    Keep it under 300 words.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.7,
    });

    const fullText = completion.choices[0].message.content || "";

    // Payment Logic for Preview
    // Free (tier === null): Blur first 3 paragraphs.
    // We return full text and handle blurring in UI based on tier
    
    return NextResponse.json({
      success: true,
      coverLetter: fullText,
      role,
      company
    });

  } catch (error) {
    console.error("Cover Letter Error:", error);
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
  }
}
