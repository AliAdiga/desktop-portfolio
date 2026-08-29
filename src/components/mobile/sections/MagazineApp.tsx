"use client";

import React, { useState, useCallback } from "react";
import { PortfolioData } from "@/types/portfolio";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import Image from "next/image";

export function MagazineApp({ data }: { data: PortfolioData }) {
  const pages = data.magazine || [];
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(pages.length - 1, i))),
    [pages.length]
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) goTo(index + 1);
    else if (info.offset.x > 60) goTo(index - 1);
  };

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-white/40 text-sm">No magazine pages yet.</p>
      </div>
    );
  }

  const page = pages[index];

  return (
    <div className="flex flex-col min-h-[calc(100%+3rem)] bg-black text-white -mx-5 -mt-4 -mb-8 pb-8">
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 420 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {page.kind === "cover" ? (
              <div className="relative w-full h-full flex items-end p-6 pb-10">
                {page.image ? (
                  <Image src={page.image} alt={page.title} fill sizes="100vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1c212b] to-[#0a0c11]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative">
                  <h1 className="text-4xl font-bold text-white leading-none">{page.title}</h1>
                  {page.subtitle && <p className="text-white/60 mt-2 text-sm">{page.subtitle}</p>}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="relative h-1/2 bg-gradient-to-br from-[#232a35] to-[#12151b]">
                  {page.image && (
                    <Image src={page.image} alt={page.heading} fill sizes="100vw" className="object-cover" />
                  )}
                </div>
                <div className="flex-1 px-6 py-6">
                  <h2 className="text-2xl font-bold text-white mb-3">{page.heading}</h2>
                  <p className="text-white/60 text-sm leading-relaxed">{page.body}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 pt-3">
        {pages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Page ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === index ? "bg-white scale-125" : "bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
