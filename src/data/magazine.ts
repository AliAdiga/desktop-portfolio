import { MagazinePage } from "@/types/portfolio";

// Replace with real content. Drop images into public/magazine/.
export const magazine: MagazinePage[] = [
  { kind: "cover", title: "ISSUE 01", subtitle: "Selected Work", image: "" },
  {
    kind: "spread",
    heading: "The Beginning",
    body: "This page is a placeholder. Replace the heading, body text, and image path in src/data/magazine.ts with real content from an editorial spread, a behind-the-scenes story, or a project write-up.",
    image: "",
  },
  {
    kind: "spread",
    heading: "In Motion",
    body: "Each spread can carry its own heading, body copy, and image. Add as many spread objects as needed to grow the magazine.",
    image: "",
  },
  {
    kind: "spread",
    heading: "Behind the Frame",
    body: "Swap this placeholder text for a caption, quote, or short story about the work. Pages are navigated with the arrows, the dots, swipe gestures, or the left/right arrow keys.",
    image: "",
  },
];
