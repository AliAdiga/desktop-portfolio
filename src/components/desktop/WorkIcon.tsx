"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/lib/workItems";

interface WorkIconProps {
  item: WorkItem;
  xPct: number;
  yPct: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (item: WorkItem) => void;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

export function WorkIcon({ item, xPct, yPct, isSelected, onSelect, onOpen, constraintsRef }: WorkIconProps) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(item);
      }}
      className="absolute flex flex-col items-center gap-1.5 w-[84px] cursor-pointer z-10"
      style={{ left: `${xPct * 100}%`, top: `${yPct * 100}%` }}
      initial={false}
      whileTap={{ scale: 0.96 }}
    >
      <div
        className={cn(
          "relative w-[76px] h-[96px] rounded-[10px] overflow-hidden bg-[#1a1d24] border border-white/10 transition-all",
          isSelected ? "ring-2 ring-white/60 brightness-90" : ""
        )}
        style={{ boxShadow: "0 10px 24px rgba(0,0,0,0.5)" }}
      >
        {item.thumbnail ? (
          <Image src={item.thumbnail} alt={item.label} fill sizes="76px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#232a35] to-[#12151b]" />
        )}
        {item.kind === "video" && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-7 h-7 rounded-full bg-black/45 flex items-center justify-center">
              <Play size={12} className="text-white translate-x-[1px]" fill="currentColor" />
            </span>
          </span>
        )}
      </div>
      <span
        className={cn(
          "text-[12px] font-medium px-2 py-0.5 rounded text-center leading-tight max-w-full truncate",
          isSelected ? "bg-[#0060df] text-white" : "text-white bg-transparent"
        )}
        style={{ textShadow: isSelected ? "none" : "0 1px 3px rgba(0,0,0,0.8)" }}
      >
        {item.label}
      </span>
    </motion.div>
  );
}
