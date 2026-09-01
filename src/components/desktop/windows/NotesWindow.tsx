"use client";

import React, { useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { Pin, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}



export function NotesWindow({ data }: { data: PortfolioData }) {
  const notes = data.notes || [];
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const [selectedId, setSelectedId] = useState(sorted[0]?.id || "");
  const [search, setSearch] = useState("");

  const filtered = sorted.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );
  const activeNote = notes.find((n) => n.id === selectedId) || filtered[0];

  return (
    <div className="flex h-[calc(100%+3rem)] -m-6 rounded-b-xl overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-[260px] bg-[var(--win-sidebar)] border-r border-[color:rgb(var(--win-fg)_/_0.1)] flex flex-col shrink-0">
        {/* Search */}
        <div className="p-3">
          <div className="flex items-center gap-2 bg-[color:rgb(var(--win-fg)_/_0.1)] rounded-lg px-3 py-1.5">
            <Search size={14} className="text-[color:rgb(var(--win-fg)_/_0.4)] shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-[color:rgb(var(--win-fg)_/_0.9)] placeholder:text-[color:rgb(var(--win-fg)_/_0.3)] w-full"
            />
          </div>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={`w-full text-left px-4 py-3 border-b border-[color:rgb(var(--win-fg)_/_0.05)] transition-colors ${
                note.id === activeNote?.id
                  ? "bg-yellow-500/20"
                  : "hover:bg-[color:rgb(var(--win-fg)_/_0.05)]"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                {note.pinned && <Pin size={10} className="text-yellow-400 shrink-0" />}
                <span className="text-sm font-semibold text-[color:rgb(var(--win-fg))] truncate">
                  {note.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[color:rgb(var(--win-fg)_/_0.4)]">
                <span>{formatDate(note.date)}</span>
                <span className="truncate">{note.content.slice(0, 40)}…</span>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="text-[color:rgb(var(--win-fg)_/_0.3)] text-sm text-center py-8">No notes found.</p>
          )}
        </div>

        <div className="px-4 py-2 text-xs text-[color:rgb(var(--win-fg)_/_0.3)] border-t border-[color:rgb(var(--win-fg)_/_0.05)] text-center">
          {notes.length} Notes
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[var(--win-bg-alt)] flex flex-col overflow-hidden">
        {activeNote ? (
          <>
            <div className="px-8 pt-6 pb-4 border-b border-[color:rgb(var(--win-fg)_/_0.05)] shrink-0">
              <h2 className="text-2xl font-bold text-[color:rgb(var(--win-fg))] mb-1">{activeNote.title}</h2>
              <span className="text-xs text-[color:rgb(var(--win-fg)_/_0.4)]">{formatDate(activeNote.date)}</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
              <div className="prose prose-invert prose-sm max-w-[600px] text-[color:rgb(var(--win-fg)_/_0.7)]">
                <ReactMarkdown>{activeNote.content}</ReactMarkdown>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[color:rgb(var(--win-fg)_/_0.2)] text-sm">
            Select a note to read
          </div>
        )}
      </div>
    </div>
  );
}
