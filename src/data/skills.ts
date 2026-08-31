import { Skill } from "@/types/portfolio";

// Every entry here is backed by shipped work — read from the package.json of
// each project rather than assumed:
//   GSAP + Lenis      Cedar Stone Legal
//   Framer Motion     Evercare, this portfolio
//   Supabase, Recharts  FinFlow
//   Express, Node     Foxy Dash leaderboard API
//   AR/EN + RTL       Zaytoun, Cedar Stone
//
// Trim anything you would not want to be questioned on in an interview. A
// short list you can defend beats a long one you can't.
export const skills: Skill[] = [
  { name: "TypeScript", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "HTML & CSS", category: "Languages" },
  { name: "SQL", category: "Languages" },

  { name: "React", category: "Frameworks & Libraries" },
  { name: "Next.js", category: "Frameworks & Libraries" },
  { name: "Tailwind CSS", category: "Frameworks & Libraries" },
  { name: "Framer Motion", category: "Frameworks & Libraries" },
  { name: "GSAP", category: "Frameworks & Libraries" },

  { name: "Node.js", category: "Backend & Data" },
  { name: "Express", category: "Backend & Data" },
  { name: "Supabase / Postgres", category: "Backend & Data" },
  { name: "REST API design", category: "Backend & Data" },
  { name: "Authentication", category: "Backend & Data" },
  { name: "Data visualisation", category: "Backend & Data" },

  { name: "Component architecture", category: "Frontend Craft" },
  { name: "Design systems", category: "Frontend Craft" },
  { name: "Interaction & motion", category: "Frontend Craft" },
  { name: "Responsive & mobile-first", category: "Frontend Craft" },
  { name: "Accessibility", category: "Frontend Craft" },
  { name: "Internationalisation (AR/EN, RTL)", category: "Frontend Craft" },

  { name: "Git & GitHub", category: "Tools" },
  { name: "Vercel", category: "Tools" },
  { name: "VS Code", category: "Tools" },
  { name: "Figma", category: "Tools" },
];
