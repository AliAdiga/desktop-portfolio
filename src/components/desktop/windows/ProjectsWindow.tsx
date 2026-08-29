"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PortfolioData, Project } from "@/types/portfolio";
import { List, LayoutGrid, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

type SortKey = "title" | "client" | "category" | "year";
type ViewMode = "list" | "grid";

const columns: { key: SortKey; label: string }[] = [
  { key: "title", label: "Name" },
  { key: "client", label: "Client" },
  { key: "category", label: "Category" },
  { key: "year", label: "Year" },
];

function openProject(project: Project) {
  if (project.url) window.open(project.url, "_blank", "noopener,noreferrer");
}

function ProjectThumb({ project, className }: { project: Project; className: string }) {
  const [errored, setErrored] = useState(false);
  if (!project.thumbnail || errored) {
    return <div className={`${className} bg-gradient-to-br from-white/10 to-white/[0.02]`} />;
  }
  return (
    <div className={`${className} relative overflow-hidden`}>
      <Image
        src={project.thumbnail}
        alt={project.title}
        fill
        sizes="200px"
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

export function ProjectsWindow({ data }: { data: PortfolioData }) {
  const [view, setView] = useState<ViewMode>("list");
  const [sortKey, setSortKey] = useState<SortKey>("year");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const list = [...data.projects];
    list.sort((a, b) => {
      const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [data.projects, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="flex flex-col h-[calc(100%+3rem)] bg-[#161616] -m-6 rounded-b-xl overflow-hidden font-sans text-white">
      {/* Toolbar */}
      <div className="bg-[#2d2d2d]/90 backdrop-blur-md px-4 py-2.5 border-b border-black/20 shrink-0 flex items-center justify-between">
        <h2 className="font-bold text-sm">Projects</h2>
        <div className="flex items-center gap-1 bg-white/[0.06] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white/15 text-white" : "text-white/45 hover:text-white/70"}`}
            aria-label="List view"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-white/15 text-white" : "text-white/45 hover:text-white/70"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <p className="text-white/35 text-sm">No projects yet.</p>
          </div>
        ) : view === "list" ? (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#1f1f1f]/95 backdrop-blur">
              <tr className="border-b border-white/10">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="text-left font-medium text-white/45 px-4 py-2 cursor-pointer select-none hover:text-white/80"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key &&
                        (sortDir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => openProject(project)}
                  className={`border-b border-white/5 ${project.url ? "cursor-pointer hover:bg-white/[0.04]" : ""}`}
                >
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-2.5">
                      <ProjectThumb project={project} className="w-7 h-7 rounded shrink-0" />
                      <span className="font-medium">{project.title}</span>
                      {project.url && <ExternalLink size={11} className="text-white/30" />}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-white/60">{project.client}</td>
                  <td className="px-4 py-2 text-white/60">{project.category}</td>
                  <td className="px-4 py-2 text-white/60">{project.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {sorted.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => openProject(project)}
                className="text-left rounded-xl overflow-hidden border border-white/10 hover:border-white/25 transition-colors bg-white/[0.03]"
              >
                <ProjectThumb project={project} className="w-full aspect-[4/3]" />
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{project.title}</p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {project.client} · {project.category} · {project.year}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
