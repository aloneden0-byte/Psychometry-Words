import type { SrsEngine } from "./types";
import { sm2 } from "./sm2";
import { leitner } from "./leitner";

export const ENGINES: Record<string, SrsEngine> = {
  sm2,
  leitner,
  none: (c, _q, p) => ({ ...c.srs, due: p.now + 1 }),
};
