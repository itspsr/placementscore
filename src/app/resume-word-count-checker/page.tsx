import type { Metadata } from 'next';
import WordCountCheckerClient from '@/components/tools/WordCountCheckerClient';

export const metadata: Metadata = {
  title: 'Resume Word Count Checker (450–800 ATS Sweet Spot)',
  description: 'Free resume word counter for freshers and experienced candidates. Check if your resume length fits ATS-friendly standards (450–800 words).',
  alternates: { canonical: 'https://placementscore.online/resume-word-count-checker' },
  openGraph: {
    title: 'Resume Word Count Checker',
    description: 'Check if your resume meets the ATS-friendly 450–800 word range.',
    url: 'https://placementscore.online/resume-word-count-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Word Count Checker',
    description: 'Check if your resume meets the ATS-friendly 450–800 word range.',
  },
};

export default function Page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 3, name: 'Resume Word Count Checker', item: 'https://placementscore.online/resume-word-count-checker' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best resume word count for ATS?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For most freshers and entry-level roles, 450–800 words is an ATS-friendly range. Too short reduces keyword coverage; too long can dilute relevance.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is a 1-page resume okay in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. A strong 1-page resume is fine for freshers. For experienced candidates, 1–2 pages is standard.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <WordCountCheckerClient />
    </>
  );
}
