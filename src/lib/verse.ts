/** Splits a full بيت written as "صدر ** عجز" into its two شطر. */
export function splitVerse(text: string): { sadr: string; ajuz?: string } {
  const [sadr, ...rest] = text.split("**");
  return { sadr: sadr.trim(), ajuz: rest.length ? rest.join("**").trim() : undefined };
}
