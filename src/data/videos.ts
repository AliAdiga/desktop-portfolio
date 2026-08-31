import { VideoItem } from "@/types/portfolio";

// Project demos — shown in the page-turn viewer, each facing a write-up.
//
// Export from mockvid at 9:16 (NOT 16:9 — the page is portrait, so a landscape
// clip loses ~62% of its width to cropping). MP4 / 1080p / 30fps / no audio.
// Drop the files into public/videos/ with these names and they appear.
//
// The page uses object-cover, so ~16% is trimmed off the top and bottom of a
// 9:16 clip — that's background in a mockup scene, not content.
export const videos: VideoItem[] = [
  {
    id: "demo-zaytoun",
    title: "Zaytoun",
    src: "/videos/zaytoun.mp4",
    poster: "/projects/zaytoun.jpg",
    meta: "2026 · Restaurant · Bilingual",
    description:
      "Fine dining in Amman, built around ancestral Arabic recipes. Bilingual Arabic/English throughout, with the menu, the story and table reservations.",
  },
  {
    id: "demo-vestra",
    title: "Vestra",
    src: "/videos/vestra.mp4",
    poster: "/projects/vestra.jpg",
    meta: "2026 · E-commerce",
    description:
      "Storefront for a jewellery studio working in recycled gold — collections, product pages, size and gift guides, and a cart.",
  },
];
