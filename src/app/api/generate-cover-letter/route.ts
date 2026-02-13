import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { role, company, experience } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI configuration missing. Please add your API key to environment variables." }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    return NextResponse.json({
      success: true,
      coverLetter: fullText,
      role,
      company
    });

  } catch (error) {
    console.error("Cover Letter Error:", error);
    return NextResponse.json({ error: "Failed to generate cover letter. Please try again later." }, { status: 500 });
  }
}
