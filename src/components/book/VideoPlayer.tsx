"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ExpandIcon, MutedIcon, PauseIcon, PlayIcon, VolumeIcon } from "./Icons";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  label?: string;
  /** The page holding the video is open. */
  active: boolean;
  /** The page is the open spread or its neighbour – worth loading metadata for. */
  near: boolean;
}

type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

const fmt = (s: number) =>
  Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";

export function VideoPlayer({ src, poster, label, active, near }: VideoPlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [warm, setWarm] = useState(false); // user showed intent (hover/touch) → buffer more
  const [lite, setLite] = useState(false); // Save-Data: don't load videos in the background

  useEffect(() => {
    const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setLite(!!c?.saveData);
  }, []);

  /** Open page always loads; neighbours load metadata only. Everything else is released. */
  const shouldLoad = active || (near && !lite);
  const preload = shouldLoad ? (active && warm ? "auto" : "metadata") : "none";

  useEffect(() => {
    if (!active) video.current?.pause();
  }, [active]);

  // Far away → drop the buffer and decoder (important on phones).
  useEffect(() => {
    if (shouldLoad) return;
    const v = video.current;
    if (!v) return;
    v.pause();
    v.load();
    setPlaying(false); setBuffering(false); setTime(0); setDuration(0);
  }, [shouldLoad]);

  const toggle = () => {
    const v = video.current;
    if (!v || failed) return;
    setWarm(true);
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  const retry = () => {
    setFailed(false);
    video.current?.load();
  };

  const fullscreen = () => {
    const v = video.current as FsVideo | null;
    if (document.fullscreenElement) { void document.exitFullscreen(); return; }
    // iPhone Safari only supports fullscreen on the <video> itself.
    if (box.current?.requestFullscreen) void box.current.requestFullscreen().catch(() => v?.webkitEnterFullscreen?.());
    else v?.webkitEnterFullscreen?.();
  };

  const btn = "grid h-7 w-7 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-[#c9a45c]";

  return (
    <div
      ref={box}
      data-no-swipe
      className="group absolute inset-0 bg-black"
      onPointerEnter={() => setWarm(true)}
      onFocusCapture={() => setWarm(true)}
    >
      <video
        ref={video}
        // #t=0.001 makes browsers (iOS Safari especially) paint the first frame when there is no poster.
        src={shouldLoad ? `${src}#t=0.001` : undefined}
        poster={poster}
        muted={muted}
        playsInline
        preload={preload}
        aria-label={label}
        className="h-full w-full object-cover"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => { setPlaying(false); setBuffering(false); }}
        onEnded={() => setPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onError={() => { if (shouldLoad) setFailed(true); }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {buffering && !failed && (
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-[3px] border-[#c9a45c]/30 border-t-[#c9a45c]" />
      )}

      {failed && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/75 p-3 text-center text-[#f1dfb0]">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">تعذّر تشغيل الفيديو</span>
            <button type="button" onClick={retry} className="rounded-full border border-[#c9a45c] px-3 py-1 text-sm transition hover:bg-white/10">إعادة المحاولة</button>
          </div>
        </div>
      )}

      {!playing && !buffering && !failed && (
        <button
          type="button"
          onClick={toggle}
          aria-label="تشغيل"
          className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#c9a45c] bg-[#3a1a0c]/80 text-[#f1dfb0] shadow-lg backdrop-blur-sm transition hover:scale-105"
        >
          <PlayIcon className="ml-0.5 h-6 w-6" />
        </button>
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/85 to-transparent px-2.5 pb-1.5 pt-6 text-[#f1dfb0] transition-opacity",
          playing ? "opacity-0 focus-within:opacity-100 group-hover:opacity-100" : "opacity-100",
        )}
      >
        <button type="button" onClick={toggle} aria-label={playing ? "إيقاف مؤقت" : "تشغيل"} className={btn}>
          {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        </button>
        <input
          type="range" className="seek min-w-0 flex-1" aria-label="موضع التشغيل"
          min={0} max={duration || 0} step={0.1} value={time}
          onChange={(e) => { if (video.current) video.current.currentTime = Number(e.target.value); }}
        />
        <span className="text-[11px] tabular-nums opacity-90">{fmt(time)}</span>
        <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"} className={btn}>
          {muted ? <MutedIcon className="h-4 w-4" /> : <VolumeIcon className="h-4 w-4" />}
        </button>
        <button type="button" onClick={fullscreen} aria-label="ملء الشاشة" className={btn}>
          <ExpandIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}