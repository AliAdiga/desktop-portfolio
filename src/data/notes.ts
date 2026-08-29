import { Note } from "@/types/portfolio";

export const notes: Note[] = [
  {
    id: "note-1",
    title: "Why I Chose Next.js for My Portfolio",
    content: "After evaluating several frameworks — **Gatsby**, **Astro**, **Remix** — I settled on Next.js 16 with App Router. The key deciding factors were:\n\n- **Server Components** for SEO-friendly rendering\n- **File-based routing** with catch-all segments\n- **Image optimization** out of the box\n- **Incremental adoption** — I can mix SSR and client components freely\n\n### The Result\n\nThe result is a portfolio that loads fast, ranks well, and still feels like a native app with smooth Framer Motion animations. Here's a snippet of how I define apps:\n\n```tsx\nexport const apps = [\n  { id: 'notes', icon: 'StickyNote' },\n  { id: 'music', icon: 'Music' }\n];\n```",
    date: "2026-08-01",
    pinned: true,
  },
  {
    id: "note-2",
    title: "Building a macOS-Inspired UI in React",
    content: "Creating a desktop experience inside a browser was a fun challenge. Here's what I learned:\n\n### 1. Draggable Windows\nI used a custom drag handler with pointer events instead of a heavy library. This gave me full control over bounds and z-index management.\n\n### 2. Traffic Light Buttons\nThe close/minimize/maximize buttons aren't just decorative:\n- **Red**: Closes the window\n- **Yellow**: Minimizes to the dock\n- **Green**: Maximizes to full screen\n\n### 3. Dock Magnification\nCSS transforms with a dynamic scale factor based on cursor distance create that signature macOS dock effect.",
    date: "2026-07-28",
    pinned: true,
  },
  {
    id: "note-3",
    title: "My Development Setup 2024",
    content: "Here's my current daily driver setup for coding:\n\n### Hardware\n- **OS:** macOS Sonoma on M3 MacBook Pro\n- **Monitor:** 27\" 4K Display\n\n### Software\n- **Editor:** VS Code with _Dracula Pro_ theme\n- **Terminal:** Warp with custom keybindings\n- **Browser:** Arc Browser for development\n- **Font:** JetBrains Mono for code, Inter for UI\n\n> I also rely heavily on Figma for UI prototyping before writing any code. It saves a ton of iteration time.",
    date: "2026-07-15",
  },
  {
    id: "note-4",
    title: "Tips for Clean TypeScript Code",
    content: "Some patterns I follow in every TypeScript project:\n\n1. Always use `strict: true` in tsconfig\n2. Prefer `interface` for object shapes, `type` for unions\n3. Use `as const` for literal arrays and objects\n4. Avoid `any` — use `unknown` and narrow with type guards\n5. Export types alongside their components\n\nClean types = fewer bugs and better IDE experience! 🎉",
    date: "2026-06-20",
  },
];
