import { Profile, SocialLink } from "@/types/portfolio";

// Fill these in with your real details.
export const profile: Profile = {
  name: "Ali Tsai",
  role: "Software Engineer",
  bio: "I build things for the web — interfaces, tools, and the systems behind them.",
  avatar: "", // path to a photo, e.g. "/avatar.jpg" — leave empty for an initials fallback
  email: "DevLancer@gmail.com",
  location: "",
  resumeUrl: "",
  phone: "+962 77 987 6125", // leave empty to hide the "Call me" contact action
};

// Uncomment and fill in real URLs. `icon` must match a key in
// src/data/socialApps.ts's getColorsForPlatform (github, linkedin, x,
// instagram, youtube, dribbble, behance, tiktok, threads, telegram, ...).
export const socialLinks: SocialLink[] = [
  // { platform: "Instagram", url: "https://instagram.com/yourhandle", icon: "instagram" },
  // { platform: "X", url: "https://x.com/yourhandle", icon: "x" },
  // { platform: "Behance", url: "https://behance.net/yourhandle", icon: "behance" },
];
