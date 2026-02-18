import type { Metadata } from 'next';
import CompanyLandingPage from '@/components/CompanyLandingPage';

export async function generateStaticParams() {
  const companies = ['tcs', 'wipro', 'infosys', 'accenture', 'google-internship'];
  return companies.map((company) => ({ company }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: { company: string } }): Promise<Metadata> {
  if (!params?.company) return { title: 'ATS Score Checker' };
  const companyName = params.company.charAt(0).toUpperCase() + params.company.slice(1).replace(/-/g, ' ');

  // Public SEO URL (dash format) is canonical
  const canonical = `https://placementscore.online/ats-score-for-${params.company}`;

  return {
    title: `Check Your ${companyName} ATS Score | PlacementScore.online`,
    description: `Calculate your resume compatibility score for ${companyName} recruitment software. Optimize for ${companyName} NQT and interview selection 2026.`,
    alternates: { canonical },
    openGraph: {
      title: `${companyName} ATS Resume Checker`,
      description: `Free AI tool to check your resume score for ${companyName} placement drives.`,
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${companyName} ATS Resume Checker`,
      description: `Free AI tool to check your resume score for ${companyName} placement drives.`,
    },
  };
}

export default function Page({ params }: { params: { company: string } }) {
  if (!params?.company) return null;
  return <CompanyLandingPage company={params.company} type="ats-score" />;
}
