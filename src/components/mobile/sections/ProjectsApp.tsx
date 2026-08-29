"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PortfolioData, Project } from "@/types/portfolio";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

function openProject(project: Project) {
  if (project.url) window.open(project.url, "_blank", "noopener,noreferrer");
}

function ProjectThumb({ project }: { project: Project }) {
  const [errored, setErrored] = useState(false);
  if (!project.thumbnail || errored) {
    return <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] shrink-0" />;
  }
  return (
    <div className="w-14 h-14 rounded-lg relative overflow-hidden shrink-0">
      <Image src={project.thumbnail} alt={project.title} fill sizes="56px" className="object-cover" onError={() => setErrored(true)} />
    </div>
  );
}

export function ProjectsApp({ data }: { data: PortfolioData }) {
  const projects = data.projects || [];

  return (
    <div className="pb-24 pt-2 flex flex-col gap-2 px-1">
      {projects.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-white/40 text-sm">No projects yet.</p>
        </div>
      ) : (
        projects.map((project, index) => (
          <motion.button
            key={project.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openProject(project)}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 text-left"
          >
            <ProjectThumb project={project} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{project.title}</p>
              <p className="text-white/50 text-xs mt-0.5 truncate">
                {project.client} · {project.category} · {project.year}
              </p>
            </div>
            {project.url && <ExternalLink size={14} className="text-white/30 shrink-0" />}
          </motion.button>
        ))
      )}
    </div>
  );
}
