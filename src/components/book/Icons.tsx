import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
};

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
);
export const PauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
);
export const VolumeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>
);
export const MutedIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="m16 9 5 6M21 9l-5 6" /></svg>
);
export const ExpandIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
);
export const ChevronIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} strokeWidth={2.6} {...p}><path d="m9 5 7 7-7 7" /></svg>
);
