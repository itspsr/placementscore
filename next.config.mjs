/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Legacy company-score URLs → new SEO URLs
      {
        source: '/company-score/:company',
        destination: '/ats-score-for-:company',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Keep any legacy content slugs working (optional)
      {
        source: '/google-internship-resume-guide',
        destination: '/blog/google-internship-resume-guide',
      },
    ];
  },
};

export default nextConfig;
