"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";
import { Code2, Layers, Database, Wrench, Palette } from "lucide-react";
import { ICON_STROKE } from "@/lib/iconStyles";

/**
 * Icon per discipline. Categories are free text in the data, so anything
 * unrecognised falls back to a neutral mark rather than breaking.
 *
 * Deliberately monochrome: the rest of the site uses one hairline icon
 * language, and the original per-category colour chips (blue/purple/emerald,
 * inherited from the template's developer categories) fought with it.
 */
const getCategoryIcon = (category: string) => {
  const c = category.toLowerCase();
  const props = { size: 18, strokeWidth: ICON_STROKE };
  if (c.includes("language")) return <Code2 {...props} />;
  if (c.includes("framework") || c.includes("librar")) return <Layers {...props} />;
  if (c.includes("backend") || c.includes("database") || c.includes("data")) return <Database {...props} />;
  if (c.includes("tool") || c.includes("devops") || c.includes("infra")) return <Wrench {...props} />;
  return <Palette {...props} />;
};

export function SkillsWindow({ data }: { data: PortfolioData }) {
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <div className="skills-wrapper">
      <div className="skills-container gap-6 p-2 pb-8">
        {categories.map((cat, catIndex) => {
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
                <div className="w-10 h-10 rounded-[26%] flex items-center justify-center border border-white/25 bg-white/[0.04] text-white/90">
                  {getCategoryIcon(cat)}
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
                    <div className="w-1.5 h-1.5 rounded-full bg-white/45" />
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
