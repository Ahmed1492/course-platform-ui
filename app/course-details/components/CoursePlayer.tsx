"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Vendor-prefixed document/video types ────────────────────────────────────

interface WebkitDocument extends Document {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => void;
}

interface WebkitHTMLVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}
function VolumeIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
function FullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}
function ExitFullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  );
}
function WideIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <polyline points="13 9 16 12 13 15" />
      <polyline points="11 9 8 12 11 15" />
    </svg>
  );
}
function ExitWideIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <polyline points="10 9 7 12 10 15" />
      <polyline points="14 9 17 12 14 15" />
    </svg>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const POSTER =
  "https://images.pexels.com/photos/4709289/pexels-photo-4709289.jpeg";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  wide: boolean;
  onWideToggle: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CoursePlayer({ wide, onWideToggle }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // showControls is driven only by user interaction & play state — never by effects
  const showControlsRef = useRef(true);
  const [showControls, setShowControls] = useState(true);

  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Auto-hide controls (called only from event handlers, not effects) ─────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    showControlsRef.current = true;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      // Only hide when video is actually playing
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
        showControlsRef.current = false;
      }
    }, 3000);
  }, []);

  // ── Mobile sticky ─────────────────────────────────────────────────────────
  useEffect(() => {
    function check() {
      const isMobile = window.innerWidth < 1024;
      if (!isMobile) {
        setIsSticky(false);
        return;
      }
      const sentinel = sentinelRef.current;
      if (!sentinel) return;
      setIsSticky(sentinel.getBoundingClientRect().bottom < 0);
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  // ── Fullscreen change ─────────────────────────────────────────────────────
  useEffect(() => {
    const doc = document as WebkitDocument;
    const onFsChange = () =>
      setIsFullscreen(
        !!(document.fullscreenElement || doc.webkitFullscreenElement),
      );
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  // ── Controls ──────────────────────────────────────────────────────────────
  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (!hasStarted) setHasStarted(true);
    if (v.paused) {
      v.play();
      setPlaying(true);
      // Start hide timer when play begins
      resetHideTimer();
    } else {
      v.pause();
      setPlaying(false);
      // Always show controls when paused
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setShowControls(true);
    }
  }

  function seekTo(e: React.MouseEvent<HTMLDivElement>) {
    const bar = progressRef.current;
    const v = videoRef.current;
    if (!bar || !v || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    v.currentTime = ratio * duration;
  }

  function onVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setMuted(val === 0);
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  async function toggleFullscreen() {
    const el = playerRef.current;
    const v = videoRef.current as WebkitHTMLVideoElement | null;
    const doc = document as WebkitDocument;
    if (!el || !v) return;

    const isFs = !!(document.fullscreenElement || doc.webkitFullscreenElement);
    if (!isFs) {
      if (el.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
      } else if (v.webkitEnterFullscreen) {
        v.webkitEnterFullscreen();
      }
      try {
        await (
          screen.orientation as ScreenOrientation & {
            lock?: (o: string) => Promise<void>;
          }
        ).lock?.("landscape");
      } catch {
        /* unsupported */
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
      try {
        screen.orientation.unlock?.();
      } catch {
        /* unsupported */
      }
    }
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Sentinel — stays in document flow, triggers sticky */}
      <div ref={sentinelRef} className="relative w-full aspect-video">
        {/* Player */}
        <div
          ref={playerRef}
          className={[
            "bg-black overflow-hidden z-30 transition-all duration-300",
            isSticky && !isFullscreen
              ? "fixed top-0 left-0 right-0"
              : "absolute inset-0",
            !wide && !isSticky ? "rounded-none lg:rounded-lg" : "rounded-none",
          ].join(" ")}
          onMouseMove={resetHideTimer}
          onTouchStart={resetHideTimer}
        >
          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover cursor-pointer"
            onTimeUpdate={() =>
              setCurrentTime(videoRef.current?.currentTime ?? 0)
            }
            onLoadedMetadata={() =>
              setDuration(videoRef.current?.duration ?? 0)
            }
            onEnded={() => {
              setPlaying(false);
              setShowControls(true);
            }}
            onClick={togglePlay}
            poster={POSTER}
            playsInline
          >
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
          </video>

          {/* Persistent bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/80 to-transparent pointer-events-none" />

          {/* ── Overlay — before first play: full poster + gradient + icon ── */}
          {!hasStarted && (
            <div
              className="absolute inset-0 cursor-pointer group"
              onClick={togglePlay}
            >
              {/* Poster */}
              <img
                src="https://images.pexels.com/photos/4709289/pexels-photo-4709289.jpeg"
                alt="Course thumbnail"
                className="w-full h-full object-cover"
              />
              {/* Gradient layers */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20
                                rounded-full bg-white shadow-2xl
                                transition-transform duration-300 group-hover:scale-110"
                >
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ping group-hover:animate-none" />
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 sm:w-8 sm:h-8 text-teal-500 ml-1"
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>

              {/* Bottom label */}
              <div className="absolute top-0 inset-x-0 px-4 pb-4">
                <p className="text-white font-semibold text-sm sm:text-base drop-shadow">
                  Starting SEO as your Home Based Business
                </p>
              </div>
            </div>
          )}

          {/* ── Overlay — paused mid-video: icon only, no image ── */}
          {hasStarted && !playing && (
            <div
              className="absolute inset-0 cursor-pointer group flex items-center justify-center"
              onClick={togglePlay}
            >
              <div
                className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20
                              rounded-full bg-white/20 backdrop-blur-sm shadow-2xl
                              transition-transform duration-300 group-hover:scale-110"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1"
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>
          )}

          {/* Controls */}
          <div
            className={`absolute inset-x-0 bottom-0 px-4 pb-3 flex flex-col gap-2
                        transition-opacity duration-300
                        ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {/* Progress bar */}
            <div
              ref={progressRef}
              onClick={seekTo}
              className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer group"
            >
              <div
                className="h-full bg-teal-400 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full
                                shadow opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

            {/* Button row */}
            <div className="flex items-center gap-3 text-white">
              <button
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                className="hover:text-teal-400 transition-colors"
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>

              <span className="text-xs tabular-nums select-none text-white/80">
                {fmt(currentTime)} / {fmt(duration)}
              </span>

              <div className="flex-1" />

              <button
                onClick={toggleMute}
                aria-label="Mute toggle"
                className="hover:text-teal-400 transition-colors"
              >
                <VolumeIcon muted={muted} />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={onVolumeChange}
                className="w-16 accent-teal-400 hidden sm:block cursor-pointer"
                aria-label="Volume"
              />

              <button
                onClick={onWideToggle}
                aria-label={wide ? "Exit wide" : "Wide mode"}
                title={wide ? "Exit wide mode" : "Wide mode"}
                className="hover:text-teal-400 transition-colors hidden lg:flex"
              >
                {wide ? <ExitWideIcon /> : <WideIcon />}
              </button>

              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Maximize"}
                className="hover:text-teal-400 transition-colors"
              >
                {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer — prevents layout jump when sticky */}
      {isSticky && !isFullscreen && (
        <div className="w-full aspect-video" aria-hidden />
      )}
    </>
  );
}
