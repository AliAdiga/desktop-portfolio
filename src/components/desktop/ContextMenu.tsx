"use client";

import React, { useEffect, useRef, useState } from "react";

export type MenuItem =
  | { label: string; onSelect: () => void; danger?: boolean; disabled?: boolean }
  | { separator: true };

/**
 * macOS-style right-click menu.
 *
 * Positions itself at the pointer, then nudges back inside the viewport if it
 * would overflow — a menu opened near the right or bottom edge otherwise ends
 * up half off-screen.
 */
export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: Math.min(x, window.innerWidth - r.width - 8),
      y: Math.min(y, window.innerHeight - r.height - 8),
    });
  }, [x, y]);

  useEffect(() => {
    // Capture phase, so a press anywhere else closes the menu before that press
    // does anything to what's underneath. Presses *inside* the menu have to be
    // let through, though: capture runs before the event ever reaches the menu
    // item, so dismissing unconditionally would unmount the button before its
    // click could fire — the menu would open, then every option would no-op.
    const dismiss = (e: Event) => {
      if (ref.current?.contains(e.target as Node)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", dismiss, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", dismiss, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      className="fixed z-[200] min-w-[180px] py-1 rounded-lg bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/15 shadow-2xl select-none"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {items.map((item, i) =>
        "separator" in item ? (
          <div key={i} className="my-1 h-px bg-white/10" />
        ) : (
          <button
            key={i}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              item.onSelect();
              onClose();
            }}
            className={[
              "w-full text-left px-3 py-1.5 text-[13px] transition-colors",
              item.disabled
                ? "text-white/25 cursor-default"
                : item.danger
                  ? "text-red-300 hover:bg-red-500/20"
                  : "text-white/85 hover:bg-white/10",
            ].join(" ")}
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
