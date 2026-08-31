"use client";

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { FolderItem, PortfolioData } from "@/types/portfolio";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { MacWindow } from "./MacWindow";
import { FolderWindow } from "./windows";
import { appRegistry } from "@/data/appRegistry";
import { appFolders, workspaceRoot, DESKTOP_ID, DOCK_ID } from "@/data/folders";
import {
  findNode,
  moveNode,
  renameNode,
  removeNode,
  createFolder,
  serializeFolder,
} from "@/lib/folderTree";
import { takeDragPayload, folderIdAtPoint, setDragPayload } from "@/lib/dragPayload";
import { Folder } from "lucide-react";
import { ContextMenu, type MenuItem } from "./ContextMenu";
import { CAN_EDIT_LAYOUT } from "@/lib/permissions";
import { desktopComponentMap } from "../shared/appComponents";
import { resolveIcon } from "@/lib/iconResolver";
import { ICON_FRAME, ICON_FRAME_INTERACTIVE, ICON_STROKE } from "@/lib/iconStyles";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpotlightSearch } from "../shared/SpotlightSearch";
import { WorkIcon } from "./WorkIcon";
import { WorkViewer } from "./WorkViewer";
import { buildWorkItems, type WorkItem } from "@/lib/workItems";
import { scatterPosition } from "@/lib/scatter";

// Client wants a minimal launch: just the one "untitled videos" folder icon,
// not each video scattered individually. Flip this back to true once
// they're ready to add more icons.
const SHOW_INDIVIDUAL_WORK_ICONS = false;

/** How far the pointer may travel between press and release before it counts as a drag. */
const CLICK_SLOP = 5;

/** Per-window cascade step, so stacked windows stay individually grabbable. */
const CASCADE_X = 28;
const CASCADE_Y = 24;

/**
 * An open window. Apps are keyed by app id and folders by folder-node id, both
 * namespaced so an app and a folder can never collide on the same key. Array
 * order is stacking order — last is frontmost.
 */
type OpenWindow = { minimized?: boolean } & (
  | { key: string; kind: "app"; appId: string; title: string }
  | { key: string; kind: "folder"; folderId: string }
);

function folderWindow(folderId: string): OpenWindow {
  return { key: `folder:${folderId}`, kind: "folder", folderId };
}

/** Resolve an app id to the window it should open, or null if it has none. */
function windowForApp(appId: string): OpenWindow | null {
  // Some apps are folders rather than a single view (see src/data/folders.ts).
  const folderId = appFolders[appId];
  if (folderId) return folderWindow(folderId);

  if (!desktopComponentMap[appId]) return null;
  const app = appRegistry.find((a) => a.id === appId);
  return app ? { key: `app:${appId}`, kind: "app", appId, title: app.label } : null;
}

interface DesktopIconProps {
  item: FolderItem;
  onOpen: (item: FolderItem) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDrop: (clientX: number, clientY: number) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  isRenaming: boolean;
  onCommitRename: (name: string) => void;
  onCancelRename: () => void;
}

function DesktopIcon({
  item,
  onOpen,
  selectedId,
  onSelect,
  onDrop,
  onContextMenu,
  isRenaming,
  onCommitRename,
  onCancelRename,
}: DesktopIconProps) {
  const isSelected = selectedId === item.id;
  // Framer still fires a click after a drag finishes. Comparing the pointer's
  // travel between press and release tells the two apart, so dragging an icon
  // repositions it without also opening it.
  const downPos = useRef<{ x: number; y: number } | null>(null);
  // Marks this icon as the drag source so hit-testing looks past it.
  const [dragging, setDragging] = useState(false);

  const app = item.kind === "app" ? appRegistry.find((a) => a.id === item.appId) : undefined;

  return (
    <motion.div
      drag
      // Folders on the desktop accept drops themselves, so you can drop
      // straight onto a folder icon without opening it.
      data-drop-folder={item.kind === "folder" ? item.id : undefined}
      data-dragging={dragging || undefined}
      // No dragConstraints here on purpose. Passing the desktop ref makes
      // Framer measure the constraint box on mount and "correct" each icon
      // into it — but these icons live in an absolutely-positioned flex
      // column, so that correction translated them hundreds of pixels and
      // stacked them all on top of each other in the middle of the screen.
      dragMomentum={false}
      onContextMenu={onContextMenu}
      onDragStart={() => {
        setDragging(true);
        setDragPayload({ kind: "move", itemId: item.id });
      }}
      onDragEnd={(e) => {
        setDragging(false);
        const ev = e as PointerEvent;
        onDrop(ev.clientX, ev.clientY);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        downPos.current = { x: e.clientX, y: e.clientY };
        onSelect(item.id);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const down = downPos.current;
        if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > CLICK_SLOP) return;
        if (app?.externalUrl) {
          window.open(app.externalUrl, "_blank");
        } else {
          onOpen(item);
        }
      }}
      className="flex flex-col items-center gap-1 w-20 cursor-pointer z-10 select-none"
      initial={false}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={cn(
          ICON_FRAME,
          ICON_FRAME_INTERACTIVE,
          "w-[60px] h-[60px]",
          isSelected ? "border-white/70 bg-white/[0.14]" : ""
        )}
      >
        {item.kind === "folder" ? (
          <Folder size={30} strokeWidth={ICON_STROKE} />
        ) : app?.isFaIcon ? (
          <i className={`${app.faClass} text-3xl`} aria-hidden="true" />
        ) : (
          resolveIcon(app?.iconName ?? "", { size: 30, strokeWidth: ICON_STROKE })
        )}
      </div>
      {isRenaming ? (
        <input
          autoFocus
          defaultValue={item.name}
          onPointerDown={(e) => e.stopPropagation()}
          onBlur={(e) => onCommitRename(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") onCommitRename((e.target as HTMLInputElement).value);
            if (e.key === "Escape") onCancelRename();
          }}
          className="w-[76px] text-[13px] text-center rounded px-1 py-0.5 bg-white text-black outline-none ring-2 ring-[#0060df]"
        />
      ) : (
        <span
          className={cn(
            "text-[13px] font-medium px-2 py-0.5 rounded text-center transition-colors leading-tight",
            isSelected ? "bg-[#0060df] text-white" : "text-white bg-transparent"
          )}
          style={{
            textShadow: isSelected ? "none" : "0 1px 3px rgba(0,0,0,0.8)",
          }}
        >
          {item.name}
        </span>
      )}
    </motion.div>
  );
}

