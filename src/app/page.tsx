import type { Metadata } from 'next';
import Script from 'next/script';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Free ATS Resume Score Checker India (AI Powered 2026)',
  description:
    'Check your ATS resume score instantly. AI-powered resume analyzer for Indian students and freshers. Improve your resume and get shortlisted faster.',
  alternates: { canonical: 'https://placementscore.online/' },
  openGraph: {
    title: 'Free ATS Resume Score Checker India (AI Powered 2026)',
    description:
      'Check your ATS resume score instantly. AI-powered resume analyzer for Indian students and freshers. Improve your resume and get shortlisted faster.',
    url: 'https://placementscore.online/',
    siteName: 'PlacementScore.online',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Score Checker India (AI Powered 2026)',
    description:
      'Check your ATS resume score instantly. AI-powered resume analyzer for Indian students and freshers. Improve your resume and get shortlisted faster.',
    images: ['/og-image.png'],
  }
};

export default function Page() {

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is ATS score?",
        "acceptedAnswer": { "@type": "Answer", "text": "An ATS score shows how well your resume matches a job description and how likely it is to pass automated screening." }
      },
      {
        "@type": "Question",
        "name": "What is a good ATS score?",
        "acceptedAnswer": { "@type": "Answer", "text": "A score above 75 is typically competitive, while 80+ puts you in a top tier for shortlisting." }
      },
      {
        "@type": "Question",
        "name": "How to increase ATS score?",
        "acceptedAnswer": { "@type": "Answer", "text": "Match keywords from the job description, improve formatting, and add measurable results." }
      },
      {
        "@type": "Question",
        "name": "Is this ATS checker free?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, you can scan for a free score, with upgrades for deeper insights." }
      }
    ]
  };
  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PlacementScore.online',
    url: 'https://placementscore.online/',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      category: 'Free',
    },
    description:
      'Improve your ATS resume score and discover job matches using AI. Get instant recruiter insights.',
  };

  return (
    <>
      <Script
        id="jsonld-webapp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <Script
        id="jsonld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
