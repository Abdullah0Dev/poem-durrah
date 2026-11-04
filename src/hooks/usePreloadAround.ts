import { useEffect } from "react";
import { pageImageUrls, type RenderPage } from "@/lib/diwan";
import { enqueueImages } from "@/lib/preload";

/** Preloads + pre-decodes images around the open page: forward pages first, then a few behind. */
export function usePreloadAround(pages: RenderPage[], center: number, ahead = 9, behind = 4) {
  useEffect(() => {
    const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (c?.saveData) return;
    const order: number[] = [];
    for (let d = 0; d <= ahead; d++) order.push(center + d);
    for (let d = 1; d <= behind; d++) order.push(center - d);
    enqueueImages(order.flatMap((i) => pageImageUrls(pages[i])));
  }, [pages, center, ahead, behind]);
}