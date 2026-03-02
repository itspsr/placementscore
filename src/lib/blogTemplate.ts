import { applyInternalLinks } from './internalLinker';
import { CLUSTERS } from './seoClusters';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateBlog(topic: string, date: Date) {
  const title = `${capitalize(topic)} 2026 (Free ATS Guide for India)`;
  const dateStr = date.toISOString().split('T')[0];
  const slug = slugify(topic + "-" + dateStr);

  // Assign to cluster
  let cluster = "Resume Mistakes & Tips";
  for (const [key, value] of Object.entries(CLUSTERS)) {
    if (value.keywords.some(kw => topic.toLowerCase().includes(kw.toLowerCase()))) {
      cluster = value.name;
      break;
    }
  }

  const sections = [
    {
      h2: `Understanding ${capitalize(topic)}`,
      content: `In the competitive landscape of 2026 Indian campus placements, ${topic} has become a critical factor for success. Thousands of students from top institutions like IITs, NITs, and VIT are competing for a limited number of roles in MNCs like TCS, Infosys, and Wipro. To stand out, you need more than just a high CGPA; you need a resume that is optimized for both Applicant Tracking Systems (ATS) and human recruiters. This guide provides a comprehensive roadmap for ${topic}, ensuring your resume gets the attention it deserves.`
    },
    {
      h2: `The Role of ATS in ${capitalize(topic)}`,
      content: `Most major companies in India use sophisticated ATS software to filter through millions of applications. Whether you are applying for a Software Engineer role or a Data Analyst position, your resume must first pass these automated filters. An ATS-friendly resume avoids complex layouts, tables, and graphics that can confuse the system. Instead, it focuses on clear section headers, standard fonts, and strategically placed keywords related to ${topic}. If your resume isn't optimized, it might be rejected before a human even sees it.`
    },
    {
      h2: `Key Strategies for Success`,
      content: `1. **Quantify Your Achievements**: Instead of saying you "worked on a project," state that you "improved system efficiency by 20%" or "reduced load times by 15%." This shows measurable impact.\n2. **Tailor Your Resume**: Don't use a generic resume for every company. Tailor your keywords to match the job description of companies like Accenture, Capgemini, or HCL.\n3. **Focus on Skills**: Highlight both your technical skills (like Java, Python, or SQL) and your soft skills (like communication and teamwork).`
    },
    {
      h2: `The Importance of CGPA and Certifications`,
      content: `While skills are paramount, Indian recruiters still place a significant emphasis on academic performance. A high CGPA can often act as a prerequisite for the initial screening round. Additionally, certifications from platforms like NPTEL or specific company-led programs (like Infosys InfyTQ or TCS NQT) can significantly boost your ATS score and demonstrate your commitment to continuous learning in your field.`
    },
    {
      h2: `Step-by-Step Checklist for ${capitalize(topic)}`,
      content: `- Use a clean, single-column PDF format.\n- Ensure your contact information is up-to-date and professional.\n- Include a clear, keyword-rich professional summary.\n- Use standard section headers like "Education," "Experience," "Projects," and "Skills."\n- Quantify at least three bullet points in your experience or projects section.\n- Check for spelling and grammar errors multiple times.`
    },
    {
      h2: `Frequently Asked Questions`,
      content: `**Q: How long should my resume be?**\nA: For freshers in India, a single-page resume is highly recommended. It forces you to be concise and highlights your most important achievements.\n\n**Q: Should I include a photo on my resume?**\nA: In India, a photo is generally not required for tech roles and can sometimes lead to ATS parsing errors. It's better to leave it out.\n\n**Q: Is it okay to use a resume builder?**\nA: Yes, as long as the output is a clean PDF. PlacementScore's resume tools are designed to be ATS-friendly.`
    },
    {
      h2: `Next Steps and Related Guides`,
      content: `Ready to see how your resume performs? Use our [ATS score checker](/) to get an instant report. For more detailed guidance, check out our [placement resume checker](/placement-resume-checker) and the [benchmark report](/placement-benchmark-report-2026) to see where you stand compared to other students in India.`
    }
  ];

  let body = sections.map(s => `## ${s.h2}\n\n${s.content}`).join('\n\n');
  
  // Footer CTA
  body += `\n\n---\n\n### Maximize Your Career Odds with PlacementScore\nDon't let your dream job slip away. Join thousands of students who have optimized their resumes for top MNCs. [Check your ATS score free now](/) and get placement-ready today!`;

  const finalContent = applyInternalLinks(body);

  return {
    title,
    slug,
    meta_description: `Complete guide on ${topic} for Indian students in 2026. Learn ATS optimization, resume tips, and campus placement strategies for top MNCs.`,
    content: finalContent,
    cluster,
    created_at: date.toISOString()
  };
}
