/**
 * Shared "framed line icon" treatment: a hairline rounded-square outline with a
 * monochrome line glyph inside, matching the reference icon sheet.
 *
 * Kept in one place because the same treatment is used by the desktop icons,
 * the dock, and the mobile home grid — three files that would otherwise drift
 * apart the first time anyone tweaks a radius or a border colour.
 *
 * The radius is a percentage rather than a fixed px so the frames stay
 * proportionally identical across the 48px dock and the 60px home-screen tiles.
 */
export const ICON_FRAME =
  "relative flex items-center justify-center rounded-[26%] border border-white/25 bg-white/[0.04] text-white/90 transition-colors duration-200";

/** Hover/focus lift for interactive frames. */
export const ICON_FRAME_INTERACTIVE =
  "hover:border-white/60 hover:bg-white/[0.10] hover:text-white";

/** Lucide stroke weight matching the reference sheet's hairline weight (default is 2). */
export const ICON_STROKE = 1.25;