export function DesktopView({ data, initialApp }: { data: PortfolioData; initialApp?: string | null }) {
  // A deep link (/videos, /projects, …) is initial state, not a side effect.
  const [windows, setWindows] = useState<OpenWindow[]>(() => {
    const initial = initialApp ? windowForApp(initialApp) : null;
    return initial ? [initial] : [];
  });
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeWork, setActiveWork] = useState<WorkItem | null>(null);

  // The live workspace tree. Session state on purpose: the shipped structure is
  // whatever's in src/data/folders.ts, and "Export layout" is how an
  // arrangement made by dragging gets back into that file. Persisting to
  // localStorage instead would show you a layout your visitors never see.
  const [tree, setTree] = useState<FolderItem>(workspaceRoot);
  const [past, setPast] = useState<FolderItem[]>([]);
  const [future, setFuture] = useState<FolderItem[]>([]);

  const [menu, setMenu] = useState<{ x: number; y: number; items: MenuItem[] } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  /**
   * Every tree mutation goes through here so it lands on the undo stack.
   * No-op changes (a move that resolves to where the item already was) return
   * the same object and are dropped, keeping undo free of empty steps.
   */
  const applyToTree = useCallback((fn: (t: FolderItem) => FolderItem) => {
    setTree((prev) => {
      const next = fn(prev);
      if (next === prev) return prev;
      setPast((p) => [...p, prev]);
      setFuture([]);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1];
      setTree((current) => {
        setFuture((f) => [current, ...f]);
        return previous;
      });
      return p.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setTree((current) => {
        setPast((p) => [...p, current]);
        return next;
      });
      return f.slice(1);
    });
  }, []);

  const desktopRef = useRef<HTMLDivElement>(null);

  // Individual videos/photos, scattered as their own desktop icons.
  const workItems = useMemo(() => buildWorkItems(data), [data]);

  /** Move a window to the end of the array, i.e. to the front of the stack. */
  const focusWindow = useCallback((key: string) => {
    setWindows((prev) => {
      const i = prev.findIndex((w) => w.key === key);
      if (i === -1 || i === prev.length - 1) return prev;
      const next = [...prev];
      const [win] = next.splice(i, 1);
      next.push(win);
      return next;
    });
  }, []);

  /** Open a window, or un-minimise and focus it if it's already open. */
  const addWindow = useCallback((win: OpenWindow) => {
    setWindows((prev) => {
      const i = prev.findIndex((w) => w.key === win.key);
      if (i === -1) return [...prev, win];
      const next = [...prev];
      const [existing] = next.splice(i, 1);
      next.push({ ...existing, minimized: false });
      return next;
    });
  }, []);

  const minimizeWindow = useCallback((key: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.key === key ? { ...w, minimized: true } : w))
    );
  }, []);

  const openFolder = useCallback(
    (node: FolderItem) => addWindow(folderWindow(node.id)),
    [addWindow]
  );

  /**
   * Resolve a released drag against whatever drop zone is under the pointer.
   *
   * Always a move, never a copy — the dock is part of the same tree, so
   * dragging an icon out of it relocates the one node rather than leaving a
   * duplicate behind. A release over empty space discards the payload.
   */
  const handleDrop = useCallback(
    (clientX: number, clientY: number) => {
      const payload = takeDragPayload();
      if (!payload) return;
      const folderId = folderIdAtPoint(clientX, clientY);
      if (!folderId) return;
      applyToTree((prev) => moveNode(prev, payload.itemId, folderId));
    },
    [applyToTree]
  );

  const openApp = useCallback(
    (appId: string | null) => {
      if (!appId) return;
      const win = windowForApp(appId);
      if (win) addWindow(win);
    },
    [addWindow]
  );

  const closeWindow = useCallback((key: string) => {
    setWindows((prev) => prev.filter((w) => w.key !== key));
  }, []);

  const handleDesktopClick = () => {
    setSelectedIcon(null);
  };

  /**
   * Menu for a right-click on an icon.
   *
   * Everyone gets Open, plus Undo for their own dragging. Renaming, creating
   * and deleting are structural edits, so they're limited to CAN_EDIT_LAYOUT.
   */
  const itemMenu = useCallback(
    (item: FolderItem): MenuItem[] => {
      const items: MenuItem[] = [
        {
          label: "Open",
          onSelect: () => (item.kind === "folder" ? openFolder(item) : openApp(item.appId)),
        },
      ];
      if (CAN_EDIT_LAYOUT) {
        items.push(
          { separator: true },
          { label: "Rename", onSelect: () => setRenamingId(item.id) },
          {
            label: "New Folder Inside",
            disabled: item.kind !== "folder",
            onSelect: () => applyToTree((t) => createFolder(t, item.id).tree),
          },
          { separator: true },
          {
            label: "Remove",
            danger: true,
            onSelect: () => applyToTree((t) => removeNode(t, item.id)),
          }
        );
      } else {
        items.push(
          { separator: true },
          { label: "Undo Move", disabled: past.length === 0, onSelect: undo }
        );
      }
      return items;
    },
    [applyToTree, openApp, openFolder, past.length, undo]
  );

  /** Menu for a right-click on empty space in a container. */
  const containerMenu = useCallback(
    (folderId: string): MenuItem[] => {
      const items: MenuItem[] = [];
      if (CAN_EDIT_LAYOUT) {
        items.push(
          { label: "New Folder", onSelect: () => applyToTree((t) => createFolder(t, folderId).tree) },
          { separator: true }
        );
      }
      items.push(
        { label: "Undo", disabled: past.length === 0, onSelect: undo },
        { label: "Redo", disabled: future.length === 0, onSelect: redo }
      );
      return items;
    },
    [applyToTree, past.length, future.length, undo, redo]
  );

  const openMenu = useCallback((e: React.MouseEvent, items: MenuItem[]) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, items });
  }, []);

  const commitRename = useCallback(
    (id: string, name: string) => {
      setRenamingId(null);
      applyToTree((t) => renameNode(t, id, name));
    },
    [applyToTree]
  );

  // Cmd/Ctrl+Z to undo, Shift to redo — the shortcut people reach for first.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      if (renamingId) return; // let the rename field handle its own undo
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, renamingId]);

  // Frontmost visible window — the only one that renders as focused, and the
  // name the menu bar shows as the active app.
  const frontmost = [...windows].reverse().find((w) => !w.minimized) ?? null;
  const frontmostKey = frontmost?.key ?? null;
  const frontmostName = frontmost
    ? frontmost.kind === "app"
      ? frontmost.title
      : findNode(tree, frontmost.folderId)?.name ?? null
    : null;
  const minimizedWindows = windows.filter((w) => w.minimized);

  // Desktop and dock are both folders in the tree, so their icons are simply
  // those folders' children — which is what makes a drag between them a move.
  const asFolder = (id: string) =>
    (findNode(tree, id) as Extract<FolderItem, { kind: "folder" }> | null)?.children ?? [];
  const desktopItems = asFolder(DESKTOP_ID);
  const dockItems = asFolder(DOCK_ID);

  return (
    <div className="w-full h-full relative overflow-hidden font-sans">
      <MenuBar activeAppName={frontmostName} onSearchClick={() => setIsSearchOpen(true)} />

      {/* Spotlight Search Overlay */}
      <SpotlightSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onOpenApp={(id) => {
          openApp(id);
          setIsSearchOpen(false);
        }}
      />
      
      {/* Desktop Area — also the root folder's drop zone, so items dragged out
          of a folder and released on empty space get filed onto the desktop. */}
      <div
        ref={desktopRef}
        data-drop-folder={DESKTOP_ID}
        className="pt-8 h-[calc(100vh-80px)] relative w-full flex items-center justify-center"
        onPointerDown={handleDesktopClick}
        onContextMenu={(e) => openMenu(e, containerMenu(DESKTOP_ID))}
      >
        
        {/* Desktop Icons Layer — flows top-to-bottom, then wraps right-to-left (macOS style) */}
        <div className="absolute top-12 right-6 bottom-24 flex flex-col flex-wrap-reverse content-start gap-4 pointer-events-auto">
          {desktopItems.map((item) => (
            <DesktopIcon
              key={item.id}
              item={item}
              onOpen={(it) => (it.kind === "folder" ? openFolder(it) : openApp(it.appId))}
              selectedId={selectedIcon}
              onSelect={setSelectedIcon}
              onDrop={handleDrop}
              onContextMenu={(e) => openMenu(e, itemMenu(item))}
              isRenaming={CAN_EDIT_LAYOUT && renamingId === item.id}
              onCommitRename={(name) => commitRename(item.id, name)}
              onCancelRename={() => setRenamingId(null)}
            />
          ))}
        </div>

        {/* Work Items Layer — each video/photo scattered as its own icon */}
        {SHOW_INDIVIDUAL_WORK_ICONS && workItems.map((item, i) => {
          const { xPct, yPct } = scatterPosition(i, item.id);
          return (
            <WorkIcon
              key={item.id}
              item={item}
              xPct={xPct}
              yPct={yPct}
              isSelected={selectedIcon === item.id}
              onSelect={setSelectedIcon}
              onOpen={setActiveWork}
              constraintsRef={desktopRef}
            />
          );
        })}

        {/* Windows Layer — one absolutely-positioned centring layer per open
            window. Array order is stacking order, so the last one is on top. */}
        {windows.map((win, i) => {
          if (win.minimized) return null;
          const app = win.kind === "app" ? appRegistry.find((a) => a.id === win.appId) : undefined;
          // Folder windows read the live tree, so one that's open updates the
          // instant something is dragged into it.
          const folderNode = win.kind === "folder" ? findNode(tree, win.folderId) : null;
          if (win.kind === "folder" && !folderNode) return null;
          return (
            <div
              key={win.key}
              className="absolute inset-0 flex items-center justify-center pointer-events-none p-8"
              style={{ zIndex: 50 + i }}
              onPointerDownCapture={() => focusWindow(win.key)}
            >
              <MacWindow
                title={win.kind === "app" ? win.title : folderNode!.name}
                isFocused={win.key === frontmostKey}
                onClose={() => closeWindow(win.key)}
                onMinimize={() => minimizeWindow(win.key)}
                constraintsRef={desktopRef}
                offset={{ x: i * CASCADE_X, y: i * CASCADE_Y }}
                className={cn(
                  "w-full",
                  app?.windowSize?.maxWidth || "max-w-3xl",
                  app?.windowSize?.height || "h-[500px]"
                )}
              >
                {win.kind === "app" ? (
                  desktopComponentMap[win.appId](data)
                ) : (
                  <FolderWindow
                    node={folderNode!}
                    onOpenFolder={openFolder}
                    onOpenApp={openApp}
                    onDropOnFolder={(_id, x, y) => handleDrop(x, y)}
                    onContextMenuItem={(e, it) => openMenu(e, itemMenu(it))}
                    onContextMenuBackground={(e, folderId) => openMenu(e, containerMenu(folderId))}
                    renamingId={CAN_EDIT_LAYOUT ? renamingId : null}
                    onCommitRename={commitRename}
                    onCancelRename={() => setRenamingId(null)}
                    // Exports the entire tree, matching the shape of desktopRoot in folders.ts.
                    onExport={() => serializeFolder(tree)}
                  />
                )}
              </MacWindow>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none z-30">
         <div className="pointer-events-auto">
           <Dock
             items={dockItems}
             dockId={DOCK_ID}
             onOpenItem={(it) => (it.kind === "folder" ? openFolder(it) : openApp(it.appId))}
             onContextMenuItem={(e, it) => openMenu(e, itemMenu(it))}
             onDropItem={handleDrop}
             minimized={minimizedWindows.map((w) => ({
               key: w.key,
               title: w.kind === "app" ? w.title : findNode(tree, w.folderId)?.name ?? "Folder",
             }))}
             onRestore={(key) => {
               setWindows((prev) => {
                 const i = prev.findIndex((w) => w.key === key);
                 if (i === -1) return prev;
                 const next = [...prev];
                 const [win] = next.splice(i, 1);
                 next.push({ ...win, minimized: false });
                 return next;
               });
             }}
           />
         </div>
      </div>

      <WorkViewer item={activeWork} onClose={() => setActiveWork(null)} />

      {menu && (
        <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={() => setMenu(null)} />
      )}
    </div>
  );
}
