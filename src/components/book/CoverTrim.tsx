import { CornerFlourish } from "./Ornaments";

const corners = [
  { top: "calc(var(--cover) * .1)", left: "calc(var(--cover) * .1)", transform: "none" },
  { top: "calc(var(--cover) * .1)", right: "calc(var(--cover) * .1)", transform: "scaleX(-1)" },
  { bottom: "calc(var(--cover) * .1)", left: "calc(var(--cover) * .1)", transform: "scaleY(-1)" },
  { bottom: "calc(var(--cover) * .1)", right: "calc(var(--cover) * .1)", transform: "scale(-1,-1)" },
];

/** Gilded corner tooling + the ribbon bookmark hanging from the spine. */
export function CoverTrim({ single }: { single: boolean }) {
  return (
    <>
      {corners.map((c, i) => (
        <CornerFlourish key={i} className="pointer-events-none absolute z-0 text-[#c9a45c]/80"
          style={{ width: "calc(var(--cover) * 1.9)", height: "calc(var(--cover) * 1.9)", ...c }} />
      ))}
      {!single && <span aria-hidden className="book-ribbon" />}
    </>
  );
}
