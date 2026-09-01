import { Note } from "@/types/portfolio";

// Shown in the Notes app, inside the Writing folder. `pinned` floats a note to
// the top of the list.
export const notes: Note[] = [
  {
    id: "read-me",
    title: "Read me",
    date: "2026-09-01",
    pinned: true,
    content: `This site is a desktop, not a page.

Double-click an icon to open a window. Drag icons anywhere, including in and out of folders and the dock. Windows stack, so you can have several open at once — click one to bring it forward.

Worth opening:

• Projects — six sites, each linking to the live build
• Demos — screen recordings of two of them, in a flip-book
• Photos — a walk through each project, page by page
• Terminal — it takes real commands; start with \`help\`
• The sun/moon in the menu bar switches the whole desktop to light

Everything here was built rather than templated, which is the point.`,
  },
  {
    id: "how-i-work",
    title: "How I work",
    date: "2026-09-01",
    content: `A short version, so there are no surprises.

I start with what the site is for. A restaurant needs bookings and a menu people can read on a phone at the table; a jeweller needs the pieces to look expensive and the checkout to feel safe. The design follows from that, not the other way round.

I build in the open. You get a live URL from the first week, and it updates as I go, so you are never waiting on a reveal at the end.

I write things down. The code is commented for whoever reads it next, which might be me in a year or might be you with another developer. That is deliberate — you should not be locked in.

I would rather tell you something is a bad idea than build it quietly and let you find out later.`,
  },
];
