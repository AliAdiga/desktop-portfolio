import { MagazinePage } from "@/types/portfolio";

// A short case-study issue: one spread per build, in the order they shipped.
//
// WHAT'S HERE vs WHAT'S MISSING — worth knowing before you show this to anyone:
// every claim below is drawn from the live sites and each repo's package.json,
// so it's accurate but external. What it can't contain is the part that
// actually makes a case study land: why you made a given call, what fought
// back, what you'd do differently. Add a line or two of that to each spread
// and this becomes the strongest page on the site.
export const magazine: MagazinePage[] = [
  {
    kind: "cover",
    title: "SELECTED WORK",
    subtitle: "Six builds · 2026",
    image: "/projects/vestra.jpg",
  },
  {
    kind: "spread",
    heading: "Zaytoun",
    body: "A fine-dining restaurant in Amman, built around ancestral Arabic recipes. The site runs fully bilingual — Arabic and English — which means the whole layout mirrors, not just the copy: navigation, alignment, and reading order all flip with the language. The menu carries dietary markers and filters by course, and reservations are handled in-page.",
    image: "/photos/zaytoun-menu.jpg",
  },
  {
    kind: "spread",
    heading: "Vestra",
    body: "A storefront for a jewellery studio working in recycled gold, where every piece is made to order. That changes the commerce model: there's no stock counter, so the product pages sell process instead — an atelier flow that walks through consultation, design approval and making, alongside collection browsing, size and gift guides, and a cart.",
    image: "/photos/vestra-atelier.jpg",
  },
  {
    kind: "spread",
    heading: "Cedar Stone Legal",
    body: "A law firm site where the motion does the persuading. Built on GSAP with Lenis driving smooth scroll, it moves through practice areas, attorney profiles and firm statistics as a single continuous sequence rather than a set of pages. Bilingual Arabic and English, with a consultation booking flow.",
    image: "/photos/cedar-team.jpg",
  },
  {
    kind: "spread",
    heading: "Evercare",
    body: "A hospital site, which is really an information-architecture problem: someone arriving is usually anxious and looking for one specific thing. Departments, consultants and facilities are organised to be scanned rather than read, and the appointment request is a short form reachable from anywhere on the page.",
    image: "/photos/evercare-appt.jpg",
  },
  {
    kind: "spread",
    heading: "FinFlow",
    body: "A revenue-intelligence dashboard for SaaS teams, and the most full-stack piece here. Supabase handles authentication and data behind an app shell; Recharts renders MRR and ARR movement, churn prediction and multi-channel attribution. The interesting work is upstream of the interface — shaping raw revenue events into something a founder can read in ten seconds.",
    image: "/projects/finflow.jpg",
  },
  {
    kind: "spread",
    heading: "Void Studio",
    body: "A site for a creative studio, carried almost entirely by typography. Display type at scale, a kinetic word-grid, and very little else — the restraint is the design. Proof that a page can be memorable without imagery doing the lifting.",
    image: "/projects/void-studio.jpg",
  },
];
