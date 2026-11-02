import type { MediaType, VerseMedia } from "@/types/poem";

const VIDEO_EXT = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i;

export function resolveMediaType(media: VerseMedia): MediaType {
  return media.type ?? (VIDEO_EXT.test(media.src) ? "video" : "image");
}
