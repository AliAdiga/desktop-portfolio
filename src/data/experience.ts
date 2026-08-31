import { Experience } from "@/types/portfolio";

// Written from verifiable evidence: the public repo history on GitHub
// (May–Aug 2026) and the live sites themselves.
//
// TWO THINGS TO CORRECT — I had no way to determine either:
//   1. The engagement type. "Freelance" is an assumption; change it if this was
//      employed, agency or contract work.
//   2. Anything before May 2026. If you have earlier roles, they belong above
//      this entry — the list renders newest first.
export const experience: Experience[] = [
  {
    id: "exp-freelance-2026",
    role: "Freelance Web Developer",
    company: "Independent",
    period: "2026 — Present",
    description:
      "Designed and shipped production sites across hospitality, retail, legal and healthcare — including bilingual Arabic/English builds with full RTL layout. Work spans e-commerce with cart and product flows, appointment and consultation booking, and content-driven marketing sites.",
  },
  {
    id: "exp-product-2026",
    role: "Full-Stack Developer",
    company: "Product & side projects",
    period: "2026",
    description:
      "Built FinFlow, a SaaS revenue-intelligence dashboard covering MRR/ARR tracking, churn prediction and attribution behind an authenticated shell; and the Node/Express leaderboard service behind Foxy Dash, an HTML5 endless runner — score submission, per-difficulty rankings and rank-on-submit.",
  },
];
