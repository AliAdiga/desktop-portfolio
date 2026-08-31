import { Skill } from "@/types/portfolio";

// PLACEHOLDER — replace every entry with the client's real disciplines.
//
// `category` is free text: SkillsWindow groups by whatever categories appear
// here and picks an icon from the wording ("direction", "camera", "post",
// "sound"). Add or rename categories freely.
export const skills: Skill[] = [
  { name: "Creative direction", category: "Direction" },
  { name: "Concept development", category: "Direction" },
  { name: "Storyboarding", category: "Direction" },

  { name: "Cinematography", category: "Camera" },
  { name: "Lighting", category: "Camera" },
  { name: "Gimbal operation", category: "Camera" },
  { name: "Aerial / drone", category: "Camera" },

  { name: "Editing", category: "Post-production" },
  { name: "Colour grading", category: "Post-production" },
  { name: "Motion graphics", category: "Post-production" },

  { name: "Sound design", category: "Sound" },
];
