"use client";

import React, { useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { Pin, ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}



export function NotesApp({ data }: { data: PortfolioData }) {
  const notes = data.notes || [];
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeNote = notes.find((n) => n.id === selectedId);

  // If a note is selected, show the detail view
  if (activeNote) {
    return (
      <div className="flex flex-col min-h-[calc(100%+3rem)] bg-[#1a1a1a] text-white pb-24 relative -mx-5 -mt-4 -mb-8">
        {/* Back button */}
        <div className="sticky top-0 z-10 bg-[#1a1a1a]/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-1 text-yellow-400 text-sm font-medium"
          >
            <ChevronLeft size={18} />
            Notes
          </button>
        </div>

        <div className="px-5 pt-6 pb-4">
          <h1 className="text-2xl font-bold mb-1">{activeNote.title}</h1>
          <span className="text-xs text-white/40">{formatDate(activeNote.date)}</span>
        </div>

        <div className="px-5 pb-8">
          <div className="prose prose-invert prose-sm text-white/70">
            <ReactMarkdown>{activeNote.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  // Note list view
  return (
    <div className="flex flex-col min-h-[calc(100%+3rem)] bg-[#1a1a1a] text-white pb-24 relative -mx-5 -mt-4 -mb-8">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-3xl font-bold">Notes</h1>
        <p className="text-sm text-white/40 mt-1">{notes.length} notes</p>
      </div>

      <div className="flex flex-col">
        {sorted.map((note) => (
          <button
            key={note.id}
            onClick={() => setSelectedId(note.id)}
            className="text-left px-5 py-4 border-b border-white/5 active:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1">
              {note.pinned && <Pin size={12} className="text-yellow-400 shrink-0" />}
              <span className="text-base font-semibold text-white truncate">
                {note.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="shrink-0">{formatDate(note.date)}</span>
              <span className="truncate">{note.content.slice(0, 60)}…</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
