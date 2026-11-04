import { memo } from "react";
import { splitVerse } from "@/lib/verse";
import type { Verse } from "@/types/poem";
import { FrameBracket } from "./Ornaments";
import { Plate } from "./Plate";
import { VerseMedia } from "./VerseMedia";

const corners = [
  "-left-[1.4cqw] -top-[1.4cqw]",
  "-right-[1.4cqw] -top-[1.4cqw] [transform:scaleX(-1)]",
  "-bottom-[1.4cqw] -left-[1.4cqw] [transform:scaleY(-1)]",
  "-bottom-[1.4cqw] -right-[1.4cqw] [transform:scale(-1,-1)]",
];

/** A full "بيت": media on top, banner with صدر / عجز overlapping its lower edge. */
export const VerseCard = memo(function VerseCard({ verse, active, near }: { verse: Verse; active: boolean; near: boolean }) {
  const { sadr, ajuz } = splitVerse(verse.text);
  return (
    <figure className="relative m-0 flex min-h-0 flex-col">
      <div className="media-frame relative min-h-0 flex-1">
        <VerseMedia media={verse.media} label={`${sadr} ${ajuz ?? ""}`} active={active} near={near} />
        {corners.map((pos) => (
          <FrameBracket key={pos} className={`pointer-events-none absolute h-[6cqw] w-[6cqw] text-[#c9a45c] drop-shadow ${pos}`} />
        ))}
      </div>

      <Plate shape="torn" className="relative z-10 mx-auto -mt-[5.6cqw] w-[80%]" faceClassName="px-[3.4cqw] py-[1.5cqw]">
        <figcaption dir="rtl" className="text-center">
          <span className="verse-line verse-sadr">{sadr}</span>
          {ajuz && <span className="verse-line verse-ajuz">{ajuz}</span>}
        </figcaption>
      </Plate>
    </figure>
  );
});