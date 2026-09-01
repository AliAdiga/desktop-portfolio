"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Command,
  Wifi,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  BatteryCharging,
  SlidersHorizontal,
  Sun,
  Moon,
} from "lucide-react";
import { ICON_STROKE } from "@/lib/iconStyles";
import { useTheme } from "@/lib/theme";

type BatteryState = { level: number; charging: boolean };

/** Pick the icon that matches the charge, the way the real menu bar does. */
function batteryIcon(state: BatteryState | null) {
  const props = { size: 16, strokeWidth: ICON_STROKE };
  if (!state) return <BatteryFull {...props} />;
  if (state.charging) return <BatteryCharging {...props} />;
  if (state.level > 0.66) return <BatteryFull {...props} />;
  if (state.level > 0.33) return <BatteryMedium {...props} />;
  if (state.level > 0.1) return <BatteryLow {...props} />;
  return <Battery {...props} />;
}

export function MenuBar({
  activeAppName,
  onSearchClick,
}: {
  /** Name of the frontmost window, shown in bold like the active app on macOS. */
  activeAppName?: string | null;
  onSearchClick?: () => void;
}) {
  const [time, setTime] = useState<string | null>(null);
  const [battery, setBattery] = useState<BatteryState | null>(null);
  const { theme, toggle } = useTheme();

  // Rendered only after mount: the server has no clock to agree with, so
  // emitting a time during SSR would guarantee a hydration mismatch.
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // Real charge level where the browser exposes it. Chrome supports this;
  // Firefox and Safari removed it over fingerprinting concerns, so treat it as
  // a bonus and fall back to a full icon rather than depending on it.
  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{
        level: number;
        charging: boolean;
        addEventListener: (t: string, fn: () => void) => void;
        removeEventListener: (t: string, fn: () => void) => void;
      }>;
    };
    if (!nav.getBattery) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    nav.getBattery().then((b) => {
      if (cancelled) return;
      const update = () => setBattery({ level: b.level, charging: b.charging });
      update();
      b.addEventListener("levelchange", update);
      b.addEventListener("chargingchange", update);
      cleanup = () => {
        b.removeEventListener("levelchange", update);
        b.removeEventListener("chargingchange", update);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-7 flex items-center justify-between px-3 z-[60] bg-[var(--desk-panel)] backdrop-blur-xl border-b border-[color:var(--desk-panel-border)] text-[color:var(--desk-text)] text-[13px] select-none">
      {/* Left — mark plus the frontmost window, as macOS shows the active app */}
      <div className="flex items-center gap-3.5">
        <Command size={14} strokeWidth={ICON_STROKE} className="opacity-80" />
        <span className="font-semibold">{activeAppName || "Finder"}</span>
      </div>

      {/* Right — status cluster */}
      <div className="flex items-center gap-3.5">
        <Wifi size={15} strokeWidth={ICON_STROKE} className="opacity-75" />
        <span className="flex items-center gap-1 opacity-75">
          {batteryIcon(battery)}
          {battery && (
            <span className="text-[11px] tabular-nums">{Math.round(battery.level * 100)}%</span>
          )}
        </span>
        <SlidersHorizontal size={14} strokeWidth={ICON_STROKE} className="opacity-75" />
        {/* Theme switch. Shows the theme you'd get, not the one you're in —
            the same way a light switch is labelled by what it does. */}
        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="opacity-75 hover:opacity-100 transition-opacity"
        >
          {theme === "dark" ? (
            <Sun size={14} strokeWidth={ICON_STROKE} />
          ) : (
            <Moon size={14} strokeWidth={ICON_STROKE} />
          )}
        </button>
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search"
          className="opacity-75 hover:opacity-100 transition-opacity"
        >
          <Search size={14} strokeWidth={ICON_STROKE} />
        </button>
        {/* Reserve the width so the bar doesn't jump when the clock appears. */}
        <span className="min-w-[132px] text-right tabular-nums">{time ?? ""}</span>
      </div>
    </div>
  );
}
