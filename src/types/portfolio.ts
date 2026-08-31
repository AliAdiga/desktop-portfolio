export type SocialLink = {
  platform: string;
  url: string;
  icon: string;
};

export type Skill = {
  name: string;
  category: "Languages" | "Frameworks & Libraries" | "Backend & Database" | "Tools" | "Design" | string;
};

export type Project = {
  id: string;
  title: string;
  /** One or two sentences: what it is, and what you actually built. */
  description: string;
  /** Technologies worth naming. Rendered as chips. */
  techStack: string[];
  thumbnail: string;
  /** Deployed site, if there is one. */
  liveUrl?: string;
  /** Source, if it's public. */
  githubUrl?: string;
  year?: string;
  /** Pin to the top of the list and give it a marker. */
  featured?: boolean;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
};

export type Profile = {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  location: string;
  resumeUrl?: string;
  /** Optional phone number for the "Call me" contact action, e.g. "+1 555 0100". */
  phone?: string;
};

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: string; // e.g. "3:45"
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string; // e.g. "2024-08-05"
  pinned?: boolean;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  location?: string;
  /** Groups photos into an album folder. Photos without one land in "Other". */
  album?: string;
  /** Where the album's work lives, linked from the album header. */
  albumUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  /** Path to the video file, e.g. "/videos/reel-01.mp4". */
  src: string;
  /** Optional thumbnail image. Leave empty for a generated placeholder tile. */
  poster?: string;
  /** Shown on the facing "detail" page in the video book. */
  description?: string;
  /** Optional metadata line, e.g. "2026 · Client Name · Videography". */
  meta?: string;
}

export type MagazinePage =
  | { kind: "cover"; title: string; subtitle?: string; image?: string }
  | { kind: "spread"; heading: string; body: string; image?: string };

/**
 * A node in the desktop folder tree.
 *
 * `folder` nodes nest arbitrarily deep — a folder's children may themselves be
 * folders — so the hierarchy is defined entirely in data (src/data/folders.ts)
 * with no component changes needed to add a level.
 *
 * `app` nodes are launchers: opening one opens that app's own window, using the
 * `appId` to look it up in the app registry.
 */
export type FolderItem =
  | { id: string; name: string; kind: "app"; appId: string }
  | { id: string; name: string; kind: "folder"; children: FolderItem[] };

export interface AboutContent {
  /** A short row of images shown at the top of the "About" intro section. */
  images?: string[];
  whatIDo: string;
  approach: string;
  offerings?: string[];
  awards?: string[];
  clients?: string[];
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  socialLinks: SocialLink[];
  playlist?: Song[];
  notes?: Note[];
  photos?: Photo[];
  videos?: VideoItem[];
  magazine?: MagazinePage[];
  about?: AboutContent;
  theme?: {
    /** Static wallpaper. Also used as the poster/fallback when a live
     *  wallpaper is set — shown on first paint, and permanently for
     *  visitors who prefer reduced motion. */
    wallpaperUrl: string;
    /** Optional looping video wallpaper, e.g. "/background/wallpaper-live.mp4".
     *  Should be muted/silent and reasonably compressed — it decodes
     *  continuously behind the whole UI. */
    wallpaperVideoUrl?: string;
    bootLogo?: {
      type: "icon" | "image";
      value: string;
    };
  };
}
