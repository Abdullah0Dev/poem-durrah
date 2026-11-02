"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { FLIP_EASE, SETTLE_EASE, flipDuration } from "@/lib/constants";

interface LeafProps {
  /** Position in the book (0 = first sheet). */
  order: number;
  total: number;
  /** Index of the currently open spread/page. */
  current: number;
  flipped: boolean;
  /** Single-page (mobile) mode: the leaf covers the whole book and has no back. */
  single: boolean;
  front: ReactNode;
  back?: ReactNode;
  /** Normalised drag progress, −1…1 (positive = dragging toward the right = next page). */
  drag: MotionValue<number>;
  /** Bumped after every gesture so an abandoned drag springs back. */
  settle: number;
}

/**
 * One physical sheet of an Arabic (right-to-left) book.
 * It rests on the LEFT, is hinged on the spine (its right edge) and turns over
 * to the RIGHT: rotateY 0° → 180°. It follows the pointer while dragged, then eases to rest.
 * Only transform + opacity are animated (compositor-only).
 */
export const Leaf = memo(function Leaf({ order, total, current, flipped, single, front, back, drag, settle }: LeafProps) {
  const rotate = useMotionValue(flipped ? 180 : 0);
  const [turning, setTurning] = useState(false);
  const turningRef = useRef(false);
  const mounted = useRef(false);
  const reduce = useReducedMotion();

  const begin = () => { if (!turningRef.current) { turningRef.current = true; setTurning(true); } };
  const end = () => { turningRef.current = false; setTurning(false); };

  const isNext = order === current && order < total - 1;
  const isPrev = order === current - 1;

  // Follow the pointer (left → right turns forward, right → left turns back).
  useEffect(() => {
    if (!isNext && !isPrev) return;
    return drag.on("change", (v) => {
      let r: number | null = null;
      if (isNext && v > 0) r = 180 * Math.min(1, v);
      else if (isPrev && v < 0) r = 180 - 180 * Math.min(1, -v);
      if (r === null) return;
      begin();
      rotate.set(r);
    });
  }, [drag, isNext, isPrev, rotate]);

  // Settle to the resting angle (after a flip, a click, or an abandoned drag).
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const target = flipped ? 180 : 0;
    const dist = Math.abs(rotate.get() - target);
    if (dist < 0.5) { rotate.set(target); end(); return; }
    begin();
    const c = animate(rotate, target, {
      duration: reduce ? 0.01 : flipDuration(dist),
      ease: dist < 179.5 ? SETTLE_EASE : FLIP_EASE,
      onComplete: end,
    });
    return () => c.stop();
  }, [flipped, settle, reduce, rotate]);

  const skewY = useTransform(rotate, [0, 90, 180], [0, -1.3, 0]);           // slight paper curl
  const frontShade = useTransform(rotate, [0, 90], [0, 0.55]);
  const backShade = useTransform(rotate, [90, 180], [0.55, 0]);
  const castBeneath = useTransform(rotate, [0, 35, 90], [0, 1, 0]);          // shadow on the page revealed under the lifting sheet
  const castLanding = useTransform(rotate, [90, 145, 180], [0, 1, 0]);       // shadow on the page it lands on

  const zIndex = turning ? total + 10 : flipped ? order : total - order;
  const width = single ? "100%" : "50%";

  return (
    <>
      {turning && (
        <>
          <motion.div aria-hidden className="pointer-events-none absolute left-0 top-0 h-full"
            style={{ width, zIndex: total + 9, opacity: castBeneath, background: "linear-gradient(270deg, rgba(25,10,0,.55), rgba(25,10,0,.2) 40%, transparent 78%)" }} />
          {!single && (
            <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-full w-1/2"
              style={{ zIndex: total + 9, opacity: castLanding, background: "linear-gradient(90deg, rgba(25,10,0,.55), rgba(25,10,0,.2) 40%, transparent 78%)" }} />
          )}
        </>
      )}

      <motion.div
        className="bk-3d absolute left-0 top-0 h-full"
        style={{
          width,
          rotateY: rotate,
          skewY,
          transformOrigin: "right center",
          zIndex,
          pointerEvents: single && flipped ? "none" : "auto",
          willChange: turning ? "transform" : "auto",
        }}
      >
        <div className="bk-hidden absolute inset-0">
          {front}
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" style={{ opacity: frontShade }} />
        </div>
        {back && (
          <div className="bk-hidden bk-flip absolute inset-0">
            {back}
            <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent" style={{ opacity: backShade }} />
          </div>
        )}
      </motion.div>
    </>
  );
});