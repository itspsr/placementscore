import CompanyLandingPage from '@/components/CompanyLandingPage';

export async function generateStaticParams() {
  const companies = ['tcs', 'wipro', 'infosys', 'accenture', 'google-internship'];
  return companies.map((company) => ({
    company,
  }));
}

export const dynamicParams = true; // Allow other companies

export async function generateMetadata({ params }: { params: { company: string } }) {
  if (!params?.company) return { title: 'ATS Score Checker' };
  const company = params.company.charAt(0).toUpperCase() + params.company.slice(1).replace(/-/g, ' ');
  return {
    title: `Check Your ${company} ATS Score | PlacementScore.online`,
    description: `Calculate your resume compatibility score for ${company} recruitment software. Optimize for ${company} NQT and interview selection 2026.`,
    openGraph: {
      title: `${company} ATS Resume Checker`,
      description: `Free AI tool to check your resume score for ${company} placement drives.`,
    }
  };
}

export default function Page({ params }: { params: { company: string } }) {
  if (!params?.company) return null;
  return <CompanyLandingPage company={params.company} type="ats-score" />;
}
