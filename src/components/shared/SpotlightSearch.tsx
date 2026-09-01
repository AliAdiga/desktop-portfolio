import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import { appRegistry } from "@/data/appRegistry";
import { projects } from "@/data/projects";
import { resolveIcon } from "@/lib/iconResolver";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: string) => void;
}

type Result =
  | { kind: "app"; id: string; label: string; hint?: string }
  | { kind: "project"; id: string; label: string; hint?: string; url: string };

export function SpotlightSearch({ isOpen, onClose, onOpenApp }: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (query !== "") {
      const timer = setTimeout(() => setQuery(""), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        onClose(); // DesktopView will handle opening, but we can close it here
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    /**
     * Apps are no longer filtered on `showOnDesktop`. That flag stopped driving
     * any surface when the desktop and dock moved to src/data/folders.ts, and
     * appRegistry says as much — but Spotlight was still filtering on it, and
     * since almost every app sets it false, search returned nothing but Demos.
     *
     * Music is excluded because nothing links to it: it still holds the
     * template's demo playlist, so offering it would open a dead end.
     */
    const apps: Result[] = appRegistry
      .filter((a) => a.id !== "music" && a.label.toLowerCase().includes(q))
      .map((a) => ({ kind: "app", id: a.id, label: a.label }));

    // Projects are what a visitor is actually looking for, and they were not
    // searchable at all. Matched on name, blurb and stack, so "Next.js" or
    // "restaurant" finds the right work.
    const projs: Result[] = projects
      .filter((p) =>
        [p.title, p.description, ...(p.techStack ?? [])]
          .filter(Boolean)
          .some((f) => String(f).toLowerCase().includes(q))
      )
      // Only projects that actually go somewhere — a result that opens nothing
      // is worse than no result.
      .flatMap<Result>((p) => {
        const url = p.liveUrl ?? p.githubUrl;
        if (!url) return [];
        return [
          {
            kind: "project",
            id: p.id,
            label: p.title,
            hint: (p.techStack ?? []).slice(0, 3).join(" · "),
            url,
          },
        ];
      });

    return [...apps, ...projs];
  }, [query]);

  function activate(r: Result) {
    if (r.kind === "project") {
      window.open(r.url, "_blank", "noopener,noreferrer");
    } else {
      const app = appRegistry.find((a) => a.id === r.id);
      if (app?.externalUrl) window.open(app.externalUrl, "_blank", "noopener,noreferrer");
      else onOpenApp(r.id);
    }
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-[20vh] bg-black/40 backdrop-blur-md px-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-[var(--desk-panel-strong)] backdrop-blur-3xl border border-[color:var(--desk-panel-border)] shadow-2xl rounded-2xl overflow-hidden flex flex-col text-[color:var(--desk-text)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center px-4 h-12 md:h-14 border-b border-[color:var(--desk-panel-border)]">
                <Search size={20} className="opacity-50 mr-3 shrink-0 md:w-6 md:h-6" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search apps and projects…"
                  className="w-full h-full bg-transparent outline-none text-lg md:text-xl text-[color:var(--desk-text-strong)] placeholder:opacity-40"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {query && (
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {results.length > 0 ? (
                    results.map((r) => {
                      const app =
                        r.kind === "app" ? appRegistry.find((a) => a.id === r.id) : undefined;
                      return (
                        <button
                          key={`${r.kind}-${r.id}`}
                          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[color:var(--desk-panel-border)] rounded-xl transition-colors text-left"
                          onClick={() => activate(r)}
                        >
                          <div className="w-10 h-10 rounded-lg bg-[color:var(--desk-panel)] border border-[color:var(--desk-panel-border)] flex items-center justify-center shrink-0">
                            {r.kind === "project" ? (
                              <ExternalLink className="w-5 h-5" />
                            ) : app?.isFaIcon ? (
                              <i className={`${app.faClass} text-xl`} aria-hidden="true" />
                            ) : (
                              resolveIcon(app?.iconName ?? "", { className: "w-6 h-6" })
                            )}
                          </div>
                          <span className="min-w-0">
                            <span className="block font-medium text-[15px] text-[color:var(--desk-text-strong)] truncate">
                              {r.label}
                            </span>
                            <span className="block text-[11px] opacity-55 truncate">
                              {r.kind === "project" ? r.hint || "Live site" : "App"}
                            </span>
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-center opacity-50">
                      No results found for &quot;{query}&quot;
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
