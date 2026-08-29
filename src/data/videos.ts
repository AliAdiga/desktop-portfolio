import { VideoItem } from "@/types/portfolio";

// Drop actual video files into public/videos/ and thumbnails into
// public/videos/posters/, then update the paths below. `poster` is
// optional — tiles without one show a generated placeholder.
export const videos: VideoItem[] = [
  {
    id: "reel-1",
    title: "Reel 01",
    src: "/videos/reel-01.mp4",
    poster: "",
    meta: "2026 · Client Name · Videography",
    description: "A short write-up of this piece goes here — the brief, the approach, and what made it work. Replace with real notes in src/data/videos.ts.",
  },
  {
    id: "reel-2",
    title: "Reel 02",
    src: "/videos/reel-02.mp4",
    poster: "",
    meta: "2026 · Client Name · Videography",
    description: "A short write-up of this piece goes here — the brief, the approach, and what made it work. Replace with real notes in src/data/videos.ts.",
  },
  {
    id: "reel-3",
    title: "Reel 03",
    src: "/videos/reel-03.mp4",
    poster: "",
    meta: "2026 · Client Name · Videography",
    description: "A short write-up of this piece goes here — the brief, the approach, and what made it work. Replace with real notes in src/data/videos.ts.",
  },
];
