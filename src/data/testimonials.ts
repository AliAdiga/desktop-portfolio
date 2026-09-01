import { Testimonial } from "@/types/portfolio";

/**
 * Client quotes, shown in About under "What clients say".
 *
 * Empty on purpose. For a freelancer this is the single strongest thing on a
 * portfolio — a sentence from a real client outweighs another feature — but it
 * only works if it is genuine, so nothing is invented here.
 *
 * You have four people who can supply one: Zaytoun, Vestra, Cedar Stone Legal
 * and Evercare. The ask that usually works is narrow rather than open-ended:
 * "what were you worried about before we started, and did it happen?" — that
 * produces a specific sentence instead of "great to work with".
 *
 * Add entries and the section appears by itself; leave it empty and About
 * renders exactly as it does now.
 */
export const testimonials: Testimonial[] = [
  // {
  //   id: "zaytoun",
  //   quote: "…",
  //   author: "…",
  //   role: "Owner, Zaytoun",
  //   projectId: "zaytoun",
  // },
];
