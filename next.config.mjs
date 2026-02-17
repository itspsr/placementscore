/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/ats-score-for-tcs',
        destination: '/company-score/tcs',
      },
      {
        source: '/ats-score-for-infosys',
        destination: '/company-score/infosys',
      },
      {
        source: '/google-internship-resume-guide',
        destination: '/blog/google-internship-resume-guide',
      },
    ];
  },
};

export default nextConfig;
