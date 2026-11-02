"use client";

import { memo, useContext } from "react";
import { cn } from "@/lib/cn";
import { toArabicNumber } from "@/lib/format";
import type { BookPage } from "@/types/poem";
import { BookControlsContext, type NavAction } from "./BookContext";
import { ChevronIcon } from "./Icons";
import { CornerFlourish, FooterOrnament, TitleFlourish } from "./Ornaments";
import { Plate } from "./Plate";
import { VerseCard } from "./VerseCard";

export type NavMode = "prev" | "next" | "both";

interface PageProps {
  title: string;
  number: number;
  side: "left" | "right";
  page?: BookPage;
  active: boolean;
  nav: NavMode;
}

const cornerPos = [
  "left-0 top-0",
  "right-0 top-0 [transform:scaleX(-1)]",
  "bottom-0 left-0 [transform:scaleY(-1)]",
  "bottom-0 right-0 [transform:scale(-1,-1)]",
];

/** Reads the shared controls from context so the heavy page body never re-renders for them. */
function NavButton({ dir, edge }: { dir: "prev" | "next"; edge: "left" | "right" }) {
  const controls = useContext(BookControlsContext);
  const action: NavAction = controls[dir];
  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      aria-label={dir === "next" ? "الصفحة التالية" : "الصفحة السابقة"}
      className={cn(
        "absolute bottom-[3.2cqw] z-20 grid h-[8.5cqw] min-h-8 w-[8.5cqw] min-w-8 place-items-center rounded-[1.2cqw] border-[0.35cqw] border-[#c9a45c] bg-gradient-to-b from-[#7a2a26] to-[#4a1414] text-[#f1dfb0] shadow-[0_0.6cqw_1cqw_rgba(40,10,5,.55),inset_0_0_1cqw_rgba(0,0,0,.4)] transition",
        "hover:brightness-125 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a2a26] disabled:cursor-default disabled:opacity-35 disabled:hover:brightness-100",
        edge === "left" ? "left-[5cqw]" : "right-[5cqw]",
      )}
    >
      {/* Forward turns the page toward the left, so "next" points left. */}
      <ChevronIcon className={cn("h-[55%] w-[55%]", dir === "prev" && "rotate-180")} />
    </button>
  );
}

export const Page = memo(function Page({ title, number, side, page, active, nav }: PageProps) {
  return (
    <div
      dir="ltr"
      className="relative h-full w-full overflow-hidden rounded-[0.5rem]"
      style={{ containerType: "inline-size", contain: "layout paint style" }}
    >
      <div className="parchment relative flex h-full w-full flex-col px-[7.5cqw] pb-[10.5cqw] pt-[5cqw] text-[#6b4a22]">
        <div aria-hidden className="pointer-events-none absolute inset-[2.6cqw] border border-[#7a5a2c]/70" />
        <div aria-hidden className="pointer-events-none absolute inset-[3.4cqw] border-[0.25cqw] border-[#7a5a2c]/50" />
        <div aria-hidden className="pointer-events-none absolute inset-[1.8cqw]">
          {cornerPos.map((p) => (
            <CornerFlourish key={p} className={cn("absolute h-[17cqw] w-[17cqw]", p)} />
          ))}
        </div>

        <header className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center">
          <div className={side === "left" ? "order-3" : "order-1"} />
          <div className="order-2 flex items-center gap-[1cqw]">
            <TitleFlourish className="h-[4.5cqw] w-[13cqw]" />
            <Plate shape="cartouche" faceClassName="px-[6cqw] py-[1.4cqw]">
              <h2 dir="rtl" className="ink whitespace-nowrap text-center text-[6.4cqw] font-bold leading-[1.25] text-[#2f1c0b]">{title}</h2>
            </Plate>
            <TitleFlourish mirrored className="h-[4.5cqw] w-[13cqw]" />
          </div>
          <div className={cn("flex", side === "left" ? "order-1 justify-start" : "order-3 justify-end")}>
            <span dir="rtl" className="rounded-[0.8cqw] border border-[#7a5a2c]/70 bg-[#e8d2a0]/70 px-[1.8cqw] py-[0.5cqw] text-[3.4cqw] font-bold leading-none text-[#3a2410] shadow-[inset_0_0_1cqw_rgba(120,76,28,.4)]">
               {toArabicNumber(number)}
            </span>
          </div>
        </header>

        <div className="relative z-10 mt-[3cqw] grid min-h-0 flex-1 grid-rows-3 gap-[2.2cqw] px-[1cqw]">
          {page?.verses.slice(0, 3).map((v) => <VerseCard key={v.id} verse={v} active={active} />)}
        </div>

        <FooterOrnament className="pointer-events-none absolute bottom-[5.2cqw] left-1/2 z-10 h-[4.4cqw] w-[24cqw] -translate-x-1/2 text-[#6b4a22]" />
        {(nav === "next" || nav === "both") && <NavButton dir="next" edge="left" />}
        {(nav === "prev" || nav === "both") && <NavButton dir="prev" edge="right" />}

        <div aria-hidden className={cn("pointer-events-none absolute inset-y-0 w-[12%]", side === "right" ? "gutter-r left-0" : "gutter-l right-0")} />
      </div>
    </div>
  );
});