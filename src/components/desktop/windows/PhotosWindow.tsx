"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { PortfolioData, Photo } from "@/types/portfolio";
import { Folder, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { ICON_FRAME, ICON_FRAME_INTERACTIVE, ICON_STROKE } from "@/lib/iconStyles";
import { cn } from "@/lib/utils";

type Album = { name: string; url?: string; photos: Photo[] };

/**
 * One leaf of the album book.
 *
 * The paper curl itself belongs to react-pageflip/StPageFlip, which drives the
 * element this ref lands on — the same library the Demos reel uses, so both
 * books turn identically. This component owns only what's printed on the page.
 *
 * Pages are a fixed shape while these captures are not (they run from square
 * to 1:2), so the image is contained and centred rather than cropped to fill.
 * A book has a page size; that is the metaphor, not a bug.
 */
const PhotoPage = React.forwardRef<
  HTMLDivElement,
  { photo: Photo; n: number; eager: boolean }
>(({ photo, n, eager }, ref) => (
    <div ref={ref} className="relative w-full h-full bg-[var(--win-page-to)] overflow-hidden">
      <Image
        src={photo.url}
        alt={photo.title ?? photo.caption}
        fill
        sizes="70vw"
        // Every page is mounted from the start, so left lazy they only begin
        // downloading once turned to — and the page you just turned lands
        // blank while its image arrives. Loading the neighbours means the next
        // page is already there whichever way the reader turns.
        loading={eager ? "eager" : "lazy"}
        className="object-contain p-3"
      />
      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/55 backdrop-blur-md text-[10px] tabular-nums text-[color:rgb(var(--win-fg)_/_0.6)]">
        {String(n).padStart(2, "0")}
      </span>
      {/* Spine shading, so a turned page reads as paper rather than a slide. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/45 to-transparent" />
    </div>
));
PhotoPage.displayName = "PhotoPage";

/**
 * Group photos into albums, preserving declaration order.
 *
 * That order is load-bearing: each album is written as a sequence — origin,
 * then craft, then the ask — so it reads front to back rather than as a pile
 * of screenshots. Reordering src/data/photos.ts reorders the story.
 */
function toAlbums(photos: Photo[]): Album[] {
  const order: string[] = [];
  const byName = new Map<string, Album>();
  for (const p of photos) {
    const name = p.album ?? "Other";
    if (!byName.has(name)) {
      byName.set(name, { name, url: p.albumUrl, photos: [] });
      order.push(name);
    }
    byName.get(name)!.photos.push(p);
  }
  return order.map((n) => byName.get(n)!);
}

export function PhotosWindow({ data }: { data: PortfolioData }) {
  const albums = useMemo(() => toAlbums(data.photos ?? []), [data.photos]);
  const [openAlbum, setOpenAlbum] = useState<string | null>(null);
  // `entry` is the page the book opens at and doubles as the open/closed flag;
  // `index` tracks where the reader has turned to since. Both are indices
  // rather than the photo itself — otherwise there is no "next" to turn to.
  const [entry, setEntry] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  const album = albums.find((a) => a.name === openAlbum) ?? null;
  const photos = album?.photos ?? [];
  const current = entry === null ? null : (photos[index] ?? null);

  const open = useCallback((i: number) => {
    setEntry(i);
    setIndex(i);
  }, []);
  const close = useCallback(() => setEntry(null), []);

  // Turn through the book rather than setting state directly, so the arrows and
  // the keyboard produce the same page curl as dragging the corner does.
  const step = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(photos.length - 1, index + delta));
      if (next !== index) bookRef.current?.pageFlip()?.flip(next);
    },
    [index, photos.length]
  );

  useEffect(() => {
    if (entry === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry, close, step]);

  return (
    <div className="flex flex-col h-[calc(100%+3rem)] bg-[var(--win-bg)] -m-6 rounded-b-xl overflow-hidden font-sans text-[color:rgb(var(--win-fg))] select-none">
      {/* Toolbar doubles as breadcrumb once you're inside an album */}
      <div className="bg-[var(--win-toolbar)] backdrop-blur-md px-4 py-2.5 border-b border-[color:var(--win-border)] shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {album && (
            <button
              type="button"
              onClick={() => {
                setOpenAlbum(null);
                setEntry(null);
              }}
              className="flex items-center gap-0.5 text-[color:rgb(var(--win-fg)_/_0.6)] hover:text-[color:rgb(var(--win-fg))] transition-colors -ml-1"
              aria-label="Back to albums"
            >
              <ChevronLeft size={16} strokeWidth={ICON_STROKE} />
            </button>
          )}
          <h2 className="font-bold text-sm truncate">{album ? album.name : "Photos"}</h2>
          {album?.url && (
            <a
              href={album.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:rgb(var(--win-fg)_/_0.4)] hover:text-[color:rgb(var(--win-fg))] transition-colors shrink-0"
              aria-label={`${album.name} — live site`}
              title="Open the live site"
            >
              <ExternalLink size={13} strokeWidth={ICON_STROKE} />
            </a>
          )}
        </div>
        <span className="text-[color:rgb(var(--win-fg)_/_0.4)] text-xs shrink-0">
          {album
            ? `${album.photos.length} ${album.photos.length === 1 ? "photo" : "photos"}`
            : `${albums.length} ${albums.length === 1 ? "album" : "albums"}`}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {albums.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <p className="text-[color:rgb(var(--win-fg)_/_0.35)] text-sm">No photos yet.</p>
          </div>
        ) : !album ? (
          /* ---- Album folders ---- */
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
            {albums.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => setOpenAlbum(a.name)}
                className="group flex flex-col gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-[color:rgb(var(--win-fg)_/_0.5)] rounded-lg"
              >
                {/* Cover: the album's first photo, with a folder mark over it */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[color:rgb(var(--win-fg)_/_0.1)] group-hover:border-[color:rgb(var(--win-fg)_/_0.3)] transition-colors bg-[color:rgb(var(--win-fg)_/_0.03)]">
                  <Image
                    src={a.photos[0].url}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                  />
                  <span
                    className={cn(
                      ICON_FRAME,
                      ICON_FRAME_INTERACTIVE,
                      "absolute bottom-2 left-2 w-8 h-8 backdrop-blur-md bg-black/40"
                    )}
                  >
                    <Folder size={16} strokeWidth={ICON_STROKE} />
                  </span>
                </div>
                <div className="px-0.5">
                  <p className="text-[13px] font-medium leading-tight">{a.name}</p>
                  <p className="text-[color:rgb(var(--win-fg)_/_0.4)] text-[11px] mt-0.5">
                    {a.photos.length} {a.photos.length === 1 ? "photo" : "photos"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* ---- Inside an album: the contents page ---- */
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {album.photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => open(i)}
                className="group flex flex-col gap-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[color:rgb(var(--win-fg)_/_0.5)] rounded-lg"
              >
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[color:rgb(var(--win-fg)_/_0.1)] group-hover:border-[color:rgb(var(--win-fg)_/_0.3)] transition-colors">
                  <Image
                    src={p.url}
                    alt={p.title ?? p.caption}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  {/* The album is an ordered sequence, so the number says where
                      you are in it — not merely which tile this is. */}
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] tabular-nums text-[color:rgb(var(--win-fg)_/_0.7)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  {p.title && <p className="text-[12px] font-medium leading-tight">{p.title}</p>}
                  <p className="text-[color:rgb(var(--win-fg)_/_0.45)] text-[11px] leading-snug line-clamp-2 mt-0.5">
                    {p.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---- Reader: the album as a book you turn page by page ---- */}
      {album && current && entry !== null && (
        <div
          className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col p-6 gap-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-3 right-3 z-10 text-[color:rgb(var(--win-fg)_/_0.6)] hover:text-[color:rgb(var(--win-fg))] transition-colors"
            aria-label="Close"
          >
            <X size={18} strokeWidth={ICON_STROKE} />
          </button>

          <div
            className="flex-1 w-full max-w-3xl mx-auto min-h-0 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <HTMLFlipBook
              // Keyed on the album and the page it was opened at, so the book is
              // built fresh each time rather than carrying the last album's pages.
              key={`${album.name}-${entry}`}
              ref={bookRef}
              // One page at a time. These are full-page site captures, and a
              // two-page spread both halves the width they can be read at and
              // puts two photos on screen against a single caption.
              //
              // usePortrait only *permits* single-page mode; StPageFlip still
              // picks a spread whenever half the container clears minWidth. So
              // minWidth is deliberately above half of max-w-3xl (768/2 = 384),
              // which is what actually forces one page. Keep the two in step if
              // either changes.
              usePortrait
              width={520}
              height={660}
              size="stretch"
              minWidth={420}
              maxWidth={720}
              minHeight={330}
              maxHeight={900}
              startPage={entry}
              drawShadow
              flippingTime={700}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.5}
              showCover={false}
              mobileScrollSupport={false}
              clickEventForward
              useMouseEvents
              swipeDistance={30}
              showPageCorners
              // Must stay false. When true, StPageFlip gates every flip -- not
              // just clicks -- through a corner-proximity test that flipPrev
              // computes differently from flipNext, so turning back silently
              // stops working.
              disableFlipByClick={false}
              className="drop-shadow-2xl"
              style={{ width: "100%", height: "100%" }}
              onFlip={(e: { data: number }) => setIndex(e.data)}
            >
              {photos.map((p, i) => (
                <PhotoPage key={p.id} photo={p} n={i + 1} eager={Math.abs(i - index) <= 1} />
              ))}
            </HTMLFlipBook>
          </div>

          <div className="shrink-0 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-[color:rgb(var(--win-fg)_/_0.35)] text-[11px] tabular-nums">
              {index + 1} / {photos.length}
            </p>
            {current.title && (
              <p className="text-[color:rgb(var(--win-fg))] text-sm font-medium mt-1">{current.title}</p>
            )}
            <p className="text-[color:rgb(var(--win-fg)_/_0.6)] text-xs max-w-xl mx-auto mt-0.5">{current.caption}</p>
          </div>

          {/* Page turns sit beside the image rather than over it, and stop the
              click from reaching the backdrop's close handler. */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            disabled={index === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[color:rgb(var(--win-fg)_/_0.08)] hover:bg-[color:rgb(var(--win-fg)_/_0.16)] disabled:opacity-25 disabled:hover:bg-[color:rgb(var(--win-fg)_/_0.08)] flex items-center justify-center transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft size={17} strokeWidth={ICON_STROKE} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            disabled={index === photos.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[color:rgb(var(--win-fg)_/_0.08)] hover:bg-[color:rgb(var(--win-fg)_/_0.16)] disabled:opacity-25 disabled:hover:bg-[color:rgb(var(--win-fg)_/_0.08)] flex items-center justify-center transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight size={17} strokeWidth={ICON_STROKE} />
          </button>
        </div>
      )}
    </div>
  );
}
