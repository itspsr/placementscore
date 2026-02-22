import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://placementscore.online"),
  title: {
    default: "PlacementScore.online | #1 AI ATS Resume Checker for Indian Placements",
    template: "%s | PlacementScore.online"
  },
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
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_ID", 
  },
  icons: {
    icon: '/favicon.svg',
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
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-YOUR_GA4_ID`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YOUR_GA4_ID');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-[#050505] antialiased selection:bg-blue-500/30`}>
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PlacementScore.online",
              "url": "https://placementscore.online",
              "logo": "https://placementscore.online/logo.png",
              "sameAs": [
                "https://twitter.com/placementscore",
                "https://www.linkedin.com/company/placementscore"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-1234567890",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": "en"
              }
            })
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "PlacementScore.online",
              "url": "https://placementscore.online",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://placementscore.online/blog?query={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
