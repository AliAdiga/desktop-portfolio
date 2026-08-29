"use client";

import React, { useState } from "react";
import { FolderItem } from "@/types/portfolio";
import { appRegistry } from "@/data/appRegistry";
import { resolveIcon } from "@/lib/iconResolver";
import { ICON_FRAME, ICON_STROKE } from "@/lib/iconStyles";
import { ChevronLeft, Folder } from "lucide-react";

function ItemIcon({ item }: { item: FolderItem }) {
  if (item.kind === "folder") return <Folder size={28} strokeWidth={ICON_STROKE} />;
  const app = appRegistry.find((a) => a.id === item.appId);
  return app ? <>{resolveIcon(app.iconName, { size: 28, strokeWidth: ICON_STROKE })}</> : null;
}

/**
 * Mobile counterpart to FolderWindow, so the same folder tree backs both views.
 *
 * Phones have no windows to stack, so sub-folders are navigated in place with a
 * back stack — the iOS Files pattern — rather than opening alongside.
 */
export function FolderApp({
  node,
  onOpenApp,
}: {
  node: FolderItem;
  onOpenApp: (appId: string) => void;
}) {
  const [stack, setStack] = useState<FolderItem[]>([node]);
  const current = stack[stack.length - 1];
  const children = current.kind === "folder" ? current.children : [];

  return (
    <div className="text-white select-none">
      <div className="flex items-center gap-2 mb-5">
        {stack.length > 1 && (
          <button
            type="button"
            onClick={() => setStack((s) => s.slice(0, -1))}
            className="flex items-center gap-0.5 text-white/70 hover:text-white -ml-1 text-sm"
            aria-label="Back"
          >
            <ChevronLeft size={18} />
            {stack[stack.length - 2].name}
          </button>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-1">{current.name}</h1>
      <p className="text-white/45 text-xs mb-6">
        {children.length} {children.length === 1 ? "item" : "items"}
      </p>

      {children.length === 0 ? (
        <p className="text-white/35 text-sm">Empty folder.</p>
      ) : (
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {children.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                item.kind === "folder"
                  ? setStack((s) => [...s, item])
                  : onOpenApp(item.appId)
              }
              className="flex flex-col items-center gap-1.5 tap-highlight-transparent active:scale-90 transition-transform"
            >
              <span className={`${ICON_FRAME} w-[60px] h-[60px]`}>
                <ItemIcon item={item} />
              </span>
              <span className="text-white font-medium text-[11px] leading-tight text-center drop-shadow-md">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
