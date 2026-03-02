import type { Metadata } from 'next';
import ChecklistToolClient from '@/components/tools/ChecklistToolClient';

export const metadata: Metadata = {
  title: 'ATS Resume Checklist (Before You Apply)',
  description: 'Free ATS resume checklist for 2026. Verify formatting, sections, keywords, and content before submitting your resume.',
  alternates: { canonical: 'https://placementscore.online/resume-checklist-tool' },
  openGraph: {
    title: 'ATS Resume Checklist',
    description: 'Don’t hit apply until you check these ATS essentials.',
    url: 'https://placementscore.online/resume-checklist-tool',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS Resume Checklist',
    description: 'Don’t hit apply until you check these ATS essentials.',
  },
};

export default function Page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 3, name: 'Resume Checklist', item: 'https://placementscore.online/resume-checklist-tool' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the most important ATS resume rule?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use a clean single-column layout with standard section headings and include relevant keywords from the job description.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do columns hurt ATS?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Many ATS parsers struggle with multi-column layouts and tables. A single-column format is the safest for parsing.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ChecklistToolClient />
    </>
  );
}
