/**
 * Shared "framed icon" treatment: a rounded-square tile with a line glyph
 * inside, matching the reference icon sheet.
 *
 * Kept in one place because the same treatment is used by the desktop icons,
 * the dock, and the mobile home grid — three files that would otherwise drift
 * apart the first time anyone tweaks a radius or a border colour.
 *
 * Every colour here is a CSS variable from app/theme.css rather than a literal,
 * which is what lets the light/dark switch restyle every icon on the site
 * without any component knowing a theme exists. Dark renders the hairline
 * outline; light fills the tile, because a white outline on a light wallpaper
 * is invisible.
 *
 * The radius is a percentage rather than a fixed px so the frames stay
 * proportionally identical across the 48px dock and the 60px home-screen tiles.
 */
export const ICON_FRAME =
  "icon-frame-shadow relative flex items-center justify-center rounded-[26%] border border-[color:var(--icon-border)] bg-[color:var(--icon-bg)] text-[color:var(--icon-fg)] transition-colors duration-200";

/** Hover/focus lift for interactive frames. */
export const ICON_FRAME_INTERACTIVE =
  "hover:border-[color:var(--icon-border-hover)] hover:bg-[color:var(--icon-bg-hover)] hover:text-[color:var(--icon-fg-hover)]";

/** Lucide stroke weight matching the reference sheet's hairline weight (default is 2). */
export const ICON_STROKE = 1.25;
