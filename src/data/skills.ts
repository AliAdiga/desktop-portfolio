import { Skill } from "@/types/portfolio";

// Cleared: this held the upstream template's demo list (TypeScript, React,
// Node…) which described a frontend developer, not this client. The Terminal
// app's `skills` command reads from here too, so leaving it populated would
// have surfaced the wrong content even with the Skills app removed.
//
// Repopulate with real disciplines (e.g. "Colour grading", "Directing") and
// add a dock entry back in folders.ts if the Skills app is wanted.
export const skills: Skill[] = [];
