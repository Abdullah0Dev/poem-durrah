export type MediaType = "image" | "video";

export interface VerseMedia {
  /** Local (`/media/x.jpg`, always with a leading slash) or remote (`https://...`) URL. */
  src: string;
  /** Optional – inferred from the file extension when omitted. */
  type?: MediaType;
  alt?: string;
  /** Poster frame for videos. */
  poster?: string;
}

/** One "بيت": `text` is "صدر ** عجز". */
export interface Verse {
  id: string;
  text: string;
  media: VerseMedia;
}

/** A physical page holding up to three verses. */
export interface BookPage {
  id: string;
  verses: Verse[];
}

export interface Poem {
  id: string;
  title: string;
  poet?: string;
  pages: BookPage[];
}

/** The whole book: a diwan made of several poems. The index (فهرس) is generated automatically. */
export interface Diwan {
  title: string;
  poems: Poem[];
}
