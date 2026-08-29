"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function StatusBar({ onSearchClick }: { onSearchClick?: () => void }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-7 pt-[max(env(safe-area-inset-top,14px),14px)] pb-1 text-white font-semibold text-[13px] z-50 relative">
      <div className="w-[60px]">{time}</div>

      {/* Spacer for Dynamic Island */}
      <div className="w-[126px]" />

      <div className="flex items-center justify-end w-[60px]">
        <button onClick={onSearchClick} className="active:scale-90 transition-transform">
          <Search size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export function DynamicIsland({ activeApp }: { activeApp?: string | null }) {
  const expanded = !!activeApp;



  return (
    <div className="absolute top-[max(env(safe-area-inset-top,10px),10px)] left-1/2 -translate-x-1/2 z-[60]">
      <motion.div
        animate={{
          width: expanded ? 200 : 126,
          height: expanded ? 40 : 36,
          borderRadius: 50,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="bg-black flex items-center overflow-hidden"
        style={{
          boxShadow: "0 2px 20px rgba(0,0,0,0.7), inset 0 0 0 0.5px rgba(255,255,255,0.08)",
        }}
      >
        {/* Camera */}
        <div className="absolute left-[18px] top-1/2 -translate-y-1/2">
          <div className="w-[11px] h-[11px] rounded-full bg-[#1a1a2e] ring-1 ring-zinc-700/80 flex items-center justify-center">
            <div className="w-[5px] h-[5px] rounded-full bg-[#0d1117] ring-1 ring-[#2a2a3a]" />
          </div>
        </div>

        {/* Right side indicator */}
        <motion.div
          animate={{ opacity: expanded ? 1 : 0.6 }}
          className="absolute right-[18px] top-1/2 -translate-y-1/2 flex items-center gap-1.5"
        >
          <div className={`w-[6px] h-[6px] rounded-full shadow-[0_0_8px_rgba(74,222,128,0.7)] ${activeApp ? "bg-green-400 animate-pulse" : "bg-zinc-500"}`} />
        </motion.div>

        {/* Expanded content */}
        <motion.div
          animate={{ opacity: expanded ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-10"
        >
          <span className="text-[11px] text-white/80 font-medium tracking-wide truncate">
            {activeApp ? activeApp.charAt(0).toUpperCase() + activeApp.slice(1) : null}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
