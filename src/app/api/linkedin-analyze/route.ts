import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content || content.length < 50) {
      return NextResponse.json({ error: "Profile content too short for meaningful analysis." }, { status: 400 });
    }

    const lower = content.toLowerCase();
    
    // Heuristic Logic
    let score = 45;
    const suggestions = [];

    // Check Headline
    if (content.split('\n')[0]?.length > 30) score += 10;
    else suggestions.push("Extend your headline with specific job titles and core technologies.");

    // Check About Keywords
    const keywords = ["delivered", "managed", "spearheaded", "results", "increased", "impact"];
    const foundKeywords = keywords.filter(k => lower.includes(k));
    score += foundKeywords.length * 5;
    
    if (foundKeywords.length < 3) suggestions.push("Use more 'Impact Verbs' like Spearheaded, Optimized, and Scaled in your summary.");

    // Check Structure
    if (lower.includes("experience") && lower.includes("education")) score += 15;
    else suggestions.push("Ensure section headers are clear and distinct for recruiter scanning.");

    // Recruiter Visibility (Metrics)
    if (/\d+%/g.test(content) || /\d+x/g.test(content)) score += 10;
    else suggestions.push("Quantify your achievements with percentages or growth metrics (e.g. 30% increase).");

    if (score < 60) suggestions.push("Add a specific 'Technical Skills' section with modern tech stack keywords.");

    return NextResponse.json({
      success: true,
      score: Math.min(score, 94),
      suggestions: suggestions.slice(0, 5),
      contentLength: content.length
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze LinkedIn profile" }, { status: 500 });
  }
}
