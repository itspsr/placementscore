import type { Metadata } from 'next';
import KeywordCheckerClient from '@/components/tools/KeywordCheckerClient';

export const metadata: Metadata = {
  title: 'ATS Keyword Checker (Resume vs Job Description)',
  description: 'Free ATS keyword checker. Paste your job description and resume to see matched vs missing keywords and improve your shortlisting chances.',
  alternates: { canonical: 'https://placementscore.online/ats-keyword-checker' },
  openGraph: {
    title: 'ATS Keyword Checker',
    description: 'Compare your resume against a job description instantly and find missing keywords.',
    url: 'https://placementscore.online/ats-keyword-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS Keyword Checker',
    description: 'Compare your resume against a job description instantly and find missing keywords.',
  },
};

export default function Page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 3, name: 'ATS Keyword Checker', item: 'https://placementscore.online/ats-keyword-checker' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I find ATS keywords in a job description?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Look for repeated skills, tools, frameworks, certifications, and role requirements. Add the exact terms (when true for you) into your Skills and Experience sections.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I copy keywords exactly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use exact keyword phrases where relevant, but keep your resume truthful. Also include variants (e.g., “REST APIs” and “API development”) to improve semantic matching.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <KeywordCheckerClient />
    </>
  );
}
