"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PortfolioData, Photo } from "@/types/portfolio";
import { Folder, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { ICON_FRAME, ICON_FRAME_INTERACTIVE, ICON_STROKE } from "@/lib/iconStyles";
import { cn } from "@/lib/utils";

type Album = { name: string; url?: string; photos: Photo[] };

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
  // An index, not the photo itself — otherwise there is no "next" to go to and
  // the only way out of a page is back to the grid.
  const [index, setIndex] = useState<number | null>(null);

  const album = albums.find((a) => a.name === openAlbum) ?? null;
  const photos = album?.photos ?? [];
  const current = index === null ? null : (photos[index] ?? null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : Math.max(0, Math.min(photos.length - 1, i + delta)))),
    [photos.length]
  );

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, step]);

  return (
    <div className="flex flex-col h-[calc(100%+3rem)] bg-[#161616] -m-6 rounded-b-xl overflow-hidden font-sans text-white select-none">
      {/* Toolbar doubles as breadcrumb once you're inside an album */}
      <div className="bg-[#2d2d2d]/90 backdrop-blur-md px-4 py-2.5 border-b border-black/20 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {album && (
            <button
              type="button"
              onClick={() => {
                setOpenAlbum(null);
                setIndex(null);
              }}
              className="flex items-center gap-0.5 text-white/60 hover:text-white transition-colors -ml-1"
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
              className="text-white/40 hover:text-white transition-colors shrink-0"
              aria-label={`${album.name} — live site`}
              title="Open the live site"
            >
              <ExternalLink size={13} strokeWidth={ICON_STROKE} />
            </a>
          )}
        </div>
        <span className="text-white/40 text-xs shrink-0">
          {album
            ? `${album.photos.length} ${album.photos.length === 1 ? "photo" : "photos"}`
            : `${albums.length} ${albums.length === 1 ? "album" : "albums"}`}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {albums.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <p className="text-white/35 text-sm">No photos yet.</p>
          </div>
        ) : !album ? (
          /* ---- Album folders ---- */
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
            {albums.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => setOpenAlbum(a.name)}
                className="group flex flex-col gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
              >
                {/* Cover: the album's first photo, with a folder mark over it */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors bg-white/[0.03]">
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
                  <p className="text-white/40 text-[11px] mt-0.5">
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
                onClick={() => setIndex(i)}
                className="group flex flex-col gap-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
              >
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
                  <Image
                    src={p.url}
                    alt={p.title ?? p.caption}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  {/* The album is an ordered sequence, so the number says where
                      you are in it — not merely which tile this is. */}
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] tabular-nums text-white/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  {p.title && <p className="text-[12px] font-medium leading-tight">{p.title}</p>}
                  <p className="text-white/45 text-[11px] leading-snug line-clamp-2 mt-0.5">
                    {p.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---- Reader: one page at a time, turned with the arrows or the keyboard ---- */}
      {current && index !== null && (
        <div
          className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col p-6 gap-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-3 right-3 z-10 text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} strokeWidth={ICON_STROKE} />
          </button>

          {/* A flexible box, not a fixed ratio: these pages range from square to
              1:2, and a fixed frame letterboxes the tall ones into a sliver. */}
          <div className="relative flex-1 w-full max-w-5xl mx-auto min-h-0">
            <Image
              src={current.url}
              alt={current.title ?? current.caption}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <div className="shrink-0 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-white/35 text-[11px] tabular-nums">
              {index + 1} / {photos.length}
            </p>
            {current.title && (
              <p className="text-white text-sm font-medium mt-1">{current.title}</p>
            )}
            <p className="text-white/60 text-xs max-w-xl mx-auto mt-0.5">{current.caption}</p>
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
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/8 hover:bg-white/16 disabled:opacity-25 disabled:hover:bg-white/8 flex items-center justify-center transition-colors"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/8 hover:bg-white/16 disabled:opacity-25 disabled:hover:bg-white/8 flex items-center justify-center transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight size={17} strokeWidth={ICON_STROKE} />
          </button>
        </div>
      )}
    </div>
  );
}
