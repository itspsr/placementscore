import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Extract Text from PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const data = await pdf(buffer);
    const text = data.text || "";
    const lowerText = text.toLowerCase();

    if (!text.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: "Empty Document. The PDF appears to be a scanned image. Please upload a text-based PDF for analysis."
      }, { status: 422 });
    }

    // 2. Resume Validation Check (Intelligent Broadening)
    // Core Required Markers (Expanded for common variations)
    const hasSkills = lowerText.includes("skills") || lowerText.includes("tech stack") || lowerText.includes("expertise") || lowerText.includes("competencies") || lowerText.includes("knowledge");
    const hasExperience = lowerText.includes("experience") || lowerText.includes("work history") || lowerText.includes("employment") || lowerText.includes("internship") || lowerText.includes("background");
    const hasEducation = lowerText.includes("education") || lowerText.includes("academic") || lowerText.includes("university") || lowerText.includes("college") || lowerText.includes("qualification");
    
    // Job Title Detection (Broadened)
    const commonTitles = ["engineer", "developer", "manager", "analyst", "intern", "associate", "specialist", "lead", "architect", "consultant", "trainee", "student"];
    const hasPotentialJobTitle = commonTitles.some(title => lowerText.includes(title));

    // Secondary indicators
    const secondaryIndicators = ["projects", "summary", "objective", "certifications", "achievements", "contact", "linkedin", "github", "address", "phone"];
    const foundSecondary = secondaryIndicators.filter(ind => lowerText.includes(ind));

    // Valid Resume logic: Text density check + markers
    const isHighDensity = text.trim().length > 600;
    const hasMajorSections = (hasSkills || hasExperience || hasEducation);
    
    // Condition: Must have at least ONE major section AND (Significant density OR 3 indicators)
    const isValidProfessionalResume = hasMajorSections && (isHighDensity || foundSecondary.length >= 3 || hasPotentialJobTitle);
    
    if (!isValidProfessionalResume) {
      return NextResponse.json({ 
        success: false, 
        error: "Document Verification Failed. We only analyze professional resumes. Please ensure your PDF contains clear sections for Skills, Experience, or Education. Receipts and images are not supported."
      }, { status: 422 });
    }

    // 3. Local "AI" Logic (Heuristic Analysis)
    // Stricter keyword list for more accurate scoring
    const keywords = ["react", "next.js", "python", "java", "javascript", "sql", "aws", "docker", "c++", "internship", "node.js", "git", "cloud", "agile", "development", "data", "analysis", "leadership", "communication"];
    const powerVerbs = ["managed", "developed", "led", "optimized", "increased", "implemented", "designed", "created", "spearheaded", "engineered", "collaborated"];
    
    let keywordMatches = keywords.filter(k => lowerText.includes(k));
    let verbMatches = powerVerbs.filter(v => lowerText.includes(v));
    let hasMetrics = (text.match(/\d+%/g) || text.match(/\$\d+/g) || text.match(/\d+\s?x/gi)) ? 1 : 0;
    
    // 4. Dynamic Scoring Calculation (40 - 78 range for raw)
    let kwScore = (keywordMatches.length / keywords.length) * 100;
    let verbScore = (verbMatches.length / powerVerbs.length) * 100;
    let metricScore = hasMetrics ? 100 : 30;
    let structScore = text.length > 800 ? 100 : 60;
    let sectionScore = ((foundSecondary.length + (hasSkills ? 1 : 0) + (hasExperience ? 1 : 0) + (hasEducation ? 1 : 0)) / 10) * 100;

    let rawScore = Math.floor(
      (kwScore * 0.30) + 
      (verbScore * 0.20) + 
      (metricScore * 0.20) + 
      (structScore * 0.15) +
      (sectionScore * 0.15)
    );

    // Dynamic Range Mapping: 40 (Low) to 78 (High)
    let finalScore = Math.max(40, Math.min(78, rawScore));

    const strengths = [];
    if (verbMatches.length > 4) strengths.push("Exceptional use of professional action verbs.");
    else if (verbMatches.length > 1) strengths.push("Solid use of results-oriented language.");
    
    if (text.length > 800) strengths.push("Strong detail-to-length ratio detected.");
    if (keywordMatches.length > 4) strengths.push("High density of critical industry keywords.");
    
    const weaknesses = [];
    if (!hasMetrics) weaknesses.push("Missing impact metrics (ROI, percentages, growth).");
    if (keywordMatches.length < 5) weaknesses.push("Core technical keywords are underrepresented.");
    if (foundSecondary.length < 3) weaknesses.push("Section hierarchy needs standardization.");

    return NextResponse.json({ 
      success: true, 
      analysis: {
        score: finalScore,
        strengths,
        weaknesses,
        keyword_gaps: keywords.filter(k => !keywordMatches.includes(k)).slice(0, 5),
        formatting_issues: ["Standardize date formats", "Avoid complex multi-column layouts"],
        rewrite_suggestions: ["Quantify achievements using the XYZ formula."]
      }
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Critical Parsing Error: The PDF structure is too complex or encrypted. Please use a standard text-based PDF."
    }, { status: 500 });
  }
}
