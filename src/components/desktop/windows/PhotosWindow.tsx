"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { PortfolioData, Photo } from "@/types/portfolio";
import { Folder, ChevronLeft, X, ExternalLink } from "lucide-react";
import { ICON_FRAME, ICON_FRAME_INTERACTIVE, ICON_STROKE } from "@/lib/iconStyles";
import { cn } from "@/lib/utils";

type Album = { name: string; url?: string; photos: Photo[] };

/** Group photos into albums, preserving the order they're declared in. */
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
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const album = albums.find((a) => a.name === openAlbum) ?? null;

  return (
    <div className="flex flex-col h-[calc(100%+3rem)] bg-[#161616] -m-6 rounded-b-xl overflow-hidden font-sans text-white select-none">
      {/* Toolbar doubles as breadcrumb once you're inside an album */}
      <div className="bg-[#2d2d2d]/90 backdrop-blur-md px-4 py-2.5 border-b border-black/20 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {album && (
            <button
              type="button"
              onClick={() => setOpenAlbum(null)}
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
          /* ---- Inside an album ---- */
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {album.photos.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setLightbox(p)}
                className="group flex flex-col gap-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
              >
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
                  <Image src={p.url} alt={p.caption} fill sizes="320px" className="object-cover" />
                </div>
                <p className="text-white/55 text-[11px] leading-snug line-clamp-2">{p.caption}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 gap-3"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} strokeWidth={ICON_STROKE} />
          </button>
          <div className="relative w-full max-w-4xl aspect-[16/10]">
            <Image
              src={lightbox.url}
              alt={lightbox.caption}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <p className="text-white/70 text-xs text-center max-w-xl">{lightbox.caption}</p>
        </div>
      )}
    </div>
  );
}
