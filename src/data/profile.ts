import { Profile, SocialLink } from "@/types/portfolio";

export const profile: Profile = {
  name: "Ali Tsai",
  role: "Software Engineer",
  bio: "I build things for the web — interfaces, tools, and the systems behind them.",
  avatar: "", // path to a photo, e.g. "/avatar.jpg" — leave empty for an initials fallback
  email: "DevLancer@gmail.com",
  location: "Amman, Jordan",
  // Drop a PDF at public/cv.pdf and this becomes a "Download CV" action in
  // About. Left empty until the file exists, so the button never 404s.
  resumeUrl: "",
  phone: "+962 77 987 6125", // leave empty to hide the "Call me" contact action
};

// Each entry becomes a dock/home-screen app automatically (see
// src/data/socialApps.ts) and is listed in About and the Terminal's `contact`.
// `icon` must match a key in getColorsForPlatform there — github, linkedin, x,
// instagram, youtube, dribbble, behance, tiktok, threads, telegram, ...
export const socialLinks: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/AliAdiga", icon: "github" },
  // LinkedIn is the one a client looks for after the code. Add the real
  // profile URL here — it needs no other change to appear everywhere:
  // { platform: "LinkedIn", url: "https://linkedin.com/in/<handle>", icon: "linkedin" },
];
