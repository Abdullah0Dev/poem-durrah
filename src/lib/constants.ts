export const FLIP_DURATION = 1.05;
/** Page lifting off the stack: slow start, slow landing. */
export const FLIP_EASE = [0.645, 0.045, 0.355, 1] as const;
/** After a drag the page is already moving – decelerate only. */
export const SETTLE_EASE = [0.22, 1, 0.36, 1] as const;

/** Shorter turns (finishing a drag) take proportionally less time. */
export const flipDuration = (deg: number) =>
  Math.max(0.35, FLIP_DURATION * Math.pow(Math.min(Math.abs(deg), 180) / 180, 0.6));
