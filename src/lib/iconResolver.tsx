"use client";

import React from "react";
import {
  User,
  Folder,
  Cpu,
  BarChart3,
  Briefcase,
  Music,
  Terminal,
  StickyNote,
  FileText,
  Image as ImageIcon,
  Camera,
  BookOpen,
  Code2,
  Settings,
  FolderGit2,
  Command,
  HeartHandshake,
  Mail,
} from "lucide-react";
import { VideoFolderIcon } from "./customIcons";

/**
 * Maps icon name strings to Lucide React components — one consistent
 * thin-line icon language across every app, matching the standard
 * Feather/Lucide vocabulary.
 * Extend this map when you add a new AppIconName.
 */
const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
> = {
  User,
  Folder,
  Cpu,
  BarChart3,
  Briefcase,
  Music,
  Terminal,
  StickyNote,
  FileText,
  Image: ImageIcon,
  Camera,
  Film: VideoFolderIcon,
  BookOpen,
  // Available for future apps:
  Code2,
  Settings,
  FolderGit2,
  Command,
  HeartHandshake,
  Mail,
};

/**
 * Resolve a string icon name to a rendered React element.
 *
 * @param name  - One of the AppIconName values
 * @param props - Props forwarded to the Lucide icon (size, className, etc.)
 */
export function resolveIcon(
  name: string,
  props?: { size?: number; className?: string; strokeWidth?: number }
): React.ReactNode {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
