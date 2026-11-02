export type MediaType = "image" | "video";

export interface VerseMedia {
  /** Local (`/media/x.jpg`) or remote (`https://...`) URL. */
  src: string;
  /** Optional – inferred from the file extension when omitted. */
  type?: MediaType;
  alt?: string;
  /** Poster frame for videos. */
  poster?: string;
}

/** One "بيت" – a line of poetry with the media shown above it. */
export interface Verse {
  id: string;
  text: string;
  media: VerseMedia;
}

/** A physical page holding three verses. */
export interface BookPage {
  id: string;
  verses: Verse[];
}

export interface PoemBook {
  title: string;
  pages: BookPage[];
}
