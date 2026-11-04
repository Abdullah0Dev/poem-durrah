"use client";

import { motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePreloadAround } from "@/hooks/usePreloadAround";
import { flipDuration } from "@/lib/constants";
import { buildPages, type RenderPage } from "@/lib/diwan";
import { toArabicNumber } from "@/lib/format";
import { PageSound } from "@/lib/pageSound";
import type { Diwan } from "@/types/poem";
import { BookControlsContext } from "./BookContext";
import { CoverTrim } from "./CoverTrim";
import { ListIcon, MutedIcon, VolumeIcon } from "./Icons";
import { Leaf } from "./Leaf";
import { Page, type NavMode } from "./Page";

interface Spread { right: RenderPage; left?: RenderPage }

/** Only this many sheets either side of the open page are mounted. */
const WINDOW = 2;
/** Jumps farther than this skip ahead and only "riffle" through the last stretch. */
const MAX_RIFFLE = 8;

/**
 * Arabic (right-to-left) page model, desktop: spread i = [right: page 2i+1, left: page 2i+2].
 * Unread sheets rest on the LEFT and turn over to the RIGHT.
 * Leaf j carries left(j) (page 2j+2) on its front and right(j+1) (page 2j+3) on its back;
 * page 1 is the static page under the first leaf on the right.
 * In single-page mode every leaf is one page, hinged on the right-hand spine.
 */
