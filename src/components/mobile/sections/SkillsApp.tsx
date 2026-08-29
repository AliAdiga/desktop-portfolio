"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";
import { Code2, Database, Palette, Wrench, Layers } from "lucide-react";

// Helper to assign a specific icon and color to categories
const getCategoryStyles = (category: string) => {
  switch (category.toLowerCase()) {
    case "languages":
      return { 
        icon: <Code2 size={16} />, 
        bg: "bg-blue-500/15", 
        border: "border-blue-500/25",
        text: "text-blue-400" 
      };
    case "frameworks & libraries":
      return { 
        icon: <Layers size={16} />, 
        bg: "bg-purple-500/15", 
        border: "border-purple-500/25",
        text: "text-purple-400" 
      };
    case "backend & database":
      return { 
        icon: <Database size={16} />, 
        bg: "bg-emerald-500/15", 
        border: "border-emerald-500/25",
        text: "text-emerald-400" 
      };
    case "tools":
      return { 
        icon: <Wrench size={16} />, 
        bg: "bg-orange-500/15", 
        border: "border-orange-500/25",
        text: "text-orange-400" 
      };
    default:
      return { 
        icon: <Palette size={16} />, 
        bg: "bg-zinc-500/15", 
        border: "border-zinc-500/25",
        text: "text-zinc-400" 
      };
  }
};

export function SkillsApp({ data }: { data: PortfolioData }) {
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <div className="pb-16 pt-2 px-1 flex flex-col gap-6">
      {categories.map((cat, catIndex) => {
        const style = getCategoryStyles(cat);
        const categorySkills = data.skills.filter((s) => s.category === cat);

        return (
          <motion.div 
            key={cat} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1, duration: 0.4 }}
            className="flex flex-col gap-3"
          >
            {/* Category Header */}
            <div className="flex items-center gap-2 pl-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${style.bg} ${style.text} ${style.border} border`}>
                {style.icon}
              </div>
              <h3 className="text-[15px] font-bold text-white/90 tracking-wide uppercase">
                {cat}
              </h3>
            </div>

            {/* Chips Container */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 shadow-sm">
              <div className="flex flex-wrap gap-2.5">
                {categorySkills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (catIndex * 0.1) + (i * 0.05) + 0.2 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border bg-white/5 border-white/10`}
                  >
                    <div className={`w-2 h-2 rounded-full bg-current ${style.text} opacity-80`} />
                    <span className="text-sm font-semibold text-white/90">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
