import type { WordRow, Word } from "./types";
import { FIELDS } from "./types";

export function expand(row: WordRow): Word {
  const o = {} as Record<(typeof FIELDS)[number], unknown>;
  FIELDS.forEach((f, i) => (o[f] = row[i]));
  const word = String(o.word);
  return {
    ...(o as unknown as Omit<Word, "id" | "srs" | "stats">),
    id: word.replace(/\s/g, "_"),
    srs: { ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0 },
    stats: { seen: 0, correct: 0, wrong: 0 },
  };
}
