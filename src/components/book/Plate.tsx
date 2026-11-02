import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PlateProps {
  shape: "torn" | "cartouche";
  className?: string;
  faceClassName?: string;
  children: ReactNode;
}

/** Parchment plaque with a dark outline – used for the title and verse banners. */
export function Plate({ shape, className, faceClassName, children }: PlateProps) {
  return (
    <div className={cn("plate", shape === "torn" ? "plate--torn" : "plate--cartouche", className)}>
      <div className="plate__edge">
        <div className={cn("plate__face", faceClassName)}>{children}</div>
      </div>
    </div>
  );
}
