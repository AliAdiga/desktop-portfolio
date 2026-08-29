import React from "react";

/**
 * Maps social link icon names (from portfolio data) to Font Awesome class strings.
 * Add new mappings here when new social platforms are added.
 */
const socialIconMap: Record<string, string> = {
  github: "fa-brands fa-github",
  linkedin: "fa-brands fa-linkedin",
  twitter: "fa-brands fa-x-twitter",
  instagram: "fa-brands fa-instagram",
  facebook: "fa-brands fa-facebook",
  youtube: "fa-brands fa-youtube",
  dribbble: "fa-brands fa-dribbble",
  behance: "fa-brands fa-behance",
  figma: "fa-brands fa-figma",
  discord: "fa-brands fa-discord",
  tiktok: "fa-brands fa-tiktok",
  telegram: "fa-brands fa-telegram",
  whatsapp: "fa-brands fa-whatsapp",
  medium: "fa-brands fa-medium",
  email: "fa-solid fa-envelope",
  website: "fa-solid fa-globe",
  threads: "fa-brands fa-threads",
};

/**
 * Renders a Font Awesome social media icon based on the icon key from portfolio data.
 *
 * @param iconKey - The `icon` value from a SocialLink (e.g., "github", "linkedin")
 * @param className - Additional CSS classes for sizing/color
 */
export function SocialIcon({
  iconKey,
  className = "",
}: {
  iconKey: string;
  className?: string;
}) {
  const faClass = socialIconMap[iconKey.toLowerCase()] || "fa-solid fa-link";

  return <i className={`${faClass} ${className}`} aria-hidden="true" />;
}
