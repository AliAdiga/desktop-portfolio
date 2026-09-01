"use client";

import React from "react";
import { motion, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";

interface MacWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  /** Frontmost window. Unfocused windows grey their traffic lights, as macOS does. */
  isFocused?: boolean;
  /**
   * Cascade offset in px, so several open windows don't land exactly on top of
   * each other. Applied as a margin rather than a transform on purpose: a
   * transformed ancestor becomes the containing block for `position: fixed`,
   * which would break the maximised state's `fixed inset-0`.
   */
  offset?: { x: number; y: number };
  /**
   * Element the window may be dragged within — normally the desktop. Preferred
   * over a fixed pixel box, which stops short of the edges on large screens.
   */
  constraintsRef?: React.RefObject<HTMLElement | null>;
}

export function MacWindow({
  title,
  children,
  className,
  isOpen = true,
  onClose,
  onMinimize,
  isFocused = true,
  offset,
  constraintsRef,
}: MacWindowProps) {
  const dragControls = useDragControls();
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.05}
      dragConstraints={
        constraintsRef ?? { left: -500, right: 500, top: -100, bottom: 500 }
      }
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      style={
        offset && !isMaximized ? { marginLeft: offset.x, marginTop: offset.y } : undefined
      }
      className={cn(
        "flex flex-col overflow-hidden backdrop-blur-2xl border pointer-events-auto",
        !isDragging && "transition-shadow duration-300",
        "bg-[var(--win-bg)] text-[color:rgb(var(--win-fg))]",
        // Focused windows sit forward with a deeper shadow and brighter edge.
        isFocused
          ? "border-[color:rgb(var(--win-fg)_/_0.2)] shadow-[0_24px_70px_-12px_rgba(0,0,0,0.85)]"
          : "border-[color:rgb(var(--win-fg)_/_0.1)] shadow-[0_12px_36px_-14px_rgba(0,0,0,0.7)]",
        !isMaximized && className,
        isMaximized && "fixed inset-0 m-0 rounded-none z-[100] w-screen h-screen max-w-none max-h-none !transform-none"
      )}
    >
      {/* Title Bar - Draggable Area */}
      <div
        className={cn(
          "group h-10 px-4 flex items-center justify-between border-b bg-[color:rgb(var(--win-fg)_/_0.05)] border-[color:rgb(var(--win-fg)_/_0.1)] select-none",
          !isMaximized ? "cursor-grab active:cursor-grabbing" : ""
        )}
        onPointerDown={(e) => {
          if (!isMaximized) dragControls.start(e);
        }}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        {/* Traffic Lights — glyphs only appear on hover, as on macOS. */}
        <div className="flex gap-2 relative z-10">
          <button
            onClick={onClose}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[color:var(--win-border)] transition-colors",
              isFocused ? "bg-[#ff5f56] hover:bg-[#ff5f56]/80" : "bg-[color:rgb(var(--win-fg)_/_0.25)]"
            )}
            aria-label="Close window"
          >
            <X size={9} strokeWidth={4} className="text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={onMinimize ?? onClose}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[color:var(--win-border)] transition-colors",
              isFocused ? "bg-[#ffbd2e] hover:bg-[#ffbd2e]/80" : "bg-[color:rgb(var(--win-fg)_/_0.25)]"
            )}
            aria-label="Minimize window"
          >
            <Minus size={9} strokeWidth={4} className="text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[color:var(--win-border)] transition-colors",
              isFocused ? "bg-[#27c93f] hover:bg-[#27c93f]/80" : "bg-[color:rgb(var(--win-fg)_/_0.25)]"
            )}
            aria-label="Maximize window"
          >
            {isMaximized
              ? <Minimize2 size={9} strokeWidth={4} className="text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
              : <Maximize2 size={9} strokeWidth={4} className="text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
            }
          </button>
        </div>

        {/* Title */}
        <div
          className={cn(
            "text-xs font-semibold absolute left-1/2 -translate-x-1/2 select-none pointer-events-none transition-opacity",
            isFocused ? "opacity-75" : "opacity-40"
          )}
        >
          {title}
        </div>

        <div className="w-[52px]" /> {/* Spacer for symmetry */}
      </div>

      {/* Content Area */}
      <div
        className="flex-1 overflow-y-auto p-6 custom-scrollbar"
        style={{ containerType: "inline-size" }}
        onPointerDown={(e) => e.stopPropagation()} // Ensure scrolling doesn't drag
      >
        {children}
      </div>
    </motion.div>
  );
}
