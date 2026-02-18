import CompanyLandingPage from '@/components/CompanyLandingPage';

export async function generateStaticParams() {
  const companies = ['tcs', 'wipro', 'infosys', 'accenture', 'google-internship'];
  return companies.map((company) => ({
    company,
  }));
}

export const dynamicParams = true; // Allow other companies

export async function generateMetadata({ params }: { params: { company: string } }) {
  if (!params?.company) return { title: 'Resume Format Builder' };
  const company = params.company.charAt(0).toUpperCase() + params.company.slice(1).replace(/-/g, ' ');
  const canonical = `https://placementscore.online/resume-for-${params.company}`;
  return {
    title: `Create ${company} Resume Format | PlacementScore.online`,
    description: `Download optimized ${company} resume templates. AI-powered format to clear ${company} NQT and HR rounds 2026.`,
    alternates: { canonical },
    openGraph: {
      title: `${company} Resume Format Builder`,
      description: `Create an ATS-friendly resume specific to ${company} placement drives.`,
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company} Resume Format Builder`,
      description: `Create an ATS-friendly resume specific to ${company} placement drives.`,
    }
  };
}

export default function Page({ params }: { params: { company: string } }) {
  if (!params?.company) return null;
  return <CompanyLandingPage company={params.company} type="resume" />;
}
