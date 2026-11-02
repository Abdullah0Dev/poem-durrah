import type { CSSProperties } from "react";

interface OrnamentProps { className?: string; style?: CSSProperties }

/** Arabesque corner – drawn for the top-left, mirrored via CSS for the others. */
export function CornerFlourish({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M6 72V18Q6 6 18 6H72" />
        <path d="M16 72V24Q16 16 24 16H72" opacity=".55" />
        <path d="M26 26c26 0 40 12 40 30 0 14-12 22-24 20-12-2-16-14-8-22 6-6 16-4 16 4" />
        <path d="M26 26c0 26 12 40 30 40 14 0 22-12 20-24-2-12-14-16-22-8-6 6-4 16 4 16" />
        <path d="M72 6c10 6 14 16 12 26-10-2-16-10-12-26Z" fill="currentColor" opacity=".5" />
        <path d="M6 72c6 10 16 14 26 12-2-10-10-16-26-12Z" fill="currentColor" opacity=".5" />
        <path d="M60 18c8 2 12 8 12 14M18 60c2 8 8 12 14 12" opacity=".7" />
      </g>
      <circle cx="26" cy="26" r="3.2" fill="currentColor" />
    </svg>
  );
}

/** Small curl that sits on either side of the title plate. */
export function TitleFlourish({ className, mirrored }: OrnamentProps & { mirrored?: boolean }) {
  return (
    <svg viewBox="0 0 80 24" className={className} style={mirrored ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M2 12h30c8 0 10-8 18-8s11 8 5 10-9-4-5-6" />
        <path d="M32 12c6 4 10 8 18 8" opacity=".6" />
      </g>
      <circle cx="68" cy="12" r="2.6" fill="currentColor" />
    </svg>
  );
}

/** Gold bracket that decorates the corners of a media frame. */
export function FrameBracket({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M3 24V9Q3 3 9 3h15" />
        <path d="M10 10c8 0 12 4 12 9 0 4-4 6-7 5s-3-5 0-6" strokeWidth="1.8" />
      </g>
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

/** Centre ornament used in the page footer. */
export function FooterOrnament({ className }: OrnamentProps) {
  return (
    <svg viewBox="0 0 160 36" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 18h46c8 0 10-10 20-10M156 18h-46c-8 0-10-10-20-10" opacity=".7" />
        <path d="M80 4l12 14-12 14-12-14Z" />
        <path d="M80 10l6.5 8-6.5 8-6.5-8Z" fill="currentColor" opacity=".45" />
      </g>
    </svg>
  );
}
