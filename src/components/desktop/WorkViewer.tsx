"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import type { WorkItem } from "@/lib/workItems";

export function WorkViewer({ item, onClose }: { item: WorkItem | null; onClose: () => void }) {
  const [errored, setErrored] = useState(false);

  return (
    <AnimatePresence onExitComplete={() => setErrored(false)}>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-10"
          onClick={onClose}
        >
          <button
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="relative max-w-4xl w-full max-h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {item.kind === "video" ? (
              errored ? (
                <p className="text-white/50 text-sm py-20">{item.label} — video file not found</p>
              ) : (
                <video
                  key={item.video.src}
                  src={item.video.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-[75vh] rounded-lg bg-black"
                  onError={() => setErrored(true)}
                />
              )
            ) : (
              <div className="relative w-full h-[70vh]">
                <Image src={item.photo.url} alt={item.label} fill sizes="90vw" className="object-contain" />
              </div>
            )}
            <div className="mt-4 text-center">
              <h3 className="text-white text-base font-semibold">{item.label}</h3>
              {item.kind === "photo" && item.photo.location && (
                <p className="text-white/50 text-xs mt-1">{item.photo.location}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
