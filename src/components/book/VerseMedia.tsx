"use client";

import { useState } from "react";
import { resolveMediaType } from "@/lib/media";
import type { VerseMedia as VerseMediaData } from "@/types/poem";
import { VideoPlayer } from "./VideoPlayer";

interface Props { media: VerseMediaData; label: string; active: boolean }

export function VerseMedia({ media, label, active }: Props) {
  const [failed, setFailed] = useState(false);
  const isVideo = resolveMediaType(media) === "video";

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.2cqw]">
      {isVideo ? (
        <VideoPlayer src={media.src} poster={media.poster} label={label} active={active} />
      ) : failed ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#8a5a2b,#2a1608_75%)]" />
      ) : (
        <>
          {/* Plain <img> on purpose: accepts any local or remote URL without next/image config. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.src}
            alt={media.alt ?? label}
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
            className="h-full w-full select-none object-cover"
          />
          <div aria-hidden className="media-vignette pointer-events-none absolute inset-0" />
        </>
      )}
    </div>
  );
}
