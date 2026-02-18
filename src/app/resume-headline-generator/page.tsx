import type { Metadata } from 'next';
import HeadlineGeneratorClient from '@/components/tools/HeadlineGeneratorClient';

export const metadata: Metadata = {
  title: 'Resume Headline Generator (Fresher & Experienced)',
  description: 'Generate strong resume headlines in seconds. Choose your role and experience level and copy a high-impact ATS-friendly headline.',
  alternates: { canonical: 'https://placementscore.online/resume-headline-generator' },
  openGraph: {
    title: 'Resume Headline Generator',
    description: 'Create punchy resume headlines in seconds.',
    url: 'https://placementscore.online/resume-headline-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Headline Generator',
    description: 'Create punchy resume headlines in seconds.',
  },
};

export default function Page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 3, name: 'Resume Headline Generator', item: 'https://placementscore.online/resume-headline-generator' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a resume headline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A resume headline is a 1-line summary at the top of your resume that highlights your role, strengths, and target job. It improves recruiter scanning and ATS relevance.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should freshers add a headline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. A fresher headline should focus on target role + key skills + what you can contribute. Keep it specific and keyword-aligned to the job description.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HeadlineGeneratorClient />
    </>
  );
}
