"use client";

import { useContext } from "react";
import { toArabicNumber } from "@/lib/format";
import type { IndexEntry } from "@/lib/diwan";
import { BookControlsContext } from "./BookContext";

/** One page of the فهرس: poem number · title · poet ····· page. Click = flip to that poem. */
export function IndexBody({ entries }: { entries: IndexEntry[] }) {
  const { goToPage } = useContext(BookControlsContext);
  return (
    <div dir="rtl" className="relative z-10 mt-[3cqw] flex min-h-0 flex-1 flex-col px-[1cqw]">
      <h3 className="ink mb-[2.2cqw] text-center text-[5.2cqw] font-bold text-[#3a2410]">فهرس القصائد</h3>
      <ul className="m-0 flex list-none flex-col gap-[1.2cqw] p-0">
        {entries.map((e) => (
          <li key={e.poemId}>
            <button
              type="button"
              onClick={() => goToPage(e.page)}
              aria-label={`${e.title}، صفحة ${toArabicNumber(e.page)}`}
              className="flex w-full items-center gap-[2.2cqw] rounded-[1.2cqw] px-[1.6cqw] py-[1.2cqw] text-start transition hover:bg-[#c9a45c]/25 focus-visible:outline-2 focus-visible:outline-[#7a2a26] active:scale-[0.99]"
            >
              <span className="grid h-[7.6cqw] w-[7.6cqw] shrink-0 place-items-center rounded-full border-[0.3cqw] border-[#c9a45c] bg-[#5a1a1a] text-[3.6cqw] font-bold leading-none text-[#f1dfb0] shadow-[0_0.4cqw_0.8cqw_rgba(40,10,5,.4)]">
                {toArabicNumber(e.number)}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="ink truncate text-[4.2cqw] font-bold leading-[1.45] text-[#2b180a]">{e.title}</span>
                {e.poet && <span className="truncate text-[2.9cqw] leading-[1.3] text-[#8c2a1f]">{e.poet}</span>}
              </span>
              <span aria-hidden className="mx-[1cqw] mb-[1.2cqw] h-0 min-w-[4cqw] flex-1 self-end border-b-[0.35cqw] border-dotted border-[#6b4a22]/60" />
              <span className="shrink-0 text-[3.4cqw] font-bold text-[#3a2410]">ص {toArabicNumber(e.page)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
