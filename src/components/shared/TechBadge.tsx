import React from "react";
import { cn } from "@/lib/utils";

interface TechBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export function TechBadge({ name, className, ...props }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-medium",
        "bg-white/10 text-white/90 border border-white/20 rounded-full",
        "backdrop-blur-md shadow-sm transition-transform hover:scale-105",
        className
      )}
      {...props}
    >
      {name}
    </span>
  );
}
