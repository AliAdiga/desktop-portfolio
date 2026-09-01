"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { MagazinePage, PortfolioData } from "@/types/portfolio";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// One issue page per flip-page — the paper-curl turn (bend, shadow sweep,
// corner peel) is handled by react-pageflip/StPageFlip on the root this ref
// is attached to, same mechanism as the video reels book.
const Page = React.forwardRef<HTMLDivElement, { page: MagazinePage }>(({ page }, ref) => {
  return (
    <div ref={ref} className="relative w-full h-full bg-[var(--win-page-to)] overflow-hidden border border-[color:rgb(var(--win-fg)_/_0.1)]">
      {page.kind === "cover" ? (
        <div className="relative w-full h-full flex items-end p-14">
          {page.image ? (
            <Image src={page.image} alt={page.title} fill sizes="900px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--win-page-from)] to-[var(--win-page-to)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative max-w-xl">
            <h1 className="text-6xl font-bold text-[color:rgb(var(--win-fg))] tracking-tight leading-none">{page.title}</h1>
            {page.subtitle && <p className="text-[color:rgb(var(--win-fg)_/_0.6)] mt-2">{page.subtitle}</p>}
          </div>
          {!page.image && (
            <span className="absolute bottom-6 left-14 text-[color:rgb(var(--win-fg)_/_0.3)] text-[11px]">
              Set a cover image in src/data/magazine.ts
            </span>
          )}
        </div>
      ) : (
        <div className="flex h-full">
          <div className="flex-1 relative bg-gradient-to-br from-[var(--win-page-from)] to-[var(--win-page-to)] flex items-center justify-center">
            {page.image ? (
              <Image src={page.image} alt={page.heading} fill sizes="450px" className="object-cover" />
            ) : (
              <span className="text-[color:rgb(var(--win-fg)_/_0.3)] text-xs px-6 text-center">
                Add an image path in src/data/magazine.ts
              </span>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center px-12 py-8">
            <h2 className="text-3xl font-bold text-[color:rgb(var(--win-fg))] mb-4">{page.heading}</h2>
            <p className="text-[color:rgb(var(--win-fg)_/_0.6)] text-sm leading-relaxed max-w-[46ch]">{page.body}</p>
          </div>
        </div>
      )}
    </div>
  );
});
Page.displayName = "Page";

export function MagazineWindow({ data }: { data: PortfolioData }) {
  const pages = data.magazine || [];
  const [activeIndex, setActiveIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  const flipTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(pages.length - 1, i));
      bookRef.current?.pageFlip()?.flip(clamped);
    },
    [pages.length]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") flipTo(activeIndex + 1);
      if (e.key === "ArrowLeft") flipTo(activeIndex - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, flipTo]);

  const handleFlip = useCallback((e: { data: number }) => {
    setActiveIndex(e.data);
  }, []);

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[color:rgb(var(--win-fg)_/_0.4)] text-sm">No magazine pages yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100%+3rem)] bg-[var(--win-bg)] -m-6 rounded-b-xl overflow-hidden relative">
      <div className="flex-1 flex items-center justify-center p-6 min-h-0">
        <HTMLFlipBook
          ref={bookRef}
          width={700}
          height={460}
          size="stretch"
          // minWidth is deliberately larger than half of this window's
          // available width, so blockWidth < minWidth*2 always holds and
          // StPageFlip stays in single-page (portrait) mode — each array
          // entry is a self-contained page, not a left/right half.
          minWidth={560}
          maxWidth={900}
          minHeight={320}
          maxHeight={620}
          startPage={0}
          drawShadow
          flippingTime={800}
          usePortrait
          startZIndex={0}
          autoSize={false}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport={false}
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false}
          className="drop-shadow-2xl"
          style={{ width: "100%", height: "100%" }}
          onFlip={handleFlip}
        >
          {pages.map((page, i) => (
            <Page key={i} page={page} />
          ))}
        </HTMLFlipBook>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-center gap-5 py-3 bg-[var(--win-bg-alt)] shrink-0">
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-[color:rgb(var(--win-fg)_/_0.06)] hover:bg-[color:rgb(var(--win-fg)_/_0.14)] disabled:opacity-30 disabled:hover:bg-[color:rgb(var(--win-fg)_/_0.06)] flex items-center justify-center text-[color:rgb(var(--win-fg))] transition-colors"
          disabled={activeIndex === 0}
          onClick={() => flipTo(activeIndex - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        <div className="flex gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => flipTo(i)}
              aria-label={`Page ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIndex ? "bg-[color:rgb(var(--win-fg))] scale-125" : "bg-[color:rgb(var(--win-fg)_/_0.25)]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-[color:rgb(var(--win-fg)_/_0.06)] hover:bg-[color:rgb(var(--win-fg)_/_0.14)] disabled:opacity-30 disabled:hover:bg-[color:rgb(var(--win-fg)_/_0.06)] flex items-center justify-center text-[color:rgb(var(--win-fg))] transition-colors"
          disabled={activeIndex === pages.length - 1}
          onClick={() => flipTo(activeIndex + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
