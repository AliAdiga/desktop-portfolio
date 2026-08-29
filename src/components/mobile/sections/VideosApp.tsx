"use client";

import React, { useState, useEffect } from "react";
import { PortfolioData, VideoItem } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";

export function VideosApp({ data }: { data: PortfolioData }) {
  const videos = data.videos || [];
  const [selected, setSelected] = useState<VideoItem | null>(null);
  const [errored, setErrored] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selected]);

  return (
    <div className="flex flex-col min-h-[calc(100%+3rem)] bg-black text-white pb-24 relative -mx-5 -mt-4 -mb-8">
      <div className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {videos.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              className="text-left rounded-lg overflow-hidden bg-[#161616]"
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setErrored(null);
                setSelected(item);
              }}
            >
              <div className="aspect-video relative flex items-center justify-center bg-gradient-to-br from-[#232a35] to-[#12151b]">
                {item.poster ? (
                  <Image src={item.poster} alt={item.title} fill sizes="50vw" className="object-cover" />
                ) : null}
                <span className="relative z-10 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                  <Play size={14} className="text-white translate-x-[1px]" fill="currentColor" />
                </span>
              </div>
              <p className="text-white/80 text-[11px] font-medium px-2 py-1.5 truncate">{item.title}</p>
            </motion.button>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="flex items-center justify-center min-h-[240px]">
            <p className="text-white/40 text-sm">No videos yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            <div className="h-14 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10 flex items-end px-4 pb-2">
              <button
                className="text-blue-500 font-medium active:opacity-70 flex items-center gap-1"
                onClick={() => setSelected(null)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center px-4">
              {errored ? (
                <p className="text-white/50 text-sm">{errored}</p>
              ) : (
                <video
                  key={selected.src}
                  src={selected.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-full rounded-lg bg-black"
                  onError={() => setErrored(`${selected.title} — video file not found`)}
                />
              )}
            </div>

            <div className="p-6 pb-10 text-center">
              <h3 className="text-white text-base font-semibold">{selected.title}</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
