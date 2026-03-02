/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Legacy company-score URLs → new public SEO URLs (dash format)
      {
        source: '/company-score/:company',
        destination: '/ats-score-for-:company',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Public SEO URLs (dash format) → internal Next routes (segment format)
      {
        source: '/ats-score-for-:company',
        destination: '/ats-score-for/:company',
      },
      {
        source: '/resume-for-:company',
        destination: '/resume-for/:company',
      },
      // Keep any legacy content slugs working (optional)
      {
        source: '/google-internship-resume-guide',
        destination: '/blog/google-internship-resume-guide',
      },
    ];
  },
};

export default nextConfig;
