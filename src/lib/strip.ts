const NIKUD_RE = /[֑-ׇ]/g;

export const strip = (s: string | undefined | null): string =>
  (s || "")
    .replace(NIKUD_RE, "")
    .replace(/["'׳״]/g, "")
    .replace(/\s+/g, " ")
    .trim();
