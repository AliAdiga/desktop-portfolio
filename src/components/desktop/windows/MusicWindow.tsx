"use client";

import React, { useState, useRef, useEffect } from "react";
import { PortfolioData } from "@/types/portfolio";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react";
import Image from "next/image";

export function MusicWindow({ data }: { data: PortfolioData }) {
  const playlist = data.playlist || [];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = playlist[currentTrackIndex];

  // Handle play/pause
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

  // Play immediately when track changes if it was already playing or just clicked
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(current);
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTo = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTo;
      setCurrentTime(seekTo);
      setProgress(Number(e.target.value));
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-[calc(100%+3rem)] bg-[#121212] text-white -m-6 rounded-b-xl overflow-hidden font-sans">
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        muted={isMuted}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {/* Header */}
          <div className="h-64 bg-gradient-to-b from-[#1db954]/40 to-[#121212] p-8 flex items-end gap-6 shrink-0">
            <div className="w-48 h-48 shadow-2xl shrink-0 relative group">
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
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold tracking-widest uppercase text-white/80">Playlist</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2">My Top Tracks</h1>
              <span className="text-white/70 font-medium">{data.profile.name} • {playlist.length} songs</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="px-8 py-6 flex items-center gap-6 shrink-0 bg-black/20">
            <button 
              onClick={togglePlay}
              className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-white/50 hover:text-white transition-colors">
              <Shuffle size={24} />
            </button>
            <button className="text-white/50 hover:text-white transition-colors">
              <Repeat size={24} />
            </button>
          </div>

          {/* Tracklist Table */}
          <div className="px-8 pb-8 flex-1">
            <div className="grid grid-cols-[16px_minmax(0,1fr)_80px] gap-4 px-4 py-2 text-white/50 text-sm font-medium border-b border-white/10 uppercase tracking-wider mb-4">
              <div className="text-center">#</div>
              <div>Title</div>
              <div className="text-right">Time</div>
            </div>

            <div className="flex flex-col">
              {playlist.map((song, index) => {
                const isActive = index === currentTrackIndex;
                return (
                  <div
                    key={song.id}
                    onClick={() => playTrack(index)}
                    className={`grid grid-cols-[16px_minmax(0,1fr)_80px] gap-4 px-4 py-3 rounded-md hover:bg-white/10 cursor-pointer group transition-colors ${
                      isActive ? "bg-white/10" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center text-white/50 text-base">
                      {isActive ? (
                        <div className="w-3 h-3 flex items-end justify-between">
                          <div className="w-[3px] h-full bg-[#1db954] animate-[bounce_1s_infinite]" />
                          <div className="w-[3px] h-[60%] bg-[#1db954] animate-[bounce_0.8s_infinite]" />
                          <div className="w-[3px] h-[80%] bg-[#1db954] animate-[bounce_1.2s_infinite]" />
                        </div>
                      ) : (
                        <span className="group-hover:hidden">{index + 1}</span>
                      )}
                      {!isActive && <Play size={14} fill="currentColor" className="hidden group-hover:block text-white" />}
                    </div>
                    
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-white/10 relative shrink-0">
                        {song.coverUrl && (
                          <Image src={song.coverUrl} alt={song.title} fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-base font-semibold truncate ${isActive ? "text-[#1db954]" : "text-white"}`}>
                          {song.title}
                        </span>
                        <span className="text-sm text-white/60 truncate group-hover:text-white/80 transition-colors">
                          {song.artist}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end text-sm text-white/50 group-hover:text-white/80 transition-colors tabular-nums">
                      {song.duration}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Playback Bar */}
      <div className="h-[90px] bg-[#181818] border-t border-white/10 px-4 flex items-center justify-between shrink-0">
        
        {/* Left: Now Playing Info */}
        <div className="w-[30%] min-w-[180px] flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 relative shrink-0">
            {currentTrack?.coverUrl && (
              <Image src={currentTrack.coverUrl} alt={currentTrack.title} fill sizes="56px" className="object-cover" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
              {currentTrack?.title}
            </span>
            <span className="text-xs text-white/60 truncate hover:underline cursor-pointer">
              {currentTrack?.artist}
            </span>
          </div>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex-1 max-w-[722px] flex flex-col items-center gap-2 px-8">
          <div className="flex items-center gap-6">
            <button className="text-white/70 hover:text-white transition-colors" onClick={handlePrev}>
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <button className="text-white/70 hover:text-white transition-colors" onClick={handleNext}>
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
          
          <div className="w-full flex items-center gap-2 text-xs text-white/50 font-medium tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-white/20 rounded-full group flex items-center relative">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="h-full bg-white rounded-full group-hover:bg-[#1db954] transition-colors" 
                style={{ width: `${progress}%` }} 
              />
              <div 
                className="w-3 h-3 bg-white rounded-full absolute hidden group-hover:block shadow-md z-0" 
                style={{ left: `calc(${progress}% - 6px)` }} 
              />
            </div>
            <span>{currentTrack?.duration}</span>
          </div>
        </div>

        {/* Right: Volume etc. */}
        <div className="w-[30%] min-w-[180px] flex items-center justify-end gap-3 text-white/70">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="w-24 h-1 bg-white/20 rounded-full group flex items-center relative">
            <div className="h-full bg-white rounded-full group-hover:bg-[#1db954] transition-colors w-full" />
          </div>
        </div>
        
      </div>
    </div>
  );
}
