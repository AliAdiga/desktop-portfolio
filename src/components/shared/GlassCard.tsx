import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({
  children,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl md:rounded-[32px] overflow-hidden backdrop-blur-xl",
        "border shadow-2xl transition-all duration-300",
        "bg-black/40 border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
