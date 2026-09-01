"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/** Where the choice is remembered, and what the boot script in layout.tsx reads. */
export const THEME_STORAGE_KEY = "desktop-theme";

/**
 * The desktop is designed dark first — that's the wallpaper, the chrome and the
 * window interiors. Light is the deliberate alternative, so an unknown visitor
 * starts dark rather than inheriting whatever their OS happens to be set to.
 */
export const DEFAULT_THEME: Theme = "dark";

/** Fired after the theme changes, so every subscriber re-reads together. */
const THEME_EVENT = "desktop-themechange";

function isTheme(v: unknown): v is Theme {
  return v === "light" || v === "dark";
}

/** Read the saved choice. Storage throws in some privacy modes, so never assume. */
export function readStoredTheme(): Theme | null {
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(v) ? v : null;
  } catch {
    return null;
  }
}

/**
 * Everything visual keys off this one attribute, which is why no component
 * needs to know the theme: the CSS variables in app/theme.css are redefined
 * under `[data-theme="light"]` and the whole desktop follows.
 */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

/**
 * The <html> attribute is the source of truth rather than a React state.
 *
 * Two things fall out of that. The boot script in layout.tsx has already set it
 * from storage before the first paint, so reading it here is reading the value
 * that is genuinely on screen — no effect, no flash, no second guess. And every
 * caller reads the same place: MenuBar owns the switch while Wallpaper reacts to
 * it, and with per-component state those two would simply disagree — the menu
 * bar would flip its icon while the wallpaper stayed dark.
 */
function getSnapshot(): Theme {
  const t = document.documentElement.dataset.theme;
  return isTheme(t) ? t : DEFAULT_THEME;
}

/** The server has no DOM to read, and must match the attribute rendered there. */
function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode and blocked storage: the theme still applies for this
      // visit, it just won't be remembered. Not worth failing the toggle over.
    }
    applyTheme(next);
  }, []);

  return { theme, toggle };
}
