import { imageAttrs } from "./mediaImage";

const done = new Set<string>();
const inflight = new Set<string>();
const keep = new Map<string, HTMLImageElement>(); // holds decoded images so they are not garbage-collected
const MAX_PARALLEL = 3;
const MAX_KEPT = 48;
let pending: string[] = [];

export const isPreloaded = (src: string) => done.has(src);

function load(src: string) {
  inflight.add(src);
  const a = imageAttrs(src);
  const img = new Image();
  img.decoding = "async";
  if (a.srcSet) { img.sizes = a.sizes ?? ""; img.srcset = a.srcSet; } // sizes/srcset before src
  img.src = a.src;
  keep.set(src, img);
  if (keep.size > MAX_KEPT) keep.delete(keep.keys().next().value as string);
  img
    .decode()
    .then(() => { done.add(src); })
    .catch(() => {})
    .finally(() => { inflight.delete(src); pump(); });
}

function pump() {
  while (inflight.size < MAX_PARALLEL && pending.length) {
    const src = pending.shift()!;
    if (!done.has(src) && !inflight.has(src)) load(src);
  }
}

/** Replaces the waiting list (most urgent first) – so fast navigation never loads stale pages. */
export function enqueueImages(urls: string[]) {
  pending = Array.from(new Set(urls)).filter((u) => !done.has(u) && !inflight.has(u));
  pump();
}
