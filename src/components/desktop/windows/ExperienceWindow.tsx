import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

export function ExperienceWindow({ data }: { data: PortfolioData }) {
  return (
    <div className="flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full relative">
      {/* Background Timeline Line */}
      <div className="absolute left-8 md:left-[3.25rem] top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-[rgb(var(--win-fg)_/_0.1)] to-transparent" />

      {data.experience.map((exp, index) => (
        <motion.div 
          key={exp.id} 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15, type: "spring", stiffness: 300, damping: 25 }}
          className="relative pl-12 md:pl-20 py-6 group"
        >
          {/* Timeline Dot with Glow */}
          <div className="absolute left-6 md:left-[2.85rem] top-10 w-3 h-3 rounded-full bg-[color:rgb(var(--win-fg)_/_0.8)] ring-4 ring-black group-hover:scale-125 transition-transform duration-300 z-10" />
          
          <div className="bg-[color:rgb(var(--win-fg)_/_0.02)] border border-[color:rgb(var(--win-fg)_/_0.1)] rounded-2xl p-6 md:p-8 backdrop-blur-xl hover:bg-[color:rgb(var(--win-fg)_/_0.04)] hover:border-[color:rgb(var(--win-fg)_/_0.2)] transition-all shadow-lg hover:shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-3">
              <div>
                <h3 className="text-2xl font-bold text-[color:rgb(var(--win-fg))] tracking-tight mb-1">
                  {exp.role}
                </h3>
                <div className="flex items-center gap-2 text-[color:rgb(var(--win-fg)_/_0.6)] font-medium text-lg">
                  <Briefcase size={18} />
                  <span>{exp.company}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[color:rgb(var(--win-fg)_/_0.6)] bg-[color:rgb(var(--win-fg)_/_0.05)] border border-[color:rgb(var(--win-fg)_/_0.1)] px-3 py-1.5 rounded-full w-fit shrink-0 shadow-inner">
                <Calendar size={14} />
                <span>{exp.period}</span>
              </div>
            </div>
            
            <div className="w-full h-px bg-[color:rgb(var(--win-fg)_/_0.05)] my-4" />
            
            <p className="text-base text-[color:rgb(var(--win-fg)_/_0.7)] leading-relaxed font-normal">
              {exp.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
