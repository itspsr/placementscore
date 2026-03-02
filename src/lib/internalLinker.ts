export const KEYWORD_LINKS: Record<string, string> = {
  "ATS score": "/",
  "ATS resume": "/ats-resume-score-india",
  "placement resume": "/placement-resume-checker",
  "resume checker": "/placement-resume-checker",
  "ATS optimization": "/ai-resume-optimization-india",
  "resume score": "/ats-score-calculator",
  "TCS": "/company/tcs-resume-score",
  "Infosys": "/company/infosys-resume-score",
  "Wipro": "/company/wipro-resume-score",
  "Accenture": "/company/accenture-resume-score",
  "Cognizant": "/company/cognizant-resume-score",
  "Software Engineer": "/role/software-engineer-resume-score",
  "Data Analyst": "/role/data-analyst-resume-score",
  "Business Analyst": "/role/business-analyst-resume-score",
  "Cloud Engineer": "/role/cloud-engineer-resume-score",
  "IIT Delhi": "/college/iit-delhi-placement-resume",
  "NIT Trichy": "/college/nit-trichy-resume-tips",
  "VIT Vellore": "/college/vit-vellore-placement-resume",
  "SRM University": "/college/srm-university-resume-tips",
  "leaderboard": "/resume-score-leaderboard",
  "benchmark report": "/placement-benchmark-report-2026",
  "why placementscore": "/why-placementscore"
};

export function applyInternalLinks(content: string): string {
  let linkCount = 0;
  const maxLinks = 5;
  const usedKeywords = new Set<string>();

  // Sort keywords by length descending to match longer phrases first
  const keywords = Object.keys(KEYWORD_LINKS).sort((a, b) => b.length - a.length);

  let modifiedContent = content;

  for (const keyword of keywords) {
    if (linkCount >= maxLinks) break;
    if (usedKeywords.has(keyword.toLowerCase())) continue;

    // Regex to find keyword:
    // - Not inside a link [text](url)
    // - Not inside an HTML tag <...>
    // - Word boundaries
    // Simplified approach: use a regex that avoids matches within brackets or tags
    // This is hard to do perfectly with one regex in JS without lookbehind issues in some envs
    // We'll use a safe approach: split by existing links/tags, replace in text nodes
    
    const regex = new RegExp(`(?<!\\[|\\/|\\w)${keyword}(?!\\w|\\d|\\/|\\d|\\w|\\])`, "i");
    
    // Check if the keyword exists in the content and is not already part of a link
    // We use a simpler check for this "zero AI / maintenance" requirement
    const searchRegex = new RegExp(`\\b${keyword}\\b`, "i");
    const match = modifiedContent.match(searchRegex);

    if (match) {
      // Basic check to avoid replacing inside markdown links or images
      // Finding the index and checking surrounding context
      const index = match.index!;
      const before = modifiedContent.slice(0, index);
      const after = modifiedContent.slice(index + keyword.length);

      // Avoid if inside []() or <>
      const openBrackets = (before.match(/\[/g) || []).length;
      const closedBrackets = (before.match(/\]/g) || []).length;
      const openParens = (before.match(/\(/g) || []).length;
      const closedParens = (before.match(/\)/g) || []).length;
      const openTags = (before.match(/</g) || []).length;
      const closedTags = (before.match(/>/g) || []).length;

      if (openBrackets === closedBrackets && openParens === closedParens && openTags === closedTags) {
        const url = KEYWORD_LINKS[keyword];
        const replacement = `[${match[0]}](${url})`;
        
        modifiedContent = before + replacement + after;
        linkCount++;
        usedKeywords.add(keyword.toLowerCase());
      }
    }
  }

  return modifiedContent;
}
