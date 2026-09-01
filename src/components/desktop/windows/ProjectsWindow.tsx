"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PortfolioData, Project } from "@/types/portfolio";
// This lucide version dropped brand icons, so source links use a neutral
// code mark rather than the GitHub logo — it also keeps the hairline set consistent.
import { List, LayoutGrid, ArrowUp, ArrowDown, ExternalLink, Code2, Star } from "lucide-react";
import { ICON_STROKE } from "@/lib/iconStyles";

type SortKey = "title" | "year";
type ViewMode = "list" | "grid";

const columns: { key: SortKey; label: string }[] = [
  { key: "title", label: "Name" },
  { key: "year", label: "Year" },
];

function ProjectThumb({ project, className }: { project: Project; className: string }) {
  const [errored, setErrored] = useState(false);
  if (!project.thumbnail || errored) {
    return <div className={`${className} bg-gradient-to-br from-[rgb(var(--win-fg)_/_0.1)] to-[rgb(var(--win-fg)_/_0.02)]`} />;
  }
  return (
    <div className={`${className} relative overflow-hidden`}>
      <Image
        src={project.thumbnail}
        alt={project.title}
        fill
        sizes="320px"
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

/** Live / source links. Stops propagation so opening a link doesn't also fire the row. */
function ProjectLinks({ project, size = 12 }: { project: Project; size?: number }) {
  if (!project.liveUrl && !project.githubUrl) return null;
  return (
    <span className="flex items-center gap-2.5 shrink-0">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[color:rgb(var(--win-fg)_/_0.45)] hover:text-[color:rgb(var(--win-fg))] transition-colors"
          aria-label={`${project.title} — live site`}
          title="Live site"
        >
          <ExternalLink size={size} strokeWidth={ICON_STROKE} />
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[color:rgb(var(--win-fg)_/_0.45)] hover:text-[color:rgb(var(--win-fg))] transition-colors"
          aria-label={`${project.title} — source`}
          title="Source"
        >
          <Code2 size={size} strokeWidth={ICON_STROKE} />
        </a>
      )}
    </span>
  );
}

/** Where clicking a card should take you — live site first, source as fallback. */
function projectHref(project: Project) {
  return project.liveUrl ?? project.githubUrl ?? null;
}

function TechChips({ stack, max }: { stack: string[]; max?: number }) {
  const shown = max ? stack.slice(0, max) : stack;
  const extra = max ? stack.length - shown.length : 0;
  return (
    <span className="flex flex-wrap gap-1.5">
      {shown.map((t) => (
        <span
          key={t}
          className="text-[11px] leading-none px-2 py-1 rounded-full border border-[color:rgb(var(--win-fg)_/_0.15)] bg-[color:rgb(var(--win-fg)_/_0.04)] text-[color:rgb(var(--win-fg)_/_0.7)]"
        >
          {t}
        </span>
      ))}
      {extra > 0 && <span className="text-[11px] leading-none px-1 py-1 text-[color:rgb(var(--win-fg)_/_0.35)]">+{extra}</span>}
    </span>
  );
}

