import { getImageProps } from "next/image";

/** Rendered width of a verse image: ~40vw on desktop, ~88vw on a phone. */
export const IMAGE_SIZES = "(max-width: 820px) 88vw, 40vw";

export interface ImageAttrs { src: string; srcSet?: string; sizes?: string }

/**
 * Local images go through Next's optimizer (resized + WebP/AVIF, so a 3 MB PNG becomes ~100 KB);
 * remote URLs are used as-is so no `remotePatterns` config is needed.
 * The same attributes are used for rendering AND preloading, so the browser picks the identical file.
 */
export function imageAttrs(src: string): ImageAttrs {
  if (!src.startsWith("/") || src.startsWith("//")) return { src };
  const { props } = getImageProps({ src, alt: "", fill: true, sizes: IMAGE_SIZES });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
}
