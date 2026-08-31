import { VideoItem } from "@/types/portfolio";

// Project demos — shown in the page-turn viewer, each facing a write-up.
//
// Record the real site in a browser (Win + Alt + R), not through a mockup
// generator: the generators letterbox the site inside a phone or laptop frame
// and stamp a watermark on the result, which leaves the actual work occupying
// a fraction of the page.
//
// Aim for 16:9 to match the page. On an ultrawide display the site's centred
// container leaves dead margin either side, so crop to 16:9 before encoding:
//
//   ffmpeg -i in.mp4 -vf "crop=2278:1282:578:0,scale=1280:720" //     -c:v libx264 -crf 30 -an -movflags +faststart out.mp4
//
// (crop is w:h:x:y — recompute x as (source_width - crop_width) / 2.)
//
// The page fits with object-contain, so nothing is ever cropped; an off-ratio
// clip just letterboxes against the page background. Drop files into
// public/videos/ under the names below and they appear.
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
