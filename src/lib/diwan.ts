import { resolveMediaType } from "@/lib/media";
import type { Diwan, Verse } from "@/types/poem";

export const ENTRIES_PER_PAGE = 8;

export interface VersePageData {
  kind: "verses";
  id: string;
  verses: Verse[];
  poemId: string;
  poemTitle: string;
  /** Last page of its poem – shows the "تمّت" colophon when there is room. */
  poemEnd: boolean;
}
export interface IndexEntry { poemId: string; number: number; title: string; poet?: string; page: number }
export interface IndexPageData { kind: "index"; id: string; entries: IndexEntry[] }
export type RenderPage = VersePageData | IndexPageData;

/** Flattens the poems into one page list and appends the generated index pages. */
export function buildPages(diwan: Diwan): RenderPage[] {
  const pages: RenderPage[] = [];
  const entries: IndexEntry[] = [];

  diwan.poems.forEach((poem, pi) => {
    entries.push({ poemId: poem.id, number: pi + 1, title: poem.title, poet: poem.poet, page: pages.length + 1 });
    poem.pages.forEach((p, i) =>
      pages.push({
        kind: "verses",
        id: `${poem.id}:${p.id}`,
        verses: p.verses,
        poemId: poem.id,
        poemTitle: poem.title,
        poemEnd: i === poem.pages.length - 1,
      }),
    );
  });

  for (let i = 0; i < entries.length; i += ENTRIES_PER_PAGE) {
    pages.push({ kind: "index", id: `index-${i / ENTRIES_PER_PAGE}`, entries: entries.slice(i, i + ENTRIES_PER_PAGE) });
  }
  return pages;
}

/** Every image a page will need (videos load on their own, see VideoPlayer). */
export function pageImageUrls(page: RenderPage | undefined): string[] {
  if (!page || page.kind !== "verses") return [];
  return page.verses.filter((v) => resolveMediaType(v.media) === "image").map((v) => v.media.src);
}