"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { portfolioData } from "@/data/portfolio";
import { useTheme } from "@/lib/theme";

interface WallpaperProps {
  className?: string;
}

export function Wallpaper({ className }: WallpaperProps) {
  const { theme } = useTheme();
  const t = portfolioData.theme;

  // Each theme brings its own wallpaper. Light falls back to the dark pair if
  // no light wallpaper is configured, so the desktop is never left bare.
  const light = theme === "light";
  const wallpaperSrc =
    (light ? t?.wallpaperLightUrl : undefined) ?? t?.wallpaperUrl ?? "/background/bg.png";
  const videoSrc = light ? t?.wallpaperLightVideoUrl : t?.wallpaperVideoUrl;

  // Start with motion off so the server and first client render agree (no
  // hydration mismatch), then opt in once we've checked the user's setting.
  const [allowMotion, setAllowMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoSrc) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAllowMotion(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [videoSrc]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !allowMotion) return;
    // Autoplay can be refused, and browsers suspend playback while the tab is
    // hidden — in both cases the frozen frame is the poster, which matches the
    // still below it, so there's nothing to handle beyond ignoring the reject.
    el.play().catch(() => {});
  }, [allowMotion]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[-1] overflow-hidden bg-[var(--background)]",
        className
      )}
    >
      {/* Still wallpaper: paints immediately, and is the only layer for
          reduced-motion visitors or if the video fails to load. */}
      <div className="absolute inset-0">
        <Image
          src={wallpaperSrc}
          alt="Wallpaper"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Deliberately not opacity-gated on a JS event: the video carries the
          same frame as its poster, so it can render immediately without a
          flash, and there's no way for it to get stranded invisible. */}
      {allowMotion && videoSrc && !failed && (
        <video
          // Keyed on the source so switching theme mounts a fresh element.
          // Swapping `src` on a playing <video> leaves the previous frames on
          // screen until the new file buffers, which shows as the old wallpaper
          // lingering over the new one for a beat.
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          poster={wallpaperSrc}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Subtle overlay — dark in dark theme, a light haze in light theme, so
          the chrome sitting on top keeps its contrast either way. */}
      <div className="absolute inset-0 bg-[var(--wallpaper-scrim)]" />
    </div>
  );
}
