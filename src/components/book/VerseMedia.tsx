"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { imageAttrs } from "@/lib/mediaImage";
import { posterFor, resolveMediaType } from "@/lib/media";
import { isPreloaded } from "@/lib/preload";
import type { VerseMedia as VerseMediaData } from "@/types/poem";
import { VideoPlayer } from "./VideoPlayer";

interface Props { media: VerseMediaData; label: string; active: boolean; near: boolean }

function ImageMedia({ media, label, active }: Props) {
  const attrs = useMemo(() => imageAttrs(media.src), [media.src]);
  const instant = useRef(isPreloaded(media.src)).current; // already decoded → show immediately, no fade
  const [loaded, setLoaded] = useState(instant);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth) setLoaded(true);
  }, []);

  if (failed) return <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#8a5a2b,#2a1608_75%)]" />;

  return (
    <>
      {/* Plain <img> on purpose: same srcset is used for preloading, and remote URLs need no config. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={attrs.src}
        srcSet={attrs.srcSet}
        sizes={attrs.sizes}
        alt={media.alt ?? label}
        decoding="async"
        fetchPriority={active ? "high" : "auto"}
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn("h-full w-full select-none object-cover", !instant && "transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
      />
      <div aria-hidden className="media-vignette pointer-events-none absolute inset-0" />
    </>
  );
}

export function VerseMedia(props: Props) {
  const { media, label, active } = props;
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.2cqw]">
      {resolveMediaType(media) === "video" ? (
        <VideoPlayer src={media.src} poster={posterFor(media)} label={label} active={active} near={props.near} />
      ) : (
        <ImageMedia {...props} />
      )}
    </div>
  );
}