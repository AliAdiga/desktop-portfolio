"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";
import { Layers, Code2, Database, Palette, Wrench } from "lucide-react";

// Helper to assign a specific icon and color to categories
const getCategoryStyles = (category: string) => {
  switch (category.toLowerCase()) {
    case "languages":
      return { 
        icon: <Code2 size={18} />, 
        bg: "bg-blue-500/15", 
        border: "border-blue-500/25",
        text: "text-blue-400" 
      };
    case "frameworks & libraries":
      return { 
        icon: <Layers size={18} />, 
        bg: "bg-purple-500/15", 
        border: "border-purple-500/25",
        text: "text-purple-400" 
      };
    case "backend & database":
      return { 
        icon: <Database size={18} />, 
        bg: "bg-emerald-500/15", 
        border: "border-emerald-500/25",
        text: "text-emerald-400" 
      };
    case "tools":
      return { 
        icon: <Wrench size={18} />, 
        bg: "bg-orange-500/15", 
        border: "border-orange-500/25",
        text: "text-orange-400" 
      };
    default:
      return { 
        icon: <Palette size={18} />, 
        bg: "bg-zinc-500/15", 
        border: "border-zinc-500/25",
        text: "text-zinc-400" 
      };
  }
};

export function SkillsWindow({ data }: { data: PortfolioData }) {
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <div className="skills-wrapper">
      <div className="skills-container gap-6 p-2 pb-8">
        {categories.map((cat, catIndex) => {
          const style = getCategoryStyles(cat);
          const categorySkills = data.skills.filter((s) => s.category === cat);

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1, duration: 0.4 }}
              className="flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all shadow-lg"
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${style.bg} ${style.text} ${style.border}`}>
                  {style.icon}
                </div>
                <h3 className="text-xl font-bold text-white/90 tracking-wide">
                  {cat}
                </h3>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2.5">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (catIndex * 0.1) + (index * 0.05) + 0.2 }}
                    className="px-4 py-2 rounded-full border bg-white/5 border-white/10 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default shadow-sm"
                  >
                    <div className={`w-2 h-2 rounded-full bg-current ${style.text} opacity-80`} />
                    <span className="text-sm font-medium text-white/90">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .skills-wrapper {
          width: 100%;
          min-height: 100%;
        }
        .skills-container {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr;
        }

        @container (min-width: 600px) {
          .skills-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Maximized/Wide layout */
        @container (min-width: 900px) {
          .skills-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem;
          }
          .skills-container {
            max-width: 64rem; /* max-w-4xl */
            margin: auto;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
