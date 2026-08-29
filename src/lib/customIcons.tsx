"use client";

import React from "react";

type IconProps = { size?: number; className?: string; strokeWidth?: number };

// Folder with a play mark inside — the video folder needs to read as "a folder
// full of clips", not a generic system glyph, since it's the one icon the
// client wants visible right now.
//
// Drawn as a single path set (rather than composing a Lucide Folder with an
// overlapping badge) so it stays pure line art at any stroke weight: an
// overlapping badge would need an opaque backing to mask the folder behind it,
// which shows up as a solid disc against a translucent icon frame.
export function VideoFolderIcon({ size = 24, className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="M10.6 11.3v4.4l3.8-2.2z" fill="currentColor" stroke="none" />
    </svg>
  );
}
