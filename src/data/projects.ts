import { Project } from "@/types/portfolio";

// Thumbnails live in public/projects/ at 1600x900 (16:9 is what the grid expects).
//
// techStack is read from each repo's package.json, except Zaytoun and Vestra —
// those repos are private or have no readable manifest, so their stacks are
// still a guess. Correct those two.
export const projects: Project[] = [
  {
    id: "zaytoun",
    title: "Zaytoun",
    description:
      "Site for an Amman fine-dining restaurant serving ancestral Arabic recipes. Bilingual Arabic/English, with the menu, story and table reservations.",
    techStack: ["Next.js", "React", "Tailwind"],
    thumbnail: "/projects/zaytoun.jpg",
    liveUrl: "https://zaytoun-restaurant.vercel.app/",
    year: "2026",
    featured: true,
  },
  {
    id: "vestra",
    title: "Vestra",
    description:
      "Storefront for a jewellery studio working in recycled gold — collections, product pages, size and gift guides, and a cart.",
    techStack: ["Next.js", "React", "Tailwind"],
    thumbnail: "/projects/vestra.jpg",
    liveUrl: "https://vestra-eta.vercel.app/",
    year: "2026",
    featured: true,
  },
  {
    id: "cedar-stone",
    title: "Cedar Stone Legal",
    description:
      "Marketing site for a law firm: practice areas, team profiles, FAQ and a consultation booking flow. Bilingual Arabic/English, with scroll-driven animation throughout.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "GSAP", "Lenis"],
    thumbnail: "/projects/cedar-stone.jpg",
    liveUrl: "https://cedar-stone-legal.vercel.app/",
    year: "2026",
  },
  {
    id: "evercare",
    title: "Evercare Medical Center",
    description:
      "Hospital site covering departments, consultants and facilities, with online booking and a patient portal entry point.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    thumbnail: "/projects/evercare.jpg",
    liveUrl: "https://evercare-hospital-blush.vercel.app/",
    year: "2026",
  },
  {
    id: "finflow",
    title: "FinFlow",
    description:
      "Revenue-intelligence dashboard for SaaS teams — MRR and ARR tracking, churn prediction, multi-channel attribution and automated reporting. Supabase handles auth and data; the charting is built on Recharts.",
    techStack: ["Next.js", "TypeScript", "Supabase", "Recharts", "Tailwind"],
    thumbnail: "/projects/finflow.jpg",
    liveUrl: "https://finflow-dashboard-kohl.vercel.app",
    githubUrl: "https://github.com/AliAdiga/finflow-dashboard",
    year: "2026",
  },
  {
    id: "void-studio",
    title: "Void Studio",
    description:
      "Site for a creative and design studio, built around bold display typography and a kinetic word-grid — brand identities, campaigns and digital work.",
    techStack: ["Next.js", "TypeScript", "Tailwind"],
    thumbnail: "/projects/void-studio.jpg",
    liveUrl: "https://void-studio-theta.vercel.app",
    githubUrl: "https://github.com/AliAdiga/void-studio",
    year: "2026",
  },
  {
    id: "foxy-dash",
    title: "Foxy Dash — Leaderboard API",
    description:
      "Node/Express service backing an HTML5 endless runner: score submission, per-difficulty top-20 rankings and rank-on-submit, over a file-backed store that needs no database to run.",
    techStack: ["Node.js", "Express", "JavaScript", "REST"],
    thumbnail: "",
    githubUrl: "https://github.com/AliAdiga/foxydash-leaderboard",
    year: "2026",
  },
  {
    id: "desktop-portfolio",
    title: "Desktop Portfolio",
    description:
      "This site — a macOS-style desktop in the browser with a multi-window manager, a drag-and-drop folder tree and a page-turning demo viewer.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    thumbnail: "/projects/desktop-portfolio.jpg",
    githubUrl: "https://github.com/AliAdiga/desktop-portfolio",
    year: "2026",
  },
];
