"use client";

import React, { useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { StatusBar, DynamicIsland } from "./StatusBar";
import { appRegistry } from "@/data/appRegistry";
import { mobileComponentMap } from "../shared/appComponents";
import { resolveIcon } from "@/lib/iconResolver";
import { ICON_FRAME, ICON_STROKE } from "@/lib/iconStyles";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { SpotlightSearch } from "../shared/SpotlightSearch";
import { X } from "lucide-react";

export function MobileView({ data, initialApp }: { data: PortfolioData; initialApp?: string | null }) {
  const [activeApp, setActiveApp] = useState<string | null>(initialApp || null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Only show apps where showOnMobile !== false
  const mobileApps = appRegistry.filter((app) => app.showOnMobile !== false);

  return (
    <div className="absolute inset-0 overflow-hidden font-sans flex flex-col">
      <StatusBar onSearchClick={() => setIsSearchOpen(true)} />
      <DynamicIsland activeApp={activeApp} />
      
      {/* Mobile Search Overlay */}
      <SpotlightSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onOpenApp={(id) => {
          setActiveApp(id);
          setIsSearchOpen(false);
        }}
      />

      {/* Mobile Content */}
      <div className="flex-1 px-6 pt-14 relative z-10 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {/* Hero Widget Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-[var(--desk-panel-strong)] backdrop-blur-2xl border border-[color:var(--desk-panel-border)] rounded-3xl p-5 mb-8 shadow-xl flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-[2px] shrink-0">
            <div className="relative w-full h-full rounded-full bg-black/50 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
               {data.profile.avatar && data.profile.avatar !== "/avatar.svg" ? (
                 <Image src={data.profile.avatar} alt="avatar" fill sizes="64px" className="object-cover" />
               ) : (
                 data.profile.name[0]
               )}
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="desk-icon-label text-xl font-bold leading-tight">{data.profile.name}</h1>
            <p className="desk-icon-label opacity-80 text-xs font-medium mt-0.5">{data.profile.role}</p>
            {data.profile.location && (
              <div className="desk-icon-label opacity-70 flex items-center gap-1 mt-1.5 text-[10px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {data.profile.location}
              </div>
            )}
          </div>
        </motion.div>

        {/* Home Screen Grid */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-6 pb-20">
          {mobileApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                if (app.externalUrl) {
                  window.open(app.externalUrl, "_blank");
                } else {
                  setActiveApp(app.id);
                }
              }}
              className="flex flex-col items-center gap-1.5 tap-highlight-transparent active:scale-90 transition-transform"
            >
              <div className={cn(ICON_FRAME, "w-[60px] h-[60px]")}>
                {app.isFaIcon ? (
                  <i className={`${app.faClass} text-2xl`} aria-hidden="true" />
                ) : (
                  resolveIcon(app.iconName, { size: 28, strokeWidth: ICON_STROKE })
                )}
              </div>
              {/* Sits directly on the wallpaper, so it carries its own contrast
                  rather than relying on what's behind it — white with a dark
                  halo in dark theme, ink with a light one in light theme. */}
              <span className="desk-icon-label font-medium text-[11px]">
                {app.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Opened App Container */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, borderRadius: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0, borderRadius: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50, borderRadius: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="absolute inset-0 z-50 bg-[var(--win-bg)] backdrop-blur-3xl border border-[color:var(--win-border)] flex flex-col text-[color:rgb(var(--win-fg))]"
          >
            {/* Safe Area Spacer for Status Bar */}
            <div className="h-[max(env(safe-area-inset-top,44px),44px)] shrink-0 relative z-10 flex items-end justify-center pb-2 px-4">
               <span className="font-bold text-sm capitalize">
                 {appRegistry.find((a) => a.id === activeApp)?.label || activeApp}
               </span>
               <button 
                 onClick={() => setActiveApp(null)}
                 className="absolute right-4 bottom-2 w-6 h-6 rounded-full bg-[color:rgb(var(--win-fg)_/_0.1)] flex items-center justify-center text-[color:rgb(var(--win-fg)_/_0.8)] hover:bg-[color:rgb(var(--win-fg)_/_0.2)] active:scale-90 transition-all"
               >
                 <X size={14} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4" style={{ scrollbarWidth: "none" }}>
              {mobileComponentMap[activeApp]?.(data, setActiveApp)}
            </div>

            {/* Home Indicator (Swipe up to close) */}
            <motion.div 
              className="h-[max(env(safe-area-inset-bottom,34px),34px)] w-full flex items-center justify-center cursor-pointer shrink-0 absolute bottom-0 left-0 right-0 z-20"
              onClick={() => setActiveApp(null)}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.1, bottom: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.y < -20) {
                  setActiveApp(null);
                }
              }}
            >
              <div className="w-[134px] h-[5px] bg-[color:rgb(var(--win-fg)_/_0.6)] rounded-full shadow-sm" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
