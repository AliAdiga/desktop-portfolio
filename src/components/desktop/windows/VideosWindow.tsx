"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { PortfolioData, Profile, VideoItem } from "@/types/portfolio";
import { ChevronLeft, ChevronRight } from "lucide-react";

// RIGHT page of a spread: the demo clip itself.
//
// Fitted with object-contain, never object-cover. Demos are screen recordings
// of real sites at whatever shape the site was recorded at, so cropping one to
// fill the page cuts off the content the demo exists to show. Any letterbox
// falls on the page's own background, which reads as margin rather than as a
// broken frame.
//
// The paper-curl flip (bend, shadow, highlight sweep) is handled by
// react-pageflip/StPageFlip on the page root this ref is attached to — this
// component only owns the content, not the turn animation.
const VideoPage = React.forwardRef<HTMLDivElement, { video: VideoItem; active: boolean }>(
  ({ video, active }, ref) => {
    const [errored, setErrored] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      const el = videoRef.current;
      if (!el) return;
      if (active) el.play().catch(() => {});
      else el.pause();
    }, [active]);

    return (
      <div
        ref={ref}
        className="relative w-full h-full bg-[#0b0d10] border border-white/10 border-l-0 overflow-hidden"
      >
        {errored ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/40 text-xs px-6 text-center">{video.title} — video file not found</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={video.src}
            muted
            loop
            playsInline
            controls={active}
            poster={video.poster}
            preload={active ? "auto" : "none"}
            className="absolute inset-0 w-full h-full object-contain"
            onError={() => setErrored(true)}
          />
        )}
        {/* Spine shading only — no title caption here. The facing left page
            already carries the title, and a bottom-pinned caption collides
            with the video's own control bar once the page is active. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent" />
      </div>
    );
  }
);
VideoPage.displayName = "VideoPage";

// LEFT page of a spread: the write-up for the SAME video.
const DetailPage = React.forwardRef<HTMLDivElement, { video: VideoItem }>(({ video }, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full h-full flex flex-col justify-center px-8 py-10 bg-gradient-to-br from-[#1e2129] to-[#0e1013] border border-white/10 border-r-0 overflow-hidden"
    >
      {video.meta && <p className="text-white/35 text-[11px] uppercase tracking-wide mb-3">{video.meta}</p>}
      <h3 className="text-white text-xl font-bold mb-4 leading-snug">{video.title}</h3>
      {video.description && (
        <p className="text-white/55 text-sm leading-relaxed max-w-[38ch]">{video.description}</p>
      )}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent" />
    </div>
  );
});
DetailPage.displayName = "DetailPage";

// LEFT page of the closing spread. Exists so the book never dead-ends on the
// last reel — there's always one more page to turn, and it lands on contact
// details rather than a hard stop.
const OutroPage = React.forwardRef<HTMLDivElement, { profile: Profile }>(({ profile }, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full h-full flex flex-col justify-center px-8 py-10 bg-gradient-to-br from-[#1e2129] to-[#0e1013] border border-white/10 border-r-0 overflow-hidden"
    >
      <p className="text-white/35 text-[11px] uppercase tracking-wide mb-3">End of reel</p>
      <h3 className="text-white text-xl font-bold mb-4 leading-snug">Let&apos;s work together</h3>
      <p className="text-white/55 text-sm leading-relaxed max-w-[38ch] mb-6">
        Got a project in mind? Happy to talk it through — no pitch deck required.
      </p>
      <div className="flex flex-col gap-1.5 text-sm">
        {profile.email && (
          <a href={`mailto:${profile.email}`} className="text-white/80 hover:text-white transition-colors">
            {profile.email}
          </a>
        )}
        {profile.phone && (
          <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="text-white/80 hover:text-white transition-colors">
            {profile.phone}
          </a>
        )}
        {/* No contact set yet → render nothing rather than a dev note, so the
            page still reads clean in a client review. Fill in email/phone in
            src/data/profile.ts to light this up. */}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent" />
    </div>
  );
});
OutroPage.displayName = "OutroPage";

