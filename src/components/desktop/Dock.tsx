"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { appRegistry } from "@/data/appRegistry";
import { resolveIcon } from "@/lib/iconResolver";
import { ICON_FRAME, ICON_FRAME_INTERACTIVE, ICON_STROKE } from "@/lib/iconStyles";
import { setDragPayload } from "@/lib/dragPayload";
import { CAN_REARRANGE } from "@/lib/permissions";
import { FolderItem } from "@/types/portfolio";
import { Folder } from "lucide-react";

export function Dock({
  items,
  dockId,
  onOpenItem,
  onContextMenuItem,
  minimized = [],
  onRestore,
  onDropItem,
}: {
  /** Dock contents, straight from the workspace tree. */
  items: FolderItem[];
  /** Drop-zone id, so things can be dragged back into the dock. */
  dockId: string;
  onOpenItem: (item: FolderItem) => void;
  onContextMenuItem?: (e: React.MouseEvent, item: FolderItem) => void;
  /** Minimised windows, parked in the dock's right-hand section as on macOS. */
  minimized?: { key: string; title: string }[];
  onRestore?: (key: string) => void;
  /** Called when a dock icon is released, so the desktop can resolve a drop. */
  onDropItem?: (clientX: number, clientY: number) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Id of the icon being dragged, so hit-testing can look past it to the zone below.
  const [draggingId, setDraggingId] = useState<string | null>(null);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 select-none">
      <div
        data-drop-folder={dockId}
        className="flex items-end gap-3 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-3xl border border-white/15 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]"
      >
        {items.map((item, index) => {
          const app = item.kind === "app" ? appRegistry.find((a) => a.id === item.appId) : undefined;
          const isHovered = hoveredIndex === index;
          const isNeighbor =
            hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1;

          let scale = 1;
          if (isHovered) scale = 1.4;
          else if (isNeighbor) scale = 1.15;

          return (
            <motion.div
              key={item.id}
              className="relative flex items-center justify-center cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onContextMenu={(e) => onContextMenuItem?.(e, item)}
              // The dock is a folder in the workspace tree, so dragging an icon
              // out of it moves that node rather than leaving a copy behind.
              // Folders sitting in the dock accept drops themselves.
              data-drop-folder={item.kind === "folder" ? item.id : undefined}
              data-dragging={draggingId === item.id || undefined}
              drag={CAN_REARRANGE}
              dragSnapToOrigin
              dragMomentum={false}
              dragElastic={0.15}
              onDragStart={() => {
                setDraggingId(item.id);
                setDragPayload({ kind: "move", itemId: item.id });
              }}
              onDragEnd={(e) => {
                setDraggingId(null);
                const ev = e as PointerEvent;
                onDropItem?.(ev.clientX, ev.clientY);
              }}
              onClick={() => {
                if (app?.externalUrl) {
                  window.open(app.externalUrl, "_blank");
                } else {
                  onOpenItem(item);
                }
              }}
              animate={{ scale, marginBottom: isHovered ? 10 : isNeighbor ? 5 : 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-0 pointer-events-none px-3 py-1 text-sm bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-lg whitespace-nowrap shadow-lg"
                  >
                    {item.name}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={cn(ICON_FRAME, ICON_FRAME_INTERACTIVE, "w-12 h-12")}>
                {item.kind === "folder" ? (
                  <Folder size={24} strokeWidth={ICON_STROKE} />
                ) : app?.isFaIcon ? (
                  <i className={`${app.faClass} text-xl`} aria-hidden="true" />
                ) : (
                  resolveIcon(app?.iconName ?? "", { size: 24, strokeWidth: ICON_STROKE })
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Minimised windows live to the right of a divider, as on macOS, so a
            window without its own dock icon can always be brought back. */}
        {minimized.length > 0 && (
          <>
            <div className="self-stretch w-px bg-white/15 mx-1" />
            {minimized.map((win) => (
              <button
                key={win.key}
                type="button"
                onClick={() => onRestore?.(win.key)}
                title={win.title}
                aria-label={`Restore ${win.title}`}
                className={cn(
                  ICON_FRAME,
                  ICON_FRAME_INTERACTIVE,
                  "w-12 h-12 px-1 cursor-pointer"
                )}
              >
                <span className="text-[9px] leading-tight text-center line-clamp-2 opacity-80">
                  {win.title}
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
