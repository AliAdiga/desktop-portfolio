"use client";

import React, { useState, useEffect } from "react";
import { PortfolioData, Photo } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function PhotosApp({ data }: { data: PortfolioData }) {
  const photos = data.photos || [];
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Lock body scroll when a photo is selected
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedPhoto]);

  return (
    <div className="flex flex-col min-h-[calc(100%+3rem)] bg-black text-white pb-24 relative -mx-5 -mt-4 -mb-8">

      {/* Grid */}
      <div className="p-1">
        <div className="grid grid-cols-3 gap-1">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="aspect-square relative bg-[#222] cursor-pointer"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                sizes="33vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
        
        {photos.length === 0 && (
          <div className="flex-1 flex items-center justify-center h-full min-h-[300px]">
            <p className="text-white/40 text-sm">No photos available.</p>
          </div>
        )}
      </div>

      {/* Fullscreen Photo Viewer */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Safe area top */}
            <div className="h-14 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10 flex items-end px-4 pb-2">
              <button
                className="text-blue-500 font-medium active:opacity-70 flex items-center gap-1"
                onClick={() => setSelectedPhoto(null)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
            </div>
            
            {/* Image container */}
            <div className="flex-1 relative flex items-center justify-center pt-14 pb-24">
              <div className="relative w-full h-full">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Info overlay */}
            <div className="absolute bottom-0 w-full p-6 pb-safe bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center text-center">
              <h3 className="text-white text-base font-semibold">{selectedPhoto.caption}</h3>
              <div className="flex items-center justify-center gap-2 mt-1 text-white/50 text-xs">
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
