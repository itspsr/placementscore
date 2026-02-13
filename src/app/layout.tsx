import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
// ... existing metadata
  title: "PlacementScore.online | #1 AI ATS Resume Checker for Indian Placements",
  description: "Get your ATS score instantly. Optimized for Indian students at IIT, NIT, VIT, and SRM. Land top MNC jobs at TCS, Google, and Amazon with AI-powered resume rewriting.",
  keywords: [
    "ATS resume checker India",
    "resume score tool online",
    "best resume analyzer for freshers",
    "Indian campus placement help",
    "TCS resume keywords",
    "Google ATS score checker",
    "resume optimization for students India",
    "PlacementScore online",
    "free resume score checker India"
  ],
  authors: [{ name: "PlacementScore Team" }],
  creator: "PlacementScore.online",
  publisher: "PlacementScore.online",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PlacementScore.online | Land Your Dream Job in India",
    description: "AI-powered resume analysis for Indian students. Beat the ATS and get hired by top MNCs.",
    url: "https://placementscore.online",
    siteName: "PlacementScore",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PlacementScore AI Resume Checker",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlacementScore.online | Beat the 6-Second Resume Scan",
    description: "Join 50,000+ Indian students using AI to bypass ATS filters.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-id", // User should replace this with their actual ID
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://placementscore.online" />
        {/* Structured Data for Google (SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "PlacementScore",
              "url": "https://placementscore.online",
              "description": "AI-powered ATS Resume Checker for Indian students and freshers.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "99.00",
                "priceCurrency": "INR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "50000"
              }
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
