import { Project } from "@/types/portfolio";

// Thumbnails live in public/projects/ at 1600x900 (16:9 is what the grid expects).
//
// NOTE ON techStack: the descriptions below come from the live sites, but the
// stacks are an educated guess from the fact they're deployed on Vercel.
// Correct them — an inaccurate stack list is worse than a short one.
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
      "Marketing site for a law firm: practice areas, team profiles, FAQ and a consultation booking flow. Bilingual Arabic/English.",
    techStack: ["Next.js", "React", "Tailwind"],
    thumbnail: "/projects/cedar-stone.jpg",
    liveUrl: "https://cedar-stone-legal.vercel.app/",
    year: "2026",
  },
  {
    id: "evercare",
    title: "Evercare Medical Center",
    description:
      "Hospital site covering departments, consultants and facilities, with online booking and a patient portal entry point.",
    techStack: ["Next.js", "React", "Tailwind"],
    thumbnail: "/projects/evercare.jpg",
    liveUrl: "https://evercare-hospital-blush.vercel.app/",
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
