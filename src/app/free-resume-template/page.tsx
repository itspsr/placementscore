import type { Metadata } from 'next';
import FreeTemplateClient from '@/components/tools/FreeTemplateClient';

export const metadata: Metadata = {
  title: 'Free ATS Resume Template (2026)',
  description: 'Download a free ATS-friendly resume template (PDF + Word). Built for Indian placements and MNC shortlisting in 2026.',
  alternates: { canonical: 'https://placementscore.online/free-resume-template' },
  openGraph: {
    title: 'Free ATS Resume Template (2026)',
    description: 'Get a free ATS-friendly resume template (PDF + Word).',
    url: 'https://placementscore.online/free-resume-template',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Template (2026)',
    description: 'Get a free ATS-friendly resume template (PDF + Word).',
  },
};

export default function Page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://placementscore.online/' },
      { '@type': 'ListItem', position: 2, name: 'Free Resume Template', item: 'https://placementscore.online/free-resume-template' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this resume template ATS-friendly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. It uses a clean single-column structure, standard headings, and ATS-safe formatting that parses reliably.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I use a colorful resume template?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For most MNC and campus placement pipelines, keep it simple. Heavy design, icons, and columns can break ATS parsing.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FreeTemplateClient />
    </>
  );
}
