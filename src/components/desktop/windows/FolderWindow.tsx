"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FolderItem } from "@/types/portfolio";
import { appRegistry } from "@/data/appRegistry";
import { resolveIcon } from "@/lib/iconResolver";
import { ICON_FRAME, ICON_FRAME_INTERACTIVE, ICON_STROKE } from "@/lib/iconStyles";
import { setDragPayload } from "@/lib/dragPayload";
import { CAN_EDIT_LAYOUT, CAN_REARRANGE } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { Folder, ClipboardCopy, Check } from "lucide-react";

/** How far the pointer may travel between down and click before we call it a drag. */
const CLICK_SLOP = 5;

function ItemIcon({ item }: { item: FolderItem }) {
  if (item.kind === "folder") {
    return <Folder size={30} strokeWidth={ICON_STROKE} />;
  }
  const app = appRegistry.find((a) => a.id === item.appId);
  return app ? <>{resolveIcon(app.iconName, { size: 30, strokeWidth: ICON_STROKE })}</> : null;
}

/**
 * A Finder-style folder view. Contents come from the live folder tree — folders
 * open another folder window, app entries launch that app. Both are handed back
 * up to the desktop's window manager rather than handled here, so every window
 * lives in one place.
 *
 * While layout editing is on, items can be dragged out into another folder and
 * the whole tree exported as source.
 */
export function FolderWindow({
  node,
  onOpenFolder,
  onOpenApp,
  onDropOnFolder,
  onExport,
  onContextMenuItem,
  onContextMenuBackground,
  renamingId,
  onCommitRename,
  onCancelRename,
}: {
  node: FolderItem;
  onOpenFolder: (node: FolderItem) => void;
  onOpenApp: (appId: string) => void;
  /** Called when a drag is released over this window or one of its folder icons. */
  onDropOnFolder?: (folderId: string, clientX: number, clientY: number) => void;
  onExport?: () => string;
  onContextMenuItem?: (e: React.MouseEvent, item: FolderItem) => void;
  onContextMenuBackground?: (e: React.MouseEvent, folderId: string) => void;
  renamingId?: string | null;
  onCommitRename?: (id: string, name: string) => void;
  onCancelRename?: () => void;
}) {
  const children = node.kind === "folder" ? node.children : [];
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Id of the item currently being dragged, so hit-testing can skip it.
  const [dragging, setDragging] = useState<string | null>(null);
  const downPos = useRef<{ x: number; y: number } | null>(null);

  function open(item: FolderItem) {
    if (item.kind === "folder") onOpenFolder(item);
    else onOpenApp(item.appId);
  }

  async function handleExport() {
    if (!onExport) return;
    const source = onExport();
    try {
      await navigator.clipboard.writeText(source);
    } catch {
      // Clipboard can be blocked; the log is the fallback copy path.
    }
    console.info("[layout export] paste into src/data/folders.ts:\n\n" + source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="flex flex-col h-[calc(100%+3rem)] bg-[var(--win-bg)] -m-6 rounded-b-xl overflow-hidden font-sans select-none"
      onPointerDown={() => setSelected(null)}
    >
      {/* Toolbar */}
      <div className="bg-[var(--win-toolbar)] backdrop-blur-md px-4 py-2 border-b border-[color:var(--win-border)] shrink-0 flex items-center justify-between gap-3">
        <h2 className="text-[color:rgb(var(--win-fg))] font-bold text-sm truncate">{node.name}</h2>
        <div className="flex items-center gap-3 shrink-0">
          {CAN_EDIT_LAYOUT && onExport && (
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1 text-[11px] text-[color:rgb(var(--win-fg)_/_0.45)] hover:text-[color:rgb(var(--win-fg))] transition-colors"
              title="Copy this layout as source for src/data/folders.ts"
            >
              {copied ? <Check size={12} /> : <ClipboardCopy size={12} />}
              {copied ? "Copied" : "Export layout"}
            </button>
          )}
          <span className="text-[color:rgb(var(--win-fg)_/_0.5)] text-xs">
            {children.length} {children.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* The whole content area is a drop target for this folder. */}
      <div
        className="flex-1 overflow-y-auto p-5"
        data-drop-folder={node.id}
        onContextMenu={(e) => onContextMenuBackground?.(e, node.id)}
      >
        {children.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <p className="text-[color:rgb(var(--win-fg)_/_0.35)] text-sm">Empty folder.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4">
            {children.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                // Sub-folders are themselves drop targets, so you can drop
                // straight into a nested folder without opening it first.
                data-drop-folder={item.kind === "folder" ? item.id : undefined}
                data-dragging={dragging === item.id || undefined}
                drag={CAN_REARRANGE}
                dragSnapToOrigin
                dragMomentum={false}
                dragElastic={0.15}
                onDragStart={() => {
                  setDragging(item.id);
                  setDragPayload({ kind: "move", itemId: item.id });
                }}
                onDragEnd={(e) => {
                  setDragging(null);
                  const ev = e as PointerEvent;
                  onDropOnFolder?.("", ev.clientX, ev.clientY);
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[color:rgb(var(--win-fg)_/_0.5)]"
                onContextMenu={(e) => onContextMenuItem?.(e, item)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  downPos.current = { x: e.clientX, y: e.clientY };
                  setSelected(item.id);
                }}
                onClick={(e) => {
                  // Ignore the click that ends a drag gesture.
                  const d = downPos.current;
                  if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > CLICK_SLOP) return;
                  open(item);
                }}
              >
                <span
                  className={cn(
                    ICON_FRAME,
                    ICON_FRAME_INTERACTIVE,
                    "w-[60px] h-[60px]",
                    selected === item.id ? "border-[color:rgb(var(--win-fg)_/_0.7)] bg-[color:rgb(var(--win-fg)_/_0.14)]" : ""
                  )}
                >
                  <ItemIcon item={item} />
                </span>
                {renamingId === item.id ? (
                  <input
                    autoFocus
                    defaultValue={item.name}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={(e) => onCommitRename?.(item.id, e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Enter") onCommitRename?.(item.id, (e.target as HTMLInputElement).value);
                      if (e.key === "Escape") onCancelRename?.();
                    }}
                    // A white field with black text in both themes: this is a text input,
                    // and inheriting the theme foreground would make it dark-on-dark.
                    className="w-full text-[12px] text-center rounded px-1 py-0.5 bg-white text-black outline-none ring-2 ring-[#0060df]"
                  />
                ) : (
                  <span
                    className={cn(
                      "text-[12px] leading-tight text-center px-1.5 py-0.5 rounded",
                      selected === item.id ? "bg-[#0060df] text-[color:rgb(var(--win-fg))]" : "text-[color:rgb(var(--win-fg)_/_0.85)]"
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
