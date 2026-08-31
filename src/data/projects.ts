import { Project } from "@/types/portfolio";

// PLACEHOLDER — replace with your real work.
//
// Drop thumbnails into public/projects/ (16:9 reads best in the grid).
// `featured: true` pins a project to the top whatever the sort.
export const projects: Project[] = [
  {
    id: "project-1",
    title: "Desktop Portfolio",
    description:
      "This site — a macOS-style desktop in the browser, with a window manager, a draggable folder tree and a page-turning reel viewer.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    thumbnail: "/projects/desktop-portfolio.jpg",
    year: "2026",
    featured: true,
    // liveUrl: "https://your-domain.com",
    // githubUrl: "https://github.com/you/portfolio",
  },
  {
    id: "project-2",
    title: "Project name",
    description:
      "One or two sentences: what it does, and what you actually built. Name the hard part.",
    techStack: ["React", "Node.js", "PostgreSQL"],
    thumbnail: "/projects/project-2.jpg",
    year: "2025",
  },
];
