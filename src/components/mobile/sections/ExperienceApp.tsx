"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

export function ExperienceApp({ data }: { data: PortfolioData }) {
  return (
    <div className="pb-16 pt-2 px-1 relative">
      {/* Background Timeline Line */}
      <div className="absolute left-[1.125rem] top-6 bottom-20 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

      <div className="flex flex-col gap-8">
        {data.experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, type: "spring", stiffness: 400, damping: 30 }}
            className="relative pl-10 pr-2"
          >
            {/* Timeline Dot */}
            <div className="absolute left-[0.85rem] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-400 ring-4 ring-black shadow-[0_0_10px_rgba(96,165,250,0.8)] z-10" />

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 shadow-sm backdrop-blur-md">
              <h3 className="text-[17px] font-bold text-white/95 leading-tight mb-1">{exp.role}</h3>
              
              <div className="flex items-center gap-1.5 text-blue-400 mb-3">
                <Briefcase size={14} />
                <span className="text-[13px] font-semibold">{exp.company}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-white/50 mb-4">
                <Calendar size={12} />
                <span className="text-xs font-medium uppercase tracking-wider">{exp.period}</span>
              </div>
              
              <p className="text-[14px] text-white/70 leading-relaxed font-normal">
                {exp.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
