import { AppDefinition } from "./appRegistry";
import { socialLinks, profile } from "./profile";

// Helper function to map Font Awesome icons to Tailwind colors
function getColorsForPlatform(iconKey: string): { iconColor: string; mobileColor: string } {
  switch (iconKey.toLowerCase()) {
    case "github":
      return { iconColor: "text-white", mobileColor: "bg-[#24292e]" };
    case "linkedin":
      return { iconColor: "text-blue-500", mobileColor: "bg-[#0a66c2]" };
    case "twitter":
    case "x":
      return { iconColor: "text-gray-300", mobileColor: "bg-black" };
    case "instagram":
      return { iconColor: "text-pink-500", mobileColor: "bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]" };
    case "facebook":
      return { iconColor: "text-blue-600", mobileColor: "bg-[#1877F2]" };
    case "youtube":
      return { iconColor: "text-red-500", mobileColor: "bg-[#FF0000]" };
    case "dribbble":
      return { iconColor: "text-pink-400", mobileColor: "bg-[#ea4c89]" };
    case "behance":
      return { iconColor: "text-blue-500", mobileColor: "bg-[#1769ff]" };
    case "figma":
      return { iconColor: "text-purple-400", mobileColor: "bg-black" };
    case "discord":
      return { iconColor: "text-indigo-400", mobileColor: "bg-[#5865F2]" };
    case "tiktok":
    case "threads":
    case "medium":
      return { iconColor: "text-white", mobileColor: "bg-black" };
    case "telegram":
      return { iconColor: "text-blue-400", mobileColor: "bg-[#26A5E4]" };
    case "whatsapp":
      return { iconColor: "text-green-500", mobileColor: "bg-[#25D366]" };
    case "email":
      return { iconColor: "text-white", mobileColor: "bg-red-500" };
    case "website":
      return { iconColor: "text-gray-300", mobileColor: "bg-gray-700" };
    default:
      return { iconColor: "text-gray-400", mobileColor: "bg-gray-600" };
  }
}

// Convert social links into app definitions
export const socialApps: AppDefinition[] = socialLinks.map((link) => {
  const colors = getColorsForPlatform(link.icon);
  
  return {
    id: `social-${link.platform.toLowerCase()}`,
    label: link.platform,
    iconName: "Image", // Fallback (not used when isFaIcon is true)
    isFaIcon: true,
    faClass: `fa-brands fa-${link.icon.toLowerCase()}`,
    externalUrl: link.url,
    iconColor: colors.iconColor,
    mobileColor: colors.mobileColor,
  };
});

// Add email as an app
if (profile.email) {
  socialApps.push({
    id: "social-email",
    label: "Email",
    iconName: "Image", // Fallback
    isFaIcon: true,
    faClass: "fa-solid fa-envelope",
    externalUrl: `mailto:${profile.email}`,
    iconColor: getColorsForPlatform("email").iconColor,
    mobileColor: getColorsForPlatform("email").mobileColor,
  });
}
