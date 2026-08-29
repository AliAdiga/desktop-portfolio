"use client";

import React, { useState, useRef, useEffect } from "react";
import { PortfolioData } from "@/types/portfolio";
import { Play, Pause, SkipForward, Shuffle, Repeat } from "lucide-react";
import Image from "next/image";

export function MusicApp({ data }: { data: PortfolioData }) {
  const playlist = data.playlist || [];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = playlist[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100%+3rem)] bg-[#121212] text-white pb-32 relative -mx-5 -mt-4 -mb-8">
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      {/* Header Info */}
      <div className="bg-gradient-to-b from-[#1db954]/30 to-[#121212] px-4 pt-16 pb-6 flex flex-col items-center">
        <div className="w-48 h-48 shadow-2xl relative mb-6">
          {currentTrack?.coverUrl && (
            <Image
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              fill
              sizes="(max-width: 768px) 100vw, 200px"
              className="object-cover"
            />
          )}
        </div>
        <h1 className="text-2xl font-bold mb-1 text-center">My Top Tracks</h1>
        <p className="text-white/60 text-sm">Playlist by {data.profile.name}</p>
        
        {/* Play Button Row */}
        <div className="w-full flex items-center justify-between mt-6 px-2">
          <div className="flex gap-4 text-white/60">
            <button className="hover:text-white"><Shuffle size={24} /></button>
            <button className="hover:text-white"><Repeat size={24} /></button>
          </div>
          <button 
            onClick={togglePlay}
            className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center text-black active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="px-4 flex flex-col gap-1">
        {playlist.map((song, index) => {
          const isActive = index === currentTrackIndex;
          return (
            <div
              key={song.id}
              onClick={() => playTrack(index)}
              className="flex items-center gap-3 p-2 rounded-md active:bg-white/10"
            >
              <div className="w-12 h-12 bg-white/10 relative shrink-0">
                {song.coverUrl && (
                  <Image src={song.coverUrl} alt={song.title} fill sizes="48px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className={`text-base font-medium truncate ${isActive ? "text-[#1db954]" : "text-white"}`}>
                  {song.title}
                </span>
                <span className="text-sm text-white/60 truncate">
                  {song.artist}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Player (Sticky Bottom) */}
      <div className="fixed bottom-[30px] left-3 right-3 z-40">
        {/* Progress bar on top */}
        <div className="h-[2px] bg-white/10 rounded-t-lg overflow-hidden">
          <div 
            className="h-full bg-[#1db954] transition-all duration-300 ease-linear" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="bg-[#242424] rounded-b-lg px-2.5 py-1.5 flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/5">
          <div className="w-9 h-9 bg-white/10 relative shrink-0 rounded overflow-hidden">
            {currentTrack?.coverUrl && (
              <Image src={currentTrack.coverUrl} alt={currentTrack.title} fill sizes="36px" className="object-cover" />
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-white truncate">
              {currentTrack?.title}
            </span>
            <span className="text-[10px] text-white/50 truncate">
              {currentTrack?.artist}
            </span>
          </div>
          
          <div className="flex items-center gap-0.5">
            <button 
              onClick={togglePlay} 
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black active:scale-90 transition-transform"
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={handleNext} className="p-1.5 active:scale-90 transition-transform text-white/60">
              <SkipForward size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