export function ProjectsWindow({ data }: { data: PortfolioData }) {
  const [view, setView] = useState<ViewMode>("grid");
  const [sortKey, setSortKey] = useState<SortKey>("year");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const list = [...data.projects];
    list.sort((a, b) => {
      // Featured work always leads, whatever the sort.
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [data.projects, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="flex flex-col h-[calc(100%+3rem)] bg-[var(--win-bg)] -m-6 rounded-b-xl overflow-hidden font-sans text-[color:rgb(var(--win-fg))]">
      {/* Toolbar */}
      <div className="bg-[var(--win-toolbar)] backdrop-blur-md px-4 py-2.5 border-b border-[color:var(--win-border)] shrink-0 flex items-center justify-between">
        <h2 className="font-bold text-sm">Projects</h2>
        <div className="flex items-center gap-3">
          <span className="text-[color:rgb(var(--win-fg)_/_0.4)] text-xs">{sorted.length} items</span>
          <div className="flex items-center gap-1 bg-[color:rgb(var(--win-fg)_/_0.06)] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-[color:rgb(var(--win-fg)_/_0.15)] text-[color:rgb(var(--win-fg))]" : "text-[color:rgb(var(--win-fg)_/_0.45)] hover:text-[color:rgb(var(--win-fg)_/_0.7)]"}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={14} strokeWidth={ICON_STROKE} />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-[color:rgb(var(--win-fg)_/_0.15)] text-[color:rgb(var(--win-fg))]" : "text-[color:rgb(var(--win-fg)_/_0.45)] hover:text-[color:rgb(var(--win-fg)_/_0.7)]"}`}
              aria-label="List view"
            >
              <List size={14} strokeWidth={ICON_STROKE} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-1">
            <p className="text-[color:rgb(var(--win-fg)_/_0.4)] text-sm">No projects yet.</p>
            <p className="text-[color:rgb(var(--win-fg)_/_0.25)] text-xs">Add them in src/data/projects.ts</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {sorted.map((project) => (
              <a
                key={project.id}
                href={projectHref(project) ?? undefined}
                target={projectHref(project) ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`group flex flex-col rounded-xl overflow-hidden border border-[color:rgb(var(--win-fg)_/_0.1)] bg-[color:rgb(var(--win-fg)_/_0.03)] transition-colors ${
                  projectHref(project)
                    ? "hover:border-[color:rgb(var(--win-fg)_/_0.4)] hover:bg-[color:rgb(var(--win-fg)_/_0.06)] cursor-pointer"
                    : "cursor-default"
                }`}
              >
                <div className="overflow-hidden">
                  <ProjectThumb
                    project={project}
                    className="w-full aspect-[16/9] transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-sm leading-snug flex items-center gap-1.5">
                      {project.featured && (
                        <Star size={11} className="text-[color:rgb(var(--win-fg)_/_0.5)] shrink-0" fill="currentColor" strokeWidth={0} />
                      )}
                      {project.title}
                    </h3>
                    <ProjectLinks project={project} size={13} />
                  </div>
                  <p className="text-[color:rgb(var(--win-fg)_/_0.55)] text-xs leading-relaxed flex-1">{project.description}</p>
                  <TechChips stack={project.techStack} />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[var(--win-sidebar)] backdrop-blur">
              <tr className="border-b border-[color:rgb(var(--win-fg)_/_0.1)]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="text-left font-medium text-[color:rgb(var(--win-fg)_/_0.45)] px-4 py-2 cursor-pointer select-none hover:text-[color:rgb(var(--win-fg)_/_0.8)]"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key &&
                        (sortDir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                    </span>
                  </th>
                ))}
                <th className="text-left font-medium text-[color:rgb(var(--win-fg)_/_0.45)] px-4 py-2">Stack</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => {
                    const href = projectHref(project);
                    if (href) window.open(href, "_blank", "noopener,noreferrer");
                  }}
                  className={`border-b border-[color:rgb(var(--win-fg)_/_0.05)] hover:bg-[color:rgb(var(--win-fg)_/_0.04)] ${
                    projectHref(project) ? "cursor-pointer" : ""
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2.5">
                      <ProjectThumb project={project} className="w-9 h-9 rounded shrink-0" />
                      <span className="flex flex-col">
                        <span className="font-medium flex items-center gap-1.5">
                          {project.featured && (
                            <Star size={10} className="text-[color:rgb(var(--win-fg)_/_0.5)]" fill="currentColor" strokeWidth={0} />
                          )}
                          {project.title}
                        </span>
                        <span className="text-[color:rgb(var(--win-fg)_/_0.4)] text-xs line-clamp-1">{project.description}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[color:rgb(var(--win-fg)_/_0.6)] tabular-nums">{project.year ?? "—"}</td>
                  <td className="px-4 py-2.5"><TechChips stack={project.techStack} max={3} /></td>
                  <td className="px-4 py-2.5"><ProjectLinks project={project} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
