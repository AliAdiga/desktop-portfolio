import { PortfolioData } from "../types/portfolio";
import { profile, socialLinks } from "./profile";
import { skills } from "./skills";
import { projects } from "./projects";
import { experience } from "./experience";
import { playlist } from "./playlist";
import { notes } from "./notes";
import { photos } from "./photos";
import { videos } from "./videos";
import { magazine } from "./magazine";
import { aboutContent } from "./about";

export const portfolioData: PortfolioData = {
  profile,
  socialLinks,
  skills,
  projects,
  experience,
  theme: {
    // Poster/fallback for the live wallpaper below — also what reduced-motion
    // visitors see instead of the video.
    wallpaperUrl: "/background/wallpaper-live-poster.jpg",
    wallpaperVideoUrl: "/background/wallpaper-live.mp4",
    bootLogo: {
      type: "icon", // for image, user image
      value: "Command" // if image, use value to example : /my-custom-logo.png
    }
  },
  playlist,
  notes,
  photos,
  videos,
  magazine,
  about: aboutContent,
};
