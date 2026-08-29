"use client";

import React, { useState, useEffect } from "react";
import { Search, Command } from "lucide-react";
import { PortfolioData } from "@/types/portfolio";

export function MenuBar({ 
  data, 
  onSearchClick 
}: { 
  data: PortfolioData;
  onSearchClick?: () => void;
}) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-7 flex items-center justify-between px-4 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 text-white/90 text-[13px] font-medium selection:bg-transparent">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <div className="font-bold flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
          <Command size={15} />
        </div>
        <span className="font-bold cursor-default pr-2">{data.profile.name}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onSearchClick}
          className="hover:text-white transition-colors flex items-center justify-center cursor-pointer"
        >
          <Search size={14} />
        </button>
        <span className="min-w-[140px] text-right">
          {time || "Loading..."}
        </span>
      </div>
    </div>
  );
}
