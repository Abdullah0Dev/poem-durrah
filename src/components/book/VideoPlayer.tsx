"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ExpandIcon, MutedIcon, PauseIcon, PlayIcon, VolumeIcon } from "./Icons";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  label?: string;
  /** False when the page holding the video is not visible – pauses playback. */
  active: boolean;
}

const fmt = (s: number) =>
  Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";

export function VideoPlayer({ src, poster, label, active }: VideoPlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!active) video.current?.pause();
  }, [active]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  const btn = "grid h-7 w-7 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-[#c9a45c]";

  return (
    <div ref={box} data-no-swipe className="group absolute inset-0 bg-black">
      <video
        ref={video}
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        preload={active ? "metadata" : "none"}
        aria-label={label}
        className="h-full w-full object-cover"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {!playing && (
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
        <button type="button" onClick={() => void box.current?.requestFullscreen?.()} aria-label="ملء الشاشة" className={btn}>
          <ExpandIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
