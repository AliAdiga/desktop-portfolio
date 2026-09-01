"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ICON_STROKE } from "@/lib/iconStyles";

const SEEN_KEY = "desktop-hint-seen";

/**
 * One-time nudge telling a first-time visitor the desktop is interactive.
 *
 * A desktop metaphor is delightful once you understand it and completely
 * opaque for the first few seconds: nothing on screen says the icons open,
 * drag, or that the dock does anything. Visitors who don't work that out leave
 * having seen a wallpaper. This is the cheapest fix for the site's single
 * biggest usability risk.
 *
 * Shown once and then never again. Storage throws in some privacy modes, so
 * both the read and the write are guarded — the worst case there is a returning
 * visitor seeing the hint twice, which is far better than it failing closed and
 * never showing at all.
 *
 * Deliberately delayed: appearing instantly reads as a cookie banner and gets
 * dismissed reflexively. A beat after the desktop settles, it reads as help.
 */
export function FirstRunHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Blocked storage — treat as unseen and show it.
    }
    if (seen) return;
    const id = setTimeout(() => setShow(true), 1400);
    return () => clearTimeout(id);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Not remembering it is acceptable; failing the dismissal is not.
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          // Sits above the dock rather than over the icons it is describing.
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[55] max-w-[min(92vw,26rem)]"
          role="status"
        >
          <div className="flex items-start gap-3 pl-4 pr-2.5 py-3 rounded-xl bg-[var(--desk-panel-strong)] backdrop-blur-2xl border border-[color:var(--desk-panel-border)] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)] text-[color:var(--desk-text)]">
            <div className="text-[13px] leading-relaxed">
              <p className="font-semibold text-[color:var(--desk-text-strong)] mb-0.5">
                This is a desktop — try it.
              </p>
              <p className="opacity-80">
                Double-click the icons to open windows, drag them anywhere, and
                open several at once. The Terminal takes commands.
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="shrink-0 mt-0.5 p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-[color:var(--desk-panel-border)] transition-opacity"
            >
              <X size={14} strokeWidth={ICON_STROKE} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
