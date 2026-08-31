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
        {
          id: "desktop-videos",
          name: "untitled videos",
          kind: "app",
          appId: "videos",
        },
        {
          id: PROJECTS_FOLDER_ID,
          name: "Projects",
          kind: "folder",
          children: [
            {
              id: "projects-magazine",
              name: "Magazine",
              kind: "app",
              appId: "magazine",
            },
          ],
        },
      ],
    },
    {
      id: DOCK_ID,
      name: "Dock",
      kind: "folder",
      // Skills, Experience, Notes and Music were removed here: they still held
      // the upstream template's demo content (a frontend developer's CV and a
      // post about building the template), which has nothing to do with this
      // client. Their components are untouched — add an entry back once there
      // is real content to put in them.
      children: [
        { id: "dock-about", name: "About Me", kind: "app", appId: "about" },
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
  projects: PROJECTS_FOLDER_ID,
};
