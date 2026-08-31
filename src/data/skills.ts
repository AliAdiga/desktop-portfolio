import { Skill } from "@/types/portfolio";

// Drawn from what the work actually demonstrates: this codebase (Next.js 16,
// React 19, TypeScript strict, Tailwind v4, Framer Motion, deployed on Vercel)
// and the four client sites — e-commerce, booking flows, and bilingual
// Arabic/English builds with RTL layout.
//
// Trim anything you would not want to be questioned on in an interview. A
// short list you can defend beats a long one you can't.
export const skills: Skill[] = [
  { name: "TypeScript", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "HTML & CSS", category: "Languages" },

  { name: "React", category: "Frameworks & Libraries" },
  { name: "Next.js", category: "Frameworks & Libraries" },
  { name: "Tailwind CSS", category: "Frameworks & Libraries" },
  { name: "Framer Motion", category: "Frameworks & Libraries" },

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
