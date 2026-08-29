import React from "react";
import { Wallpaper } from "./shared/Wallpaper";

// We will use CSS classes (hidden lg:block / block lg:hidden) to handle responsive layout
// This prevents SSR hydration mismatches and is better for SEO as both DOMs are present.
// Alternatively, if the tree is too heavy, we could conditionally render, but for a portfolio this is fine.

export function ResponsiveLayout({
  desktopView,
  mobileView,
}: {
  desktopView: React.ReactNode;
  mobileView: React.ReactNode;
}) {
  return (
    <main className="relative w-full h-[100dvh] flex flex-col selection:bg-white/30">
      <Wallpaper />
      
      {/* Mobile / Tablet View (0px - 1023px) */}
      <div className="lg:hidden flex-1 w-full relative">
        {mobileView}
      </div>

      {/* Desktop View (1024px+) */}
      <div className="hidden lg:block flex-1 w-full relative">
        {desktopView}
      </div>
    </main>
  );
}
