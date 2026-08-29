"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import {
  AboutWindow,
  ProjectsWindow,
  SkillsWindow,
  ExperienceWindow,
  MusicWindow,
  TerminalWindow,
  NotesWindow,
  PhotosWindow,
  VideosWindow,
  MagazineWindow,
} from "../desktop/windows";
import {
  AboutApp,
  // ProjectsApp — superseded by FolderApp; still available in mobile/sections.
  SkillsApp,
  ExperienceApp,
  MusicApp,
  TerminalApp,
  NotesApp,
  PhotosApp,
  VideosApp,
  MagazineApp,
  FolderApp,
} from "../mobile/sections";
import { workspaceRoot, PROJECTS_FOLDER_ID } from "@/data/folders";
import { findNode } from "@/lib/folderTree";

/**
 * Component Maps — connect app IDs to their React components.
 *
 * To register a new app:
 * 1. Import your component.
 * 2. Add a key matching the `id` from appRegistry.ts.
 * 3. Provide a factory function that receives PortfolioData.
 */

export const desktopComponentMap: Record<
  string,
  (data: PortfolioData) => React.ReactNode
> = {
  about: (data) => <AboutWindow data={data} />,
  // NOTE: on desktop, "projects" is intercepted by the folder routing in
  // src/data/folders.ts and opens as a folder window instead of this component.
  // Remove its entry from `appFolders` there to get this table back.
  projects: (data) => <ProjectsWindow data={data} />,
  skills: (data) => <SkillsWindow data={data} />,
  experience: (data) => <ExperienceWindow data={data} />,
  music: (data) => <MusicWindow data={data} />,
  terminal: (data) => <TerminalWindow data={data} />,
  notes: (data) => <NotesWindow data={data} />,
  photos: (data) => <PhotosWindow data={data} />,
  videos: (data) => <VideosWindow data={data} />,
  magazine: (data) => <MagazineWindow data={data} />,
};

/**
 * `openApp` lets a section launch another app — folders need it to open the app
 * a tapped entry points at. Sections that don't launch anything ignore it.
 */
export const mobileComponentMap: Record<
  string,
  (data: PortfolioData, openApp: (id: string) => void) => React.ReactNode
> = {
  about: (data) => <AboutApp data={data} />,
  // Mirrors the desktop: Projects is a folder, backed by the same tree.
  projects: (_data, openApp) => (
    <FolderApp node={findNode(workspaceRoot, PROJECTS_FOLDER_ID) ?? workspaceRoot} onOpenApp={openApp} />
  ),
  skills: (data) => <SkillsApp data={data} />,
  experience: (data) => <ExperienceApp data={data} />,
  music: (data) => <MusicApp data={data} />,
  terminal: (data) => <TerminalApp data={data} />,
  notes: (data) => <NotesApp data={data} />,
  photos: (data) => <PhotosApp data={data} />,
  videos: (data) => <VideosApp data={data} />,
  magazine: (data) => <MagazineApp data={data} />,
};
