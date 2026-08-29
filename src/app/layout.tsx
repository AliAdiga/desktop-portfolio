import type { Metadata } from "next";
import { profile } from "@/data/profile";
import "./globals.css";

// The site's public identity is derived from src/data/profile.ts so there's a
// single source of truth: fill in the name/role/bio there and the browser tab,
// share cards, and search listings all follow automatically.
const siteTitle = profile.role ? `${profile.name} — ${profile.role}` : profile.name;

// Set NEXT_PUBLIC_SITE_URL to the real domain before going live. It's what
// relative OpenGraph/Twitter image paths get resolved against.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${profile.name}`,
  },
  description: profile.bio,
  keywords: [
    profile.name,
    profile.role,
    "portfolio",
    "photography",
    "videography",
    "creative direction",
    "design",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: profile.name,
    title: siteTitle,
    description: profile.bio,
    // Add a share image at public/og.jpg (1200x630 recommended), then
    // uncomment to have it show when the site is linked anywhere.
    // images: [{ url: "/og.jpg", width: 1200, height: 630, alt: siteTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: profile.bio,
    // images: ["/og.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" translate="no">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-full flex flex-col overflow-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}
