import { AboutContent } from "@/types/portfolio";

// DRAFT — written to be edited. The two paragraphs read as a starting point in
// a neutral engineering voice; rewrite them in yours. Specifics beat adjectives:
// name the systems, the scale, the problems. Sections with empty arrays are
// hidden automatically, so leave `awards` and `clients` empty until they'd
// actually add something.
export const aboutContent: AboutContent = {
  // Drop 2-3 images into public/about/ and list them here for the intro gallery.
  images: [
    // "/about/work-1.jpg",
    // "/about/work-2.jpg",
    // "/about/work-3.jpg",
  ],

  whatIDo:
    "I build for the web — interfaces people actually enjoy using, and the systems that keep them fast and predictable. Most of my work is TypeScript and React, usually somewhere in the overlap between design and engineering: the details that decide whether an interface feels considered or merely finished.",

  approach:
    "I like problems where the obvious solution doesn't quite work. I'd rather understand why something breaks than route around it, and I care about the parts users never see — the state that doesn't get stranded, the edge case that doesn't corrupt anything, the thing that still behaves under load. Shipping matters, but so does what you leave behind for whoever reads the code next.",

  offerings: [
    "Frontend architecture",
    "Design systems & component libraries",
    "Interaction & motion design",
    "Performance and accessibility work",
    "Full-stack feature delivery",
    "Prototyping",
  ],

  // Hidden while empty — add entries only if they'd genuinely add something.
  awards: [],
  clients: [],
};
