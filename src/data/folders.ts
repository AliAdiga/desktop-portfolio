import { FolderItem } from "@/types/portfolio";

export const DESKTOP_ID = "desktop";
export const DOCK_ID = "dock";
export const PROJECTS_FOLDER_ID = "folder-projects";

/**
 * The whole workspace — the single source of truth for what's on the desktop,
 * what's in the dock, and what's inside every folder.
 *
 * The desktop and the dock are both modelled as folders. That's what makes
 * dragging single-instance: moving an icon from the dock to the desktop really
 * moves the one node, instead of leaving a copy behind in the dock. An app can
 * therefore appear in exactly one place at a time.
 *
 * Two kinds of entry:
 *   - `kind: "folder"` — opens a folder window. Its `children` may contain more
 *     folders, so nesting is unlimited and needs no code changes.
 *   - `kind: "app"`    — a launcher. Opening it opens that app's own window;
 *     `appId` must match an `id` in appRegistry.ts.
 *
 * Every `id` must be unique across the whole tree — it keys the open window and
 * the drag-and-drop, so duplicates would collide.
 *
 * NOTE: `showOnDesktop` / `showOnDock` in appRegistry.ts no longer drive either
 * surface — this file does. An app left out of the tree entirely is still
 * reachable through Spotlight search.
 *
 * This whole object is what "Export layout" reproduces, so an arrangement made
 * by dragging can be pasted straight back over it.
 */
export const workspaceRoot: FolderItem = {
  id: "workspace",
  name: "Workspace",
  kind: "folder",
  children: [
    {
      id: DESKTOP_ID,
      name: "Desktop",
      kind: "folder",
      children: [
        { id: "desktop-projects", name: "Projects", kind: "app", appId: "projects" },
        { id: "desktop-demos", name: "Demos", kind: "app", appId: "videos" },
        {
          id: PROJECTS_FOLDER_ID,
          name: "Writing",
          kind: "folder",
          children: [
            { id: "writing-notes", name: "Notes", kind: "app", appId: "notes" },
            { id: "writing-magazine", name: "Magazine", kind: "app", appId: "magazine" },
          ],
        },
      ],
    },
    {
      id: DOCK_ID,
      name: "Dock",
      kind: "folder",
      // Music stays out — it held the template's demo playlist and nothing has
      // replaced it. Add an entry back if you ever want it.
      children: [
        { id: "dock-about", name: "About Me", kind: "app", appId: "about" },
        { id: "dock-skills", name: "Skills", kind: "app", appId: "skills" },
        { id: "dock-experience", name: "Experience", kind: "app", appId: "experience" },
        { id: "dock-photos", name: "Photos", kind: "app", appId: "photos" },
        { id: "dock-terminal", name: "Terminal", kind: "app", appId: "terminal" },
      ],
    },
  ],
};

/**
 * Apps that open as a folder window instead of their own component, mapped to
 * the folder id they open.
 *
 * Keyed by app id from appRegistry.ts. Delete an entry and that app falls
 * straight back to its component in appComponents.tsx — that's the switch for
 * getting the Projects table back instead of the folder view.
 */
export const appFolders: Record<string, string> = {
  // Projects opens ProjectsWindow (real case studies), not a folder view.
  // Map an app id to a folder id here to make it open as a folder instead.
};