export function Book({ title, poems }: Diwan) {
  const pages = useMemo(() => buildPages({ title, poems }), [title, poems]);
  const single = useMediaQuery("(max-width: 820px)");
  const [index, setIndex] = useState(0);
  const [settle, setSettle] = useState(0);
  const [rush, setRush] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const drag = useMotionValue(0);
  const span = useRef(600);
  const stage = useRef<HTMLDivElement>(null);
  const ignoreSwipe = useRef(false);
  const wasSingle = useRef(single);
  const rushTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sound = useMemo(() => new PageSound(), []);

  const spreads = useMemo<Spread[]>(() => {
    const out: Spread[] = [];
    for (let i = 0; i < pages.length; i += 2) out.push({ right: pages[i], left: pages[i + 1] });
    return out;
  }, [pages]);

  const count = single ? pages.length : spreads.length;
  const current = Math.min(index, count - 1);
  const currentRef = useRef(current);
  useEffect(() => { currentRef.current = current; }, [current]);

  // Preload + pre-decode the images around the open page.
  usePreloadAround(pages, single ? current : current * 2);

  // Keep the reader on the same page when the layout switches.
  useEffect(() => {
    if (wasSingle.current === single) return;
    wasSingle.current = single;
    setIndex((i) => (single ? i * 2 : Math.floor(i / 2)));
  }, [single]);

  useEffect(() => {
    try { if (localStorage.getItem("hamasa:sound") === "off") setSoundOn(false); } catch {}
  }, []);
  useEffect(() => { sound.enabled = soundOn; }, [sound, soundOn]);
  useEffect(() => () => clearTimeout(rushTimer.current), []);

  const stopRush = useCallback(() => { clearTimeout(rushTimer.current); setRush(false); }, []);

  /** @param dist degrees the page still has to travel (shorter after a drag) */
  const turn = useCallback((dir: 1 | -1, dist = 180) => {
    const n = currentRef.current + dir;
    if (n < 0 || n > count - 1) return false;
    currentRef.current = n;
    setIndex(n);
    sound.turn(flipDuration(dist), dir);
    return true;
  }, [count, sound]);

  const turnByControl = useCallback((dir: 1 | -1) => {
    stopRush();
    if (turn(dir)) setSettle((s) => s + 1);
  }, [turn, stopRush]);

  /** Flips quickly through every sheet in between, like riffling the pages. */
  const goTo = useCallback((target: number) => {
    stopRush();
    const t = Math.max(0, Math.min(count - 1, target));
    let c = currentRef.current;
    if (t === c) return;
    const dir: 1 | -1 = t > c ? 1 : -1;
    if (Math.abs(t - c) > MAX_RIFFLE) {
      c = t - dir * MAX_RIFFLE;
      currentRef.current = c;
      setIndex(c);
    }
    setRush(true);
    const step = () => {
      if (currentRef.current === t) { rushTimer.current = setTimeout(() => setRush(false), 700); return; }
      turn(dir, 70);
      setSettle((s) => s + 1);
      rushTimer.current = setTimeout(step, 140);
    };
    rushTimer.current = setTimeout(step, 30);
  }, [count, turn, stopRush]);

  /** Page number (1-based) → spread / page index. */
  const goToPage = useCallback((n: number) => goTo(single ? n - 1 : Math.floor((n - 1) / 2)), [goTo, single]);
  const indexPage = pages.findIndex((p) => p.kind === "index") + 1; // 0 = no index

  // Arabic book: forward turns the left page over to the right.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") turnByControl(1);
      if (e.key === "ArrowLeft") turnByControl(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turnByControl]);

  const controls = useMemo(() => ({
    prev: { onClick: () => turnByControl(-1), disabled: current === 0 },
    next: { onClick: () => turnByControl(1), disabled: current >= count - 1 },
    goToPage,
  }), [turnByControl, goToPage, current, count]);

  const near = (k: number) => Math.abs(current - k) <= 1;
  const page = (p: RenderPage | undefined, number: number, side: "left" | "right", index: number, nav: NavMode): ReactNode => (
    <Page title={title} page={p} number={number} side={side} active={current === index} near={near(index)} nav={nav} />
  );

  // Mount only the sheets near the open page.
  const lo = Math.max(0, current - WINDOW);
  const hi = Math.min(count - 1, current + WINDOW);
  const leaves: { j: number; front: ReactNode; back?: ReactNode }[] = [];
  for (let j = lo; j <= hi; j++) {
    if (single) {
      leaves.push({ j, front: page(pages[j], j + 1, "left", j, "both") });
    } else {
      const after = spreads[j + 1];
      leaves.push({
        j,
        front: page(spreads[j].left, 2 * j + 2, "left", j, "next"),
        back: after ? page(after.right, 2 * j + 3, "right", j + 1, "prev") : undefined,
      });
    }
  }

  const openPage = pages[single ? current : current * 2];
  const poemName = openPage?.kind === "verses" ? openPage.poemTitle : "الفهرس";
  const label = single
    ? `صفحة ${toArabicNumber(current + 1)} من ${toArabicNumber(pages.length)}`
    : `الصفحتان ${toArabicNumber(2 * current + 1)} – ${toArabicNumber(2 * current + 2)} من ${toArabicNumber(pages.length)}`;

  return (
    <section aria-label={title} className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="book-shell"
        data-single={single}
      >
        <Image src={"/book-bg.png"} alt="book bg" className="select-none inset-0 w-full " fill priority />
        <CoverTrim single={single} onIndex={indexPage ? () => goToPage(indexPage) : undefined} />

        <motion.div
          className="relative z-[1] touch-pan-y select-none scale-x-95"
          onPanStart={(e) => {
            stopRush();
            ignoreSwipe.current = !!(e.target as HTMLElement | null)?.closest?.("[data-no-swipe]");
            span.current = (stage.current?.offsetWidth ?? 600) * (single ? 0.8 : 0.55);
          }}
          onPan={(_, { offset }) => {
            if (ignoreSwipe.current) return;
            drag.set(Math.max(-1, Math.min(1, offset.x / span.current)));
          }}
          onPanEnd={(_, { velocity }) => {
            const v = drag.get();
            drag.set(0);
            if (!ignoreSwipe.current) {
              if (v > 0.3 || (velocity.x > 500 && v > 0)) turn(1, 180 * (1 - Math.min(1, v)));          // left → right : next
              else if (v < -0.3 || (velocity.x < -500 && v < 0)) turn(-1, 180 * (1 - Math.min(1, -v))); // right → left : back
            }
            setSettle((s) => s + 1);
          }}
        >
          <BookControlsContext.Provider value={controls}>
            <div ref={stage} className="relative" dir="ltr"
              style={{ width: single ? "var(--pw)" : "calc(var(--pw) * 2)", height: "var(--ph)", perspective: "2600px" }}>
              <span aria-hidden className="book-edge" style={{ right: "100%" }} />
              <span aria-hidden className="book-edge" style={{ left: "100%" }} />

              {!single && current <= 1 && (
                <div className="absolute right-0 top-0 h-full w-1/2">
                  {page(spreads[0].right, 1, "right", 0, "prev")}
                </div>
              )}

              {leaves.map((l) => (
                <Leaf key={l.j} order={l.j} total={count} current={current} flipped={l.j < current}
                  single={single} front={l.front} back={l.back} drag={drag} settle={settle} rush={rush} />
              ))}
            </div>
          </BookControlsContext.Provider>
        </motion.div>
      </motion.div>

      <div className="mt-5 flex flex-col items-center gap-1 text-[#e6cf9f]/80">
        <p className="text-xl font-bold text-[#e6cf9f]">{poemName}</p>
        <div className="flex items-center gap-3 text-base">
          {indexPage > 0 && (
            <button
              type="button"
              onClick={() => goToPage(indexPage)}
              className="flex h-9 items-center gap-2 rounded-full border border-[#c9a45c]/50 px-4 text-[#e6cf9f] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#c9a45c]"
            >
              <ListIcon className="h-4 w-4" /> الفهرس
            </button>
          )}
          <p aria-live="polite">{label}</p>
          <button
            type="button"
            aria-pressed={soundOn}
            aria-label={soundOn ? "كتم المؤثرات الصوتية" : "تشغيل المؤثرات الصوتية"}
            onClick={() => {
              setSoundOn((on) => {
                try { localStorage.setItem("hamasa:sound", on ? "off" : "on"); } catch {}
                return !on;
              });
            }}
            className="grid h-9 w-9 place-items-center rounded-full border border-[#c9a45c]/50 text-[#e6cf9f] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#c9a45c]"
          >
            {soundOn ? <VolumeIcon className="h-4 w-4" /> : <MutedIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}