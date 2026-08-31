import { Skill } from "@/types/portfolio";

// PLACEHOLDER — replace with what you actually work in.
//
// `category` is free text: SkillsWindow groups by whatever appears here and
// picks an icon from the wording (language / framework / backend / tools).
export const skills: Skill[] = [
  { name: "TypeScript", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "Python", category: "Languages" },
  { name: "SQL", category: "Languages" },

  { name: "React", category: "Frameworks & Libraries" },
  { name: "Next.js", category: "Frameworks & Libraries" },
  { name: "Tailwind CSS", category: "Frameworks & Libraries" },
  { name: "Framer Motion", category: "Frameworks & Libraries" },

  { name: "Node.js", category: "Backend & Data" },
  { name: "PostgreSQL", category: "Backend & Data" },
  { name: "REST & GraphQL", category: "Backend & Data" },

  { name: "Git", category: "Tools" },
  { name: "Docker", category: "Tools" },
  { name: "Vercel", category: "Tools" },
  { name: "Figma", category: "Tools" },
];
