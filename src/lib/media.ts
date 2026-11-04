import type { MediaType, VerseMedia } from "@/types/poem";

const VIDEO_EXT = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i;

/** Set to false if you don't generate `name.poster.jpg` files next to your videos. */
const AUTO_POSTER = true;

export function posterFor(media: VerseMedia): string | undefined {
  if (media.poster) return media.poster;
  if (AUTO_POSTER && media.src.startsWith("/") && resolveMediaType(media) === "video") {
    return media.src.replace(/\.[a-z0-9]+(\?.*)?$/i, ".poster.jpg");
  }
  return undefined;
}

export function resolveMediaType(media: VerseMedia): MediaType {
  return media.type ?? (VIDEO_EXT.test(media.src) ? "video" : "image");
}