"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "lucide-react";
import { resolveIcon } from "@/lib/iconResolver";
import Image from "next/image";

interface BootScreenProps {
  bootLogo?: {
    type: "icon" | "image";
    value: string;
  };
}

export function BootScreen({ bootLogo }: BootScreenProps) {
  const [isBooting, setIsBooting] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate boot progress
    const duration = 2500;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      // Non-linear progress for realism
      const newProgress = Math.min(100, Math.pow(currentStep / steps, 2) * 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setIsBooting(false), 300); // small delay after 100% before fading out
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isBooting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16 relative w-16 h-16 flex items-center justify-center"
          >
            {bootLogo?.type === "image" ? (
              <Image 
                src={bootLogo.value} 
                alt="Boot Logo" 
                fill 
                sizes="64px"
                className="object-contain"
              />
            ) : bootLogo?.type === "icon" ? (
              resolveIcon(bootLogo.value, { size: 64, className: "text-white" }) || (
                <Command size={64} className="text-white" strokeWidth={1.5} />
              )
            ) : (
              <Command size={64} className="text-white" strokeWidth={1.5} />
            )}
          </motion.div>

          {/* Progress Bar Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden"
          >
            {/* Progress Bar Fill */}
            <div
              className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
