import type { Metadata } from "next";
import { profile } from "@/data/profile";
import "./globals.css";
import "./theme.css";

// The site's public identity is derived from src/data/profile.ts so there's a
// single source of truth: fill in the name/role/bio there and the browser tab,
// share cards, and search listings all follow automatically.
const siteTitle = profile.role ? `${profile.name} — ${profile.role}` : profile.name;

/**
 * What relative OpenGraph/Twitter image paths resolve against.
 *
 * Falling back to localhost meant every shared link pointed its preview image
 * at a machine the reader doesn't have, so the card rendered bare — which is
 * exactly when it matters, since sending the link is how this site gets seen.
 *
 * Vercel injects VERCEL_PROJECT_PRODUCTION_URL on every deployment, so the
 * production domain is correct with no configuration at all. Set
 * NEXT_PUBLIC_SITE_URL only to override it — a custom domain, most likely.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

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
    "web developer",
    "freelance developer",
    "React",
    "Next.js",
    "TypeScript",
    "Amman",
    "Jordan",
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
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: siteTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: profile.bio,
    images: ["/og.jpg"],
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
    // suppressHydrationWarning is required, not cosmetic: the boot script below
    // rewrites data-theme before React hydrates, so a returning light-theme
    // visitor always has an attribute that differs from the server's "dark".
    // Suppression is scoped to this element's attributes only.
    <html
      lang="en"
      className="h-full antialiased"
      translate="no"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {/*
          Applies the saved theme before the first paint. Without it the page
          renders dark, React mounts, reads localStorage, and a returning
          light-theme visitor watches the whole desktop flip — the classic
          theme flash. Inline and synchronous is the point: it must run before
          the browser paints, so it cannot be a component or an effect.

          Kept deliberately tiny and wrapped in try/catch, since blocked storage
          throws on access and must not take the page down with it. The key is
          THEME_STORAGE_KEY from src/lib/theme.ts — change both together.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("desktop-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      {/* Themed rather than hardcoded black: this is what shows behind the
          wallpaper while it loads, and in light theme a black flash reads as a
          broken page. */}
      <body className="min-h-full flex flex-col overflow-hidden bg-[var(--background)] text-[color:var(--desk-text-strong)]">
        {children}
      </body>
    </html>
  );
}
