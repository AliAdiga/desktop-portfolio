/**
 * ============================================================
 *  DESKTOP CONTENT CONFIG
 * ============================================================
 * This is the ONLY file you need to edit to add folders,
 * videos, or magazine pages. Everything on the desktop is
 * generated from the FOLDERS array below.
 *
 * ------------------------------------------------------------
 * TO ADD A NEW FOLDER OF VIDEOS:
 * ------------------------------------------------------------
 *   1. Copy the "my-work" folder object below.
 *   2. Give it a unique `id` and a `name` (shown under the icon).
 *   3. Set `type: "videos"`.
 *   4. Fill `items` with { title, src, poster } objects.
 *      - `src`    -> path to the video file, e.g. "assets/videos/reel.mp4"
 *      - `poster` -> (optional) path to a thumbnail image. If omitted,
 *                     a generated color tile is used instead.
 *
 * ------------------------------------------------------------
 * TO ADD A NEW MAGAZINE-STYLE FOLDER:
 * ------------------------------------------------------------
 *   1. Copy the "magazine" folder object below.
 *   2. Set `type: "magazine"`.
 *   3. Fill `pages` with page objects (see the "magazine" example).
 *
 * Drop actual video files into: assets/videos/
 * Drop actual magazine images into: assets/magazine/
 *
 * ------------------------------------------------------------
 * WALLPAPER (the full-bleed background photo behind everything)
 * ------------------------------------------------------------
 * Leave empty to use the built-in dark textured background.
 * Set a path (e.g. "assets/wallpaper.jpg") to use your own photo —
 * a large (2000px+ wide) image works best. It will cover the
 * whole screen, so a portrait or moody wide shot both work.
 *
 * ------------------------------------------------------------
 * SOCIAL_LINKS (icons appended to the dock, next to Finder/Mail)
 * ------------------------------------------------------------
 * Uncomment and fill in real URLs. `type` must be one of:
 * instagram, x, behance, linkedin, github, dribbble, youtube,
 * tiktok, vimeo, threads.
 *
 * ------------------------------------------------------------
 * SITE_NAME (shown top-left in the nav bar, and as the browser tab title)
 * ------------------------------------------------------------
 * Put your name or brand here, e.g. "Alex Rivera".
 *
 * ------------------------------------------------------------
 * PROFILE (the floating card near the top-left of the desktop)
 * ------------------------------------------------------------
 * - `avatar`   -> path to a photo, e.g. "assets/avatar.jpg". Leave empty
 *                 to show your initials instead.
 * - `available`-> true shows a green "Available for work" dot, false
 *                 shows a gray "Not available" dot. Set to null to hide
 *                 the status row entirely.
 * ============================================================
 */

const WALLPAPER = "";

const SITE_NAME = "Portfolio";

const PROFILE = {
  name: "Your Name",
  role: "Creative Director",
  bio: "Crafting thoughtful visual work with clarity and purpose.",
  avatar: "",
  available: true
};

// Used by the Mail icon in the dock. Leave empty to disable it.
const CONTACT_EMAIL = "";

const SOCIAL_LINKS = [
  // { type: "instagram", url: "https://instagram.com/yourhandle" },
  // { type: "x", url: "https://x.com/yourhandle" },
  // { type: "behance", url: "https://behance.net/yourhandle" }
];

const FOLDERS = [
  {
    id: "my-work",
    name: "untitled folder",
    type: "videos",
    // Optional: a thumbnail shown as the desktop icon itself instead of
    // a plain folder glyph, e.g. "assets/videos/posters/cover.jpg".
    cover: "",
    items: [
      {
        title: "Reel 01",
        src: "assets/videos/reel-01.mp4",
        poster: ""
      },
      {
        title: "Reel 02",
        src: "assets/videos/reel-02.mp4",
        poster: ""
      },
      {
        title: "Reel 03",
        src: "assets/videos/reel-03.mp4",
        poster: ""
      }
    ]
  },

  {
    id: "magazine",
    name: "Magazine",
    type: "magazine",
    cover: "",
    pages: [
      {
        kind: "cover",
        title: "ISSUE 01",
        subtitle: "Selected Work",
        image: ""
      },
      {
        kind: "spread",
        heading: "The Beginning",
        body: "This page is a placeholder. Replace the heading, body text, and image path in js/data.js with real content from an editorial spread, a behind-the-scenes story, or a project write-up.",
        image: ""
      },
      {
        kind: "spread",
        heading: "In Motion",
        body: "Each spread can carry its own heading, body copy, and image. Add as many spread objects as needed inside the magazine folder's `pages` array to grow the magazine.",
        image: ""
      },
      {
        kind: "spread",
        heading: "Behind the Frame",
        body: "Swap this placeholder text for a caption, quote, or short story about the work. Pages are navigated with the arrows, the dots, swipe gestures, or the left/right arrow keys.",
        image: ""
      }
    ]
  }
];