// RIGHT page of the closing spread — the back cover.
const BackCoverPage = React.forwardRef<HTMLDivElement, { profile: Profile }>(({ profile }, ref) => {
  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      ref={ref}
      className="relative w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#15181e] to-[#08090c] border border-white/10 border-l-0 overflow-hidden"
    >
      <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center">
        <span className="text-white/70 text-lg font-semibold tracking-wide">{initials || "—"}</span>
      </div>
      <div className="text-center">
        <p className="text-white/70 text-sm font-medium">{profile.name}</p>
        {profile.role && <p className="text-white/30 text-[11px] mt-0.5">{profile.role}</p>}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent" />
    </div>
  );
});
BackCoverPage.displayName = "BackCoverPage";

export function VideosWindow({ data }: { data: PortfolioData }) {
  const videos = data.videos || [];
  const [activeIndex, setActiveIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  // One spread per video, plus a final closing spread — so the last reel is
  // never a dead end with nothing to turn to.
  const spreadCount = videos.length + 1;
  const lastSpread = spreadCount - 1;
  const onClosingSpread = activeIndex >= videos.length;

  const flipTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(spreadCount - 1, i));
      bookRef.current?.pageFlip()?.flip(clamped * 2);
    },
    [spreadCount]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") flipTo(activeIndex + 1);
      if (e.key === "ArrowLeft") flipTo(activeIndex - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, flipTo]);

  const handleFlip = useCallback((e: { data: number }) => {
    setActiveIndex(Math.floor(e.data / 2));
  }, []);

  return (
    <div className="flex flex-col h-[calc(100%+3rem)] bg-[#161616] -m-6 rounded-b-xl overflow-hidden font-sans relative">
      {/* Toolbar */}
      <div className="bg-[#2d2d2d]/90 backdrop-blur-md px-4 py-2 border-b border-black/20 shrink-0 sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-white font-bold text-sm">Demos</h2>
        <span className="text-white/50 text-xs">{videos.length} items</span>
      </div>

      {videos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/40 text-sm">No videos yet.</p>
        </div>
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center p-4 min-h-0">
            <HTMLFlipBook
              ref={bookRef}
              // Landscape pages: these demos are recordings of desktop sites,
              // so the page is shaped like a browser window rather than a phone.
              // width/height also act as the aspect ratio that size="stretch"
              // preserves while scaling between the min/max bounds.
              width={520}
              height={340}
              size="stretch"
              minWidth={360}
              maxWidth={760}
              minHeight={235}
              maxHeight={500}
              startPage={0}
              drawShadow
              flippingTime={800}
              usePortrait={false}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.5}
              showCover={false}
              mobileScrollSupport={false}
              clickEventForward
              useMouseEvents
              swipeDistance={30}
              showPageCorners
              disableFlipByClick={false}
              className="drop-shadow-2xl"
              style={{ width: "100%", height: "100%" }}
              onFlip={handleFlip}
            >
              {[
                ...videos.flatMap((video, i) => [
                  <DetailPage key={`${video.id}-detail`} video={video} />,
                  <VideoPage key={`${video.id}-video`} video={video} active={i === activeIndex} />,
                ]),
                <OutroPage key="outro" profile={data.profile} />,
                <BackCoverPage key="back-cover" profile={data.profile} />,
              ]}
            </HTMLFlipBook>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-center gap-5 py-3 bg-[#1a1a1a] shrink-0 border-t border-black/20">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white/6 hover:bg-white/14 disabled:opacity-30 disabled:hover:bg-white/6 flex items-center justify-center text-white transition-colors"
              disabled={activeIndex === 0}
              onClick={() => flipTo(activeIndex - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-white/40 text-xs tabular-nums">
              {onClosingSpread ? "End" : `${activeIndex + 1} / ${videos.length}`}
            </span>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white/6 hover:bg-white/14 disabled:opacity-30 disabled:hover:bg-white/6 flex items-center justify-center text-white transition-colors"
              disabled={activeIndex >= lastSpread}
              onClick={() => flipTo(activeIndex + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
