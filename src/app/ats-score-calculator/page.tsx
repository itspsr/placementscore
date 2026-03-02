import type { Metadata } from 'next';
import ScoreCalculatorClient from '@/components/tools/ScoreCalculatorClient';

export const metadata: Metadata = {
  title: 'ATS Score Calculator (Free Estimate)',
  description: 'Free ATS score calculator. Estimate your resume score based on experience, word count, skills, projects, sections, and certifications.',
  alternates: { canonical: 'https://placementscore.online/ats-score-calculator' },
  openGraph: {
    title: 'ATS Score Calculator',
    description: 'Instant manual estimation based on industry standard weights.',
    url: 'https://placementscore.online/ats-score-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS Score Calculator',
    description: 'Instant manual estimation based on industry standard weights.',
  },
};

export default function Page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 3, name: 'ATS Score Calculator', item: 'https://placementscore.online/ats-score-calculator' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is an ATS score calculator accurate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It’s an estimate. Real ATS systems use keyword matching + semantic relevance + formatting and parsing. Use this to spot obvious gaps, then run a full scan for best results.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a good ATS score?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Generally 75+ is considered solid. For competitive roles and MNC filters, aim for 85–90+ with strong keyword alignment and quantified experience.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ScoreCalculatorClient />
    </>
  );
}
