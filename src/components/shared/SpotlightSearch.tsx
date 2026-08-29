import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { appRegistry } from "@/data/appRegistry";
import { resolveIcon } from "@/lib/iconResolver";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: string) => void;
}

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

  const filteredApps = appRegistry.filter(
    (app) =>
      app.showOnDesktop !== false &&
      app.label.toLowerCase().includes(query.toLowerCase())
  );

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
              className="w-full max-w-2xl bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center px-4 h-12 md:h-14 border-b border-white/10">
                <Search size={20} className="text-white/50 mr-3 shrink-0 md:w-6 md:h-6" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search apps..."
                  className="w-full h-full bg-transparent outline-none text-lg md:text-xl text-white placeholder:text-white/30"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {query && (
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                      <button
                        key={app.id}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors text-left"
                        onClick={() => {
                          if (app.externalUrl) {
                            window.open(app.externalUrl, "_blank");
                          } else {
                            onOpenApp(app.id);
                          }
                          onClose();
                        }}
                      >
                        <div className={`w-10 h-10 rounded-lg ${app.mobileColor || "bg-black/20"} border border-white/10 flex items-center justify-center shadow-inner`}>
                          {app.isFaIcon ? (
                            <i className={`${app.faClass} text-xl text-white`} aria-hidden="true" />
                          ) : (
                            resolveIcon(app.iconName, { className: "w-6 h-6 text-white drop-shadow-sm" })
                          )}
                        </div>
                        <span className="text-white/90 font-medium text-lg">
                          {app.label}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-white/50">
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
