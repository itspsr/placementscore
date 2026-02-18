import type { Metadata } from 'next';
import Script from 'next/script';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'AI Resume Score & Job Match Tool for Indian Students',
  description:
    'Improve your ATS resume score and discover job matches using AI. Get instant recruiter insights.',
  alternates: { canonical: 'https://placementscore.online/' },
  openGraph: {
    title: 'AI Resume Score & Job Match Tool for Indian Students',
    description:
      'Improve your ATS resume score and discover job matches using AI. Get instant recruiter insights.',
    url: 'https://placementscore.online/',
    siteName: 'PlacementScore.online',
    type: 'website',
  },
};

export default function Page() {
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
      <HomeClient />
    </>
  );
}
