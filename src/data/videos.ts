import { VideoItem } from "@/types/portfolio";

// Project demos — short screen recordings shown in the page-turn viewer, each
// facing a write-up of what was built.
//
// PLACEHOLDER: the three files in public/videos/ are stock test footage from
// earlier and are NOT your work. Replace them with real captures before this
// goes anywhere public.
//
// Keep them short (20-40s), silent, and cropped to the interesting part.
// Portrait (9:16) fills the page best — the right page uses object-cover, so
// landscape captures get cropped hard.
export const videos: VideoItem[] = [
  {
    id: "demo-1",
    title: "Demo 01",
    src: "/videos/reel-01.mp4",
    poster: "",
    meta: "2026 · Next.js · TypeScript",
    description:
      "What this project does, and what you built. Point at the interesting engineering — the bit that was actually hard.",
  },
  {
    id: "demo-2",
    title: "Demo 02",
    src: "/videos/reel-02.mp4",
    poster: "",
    meta: "2025 · React · Node.js",
    description:
      "Another walkthrough. A short capture of the thing working beats a paragraph describing it.",
  },
  {
    id: "demo-3",
    title: "Demo 03",
    src: "/videos/reel-03.mp4",
    poster: "",
    meta: "2025 · TypeScript",
    description:
      "Replace with a real capture. Drop the file into public/videos/ and point src at it.",
  },
];
