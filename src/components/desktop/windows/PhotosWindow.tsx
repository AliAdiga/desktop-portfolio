"use client";

import React, { useState } from "react";
import { PortfolioData, Photo } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function PhotosWindow({ data }: { data: PortfolioData }) {
  const photos = data.photos || [];
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="flex flex-col h-[calc(100%+3rem)] bg-[#1e1e1e] -m-6 rounded-b-xl overflow-hidden font-sans relative">
      {/* Toolbar */}
      <div className="bg-[#2d2d2d]/90 backdrop-blur-md px-4 py-2 border-b border-black/20 shrink-0 sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-white font-bold text-sm">All Photos</h2>
        <span className="text-white/50 text-xs">{photos.length} items</span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group bg-[#2a2a2a]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {photos.length === 0 && (
          <div className="flex-1 flex items-center justify-center h-full min-h-[300px]">
            <p className="text-white/40 text-sm">No photos available.</p>
          </div>
        )}
      </div>

      {/* Lightbox / Full view overlay */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/95 flex flex-col"
          >
            <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
              <button
                className="text-white/80 hover:text-white px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-sm"
                onClick={() => setSelectedPhoto(null)}
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full h-full"
              >
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </motion.div>
            </div>
            
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 w-full">
              <h3 className="text-white text-lg font-bold">{selectedPhoto.caption}</h3>
              <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
                <span>{selectedPhoto.date}</span>
                {selectedPhoto.location && (
                  <>
                    <span>•</span>
                    <span>{selectedPhoto.location}</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
