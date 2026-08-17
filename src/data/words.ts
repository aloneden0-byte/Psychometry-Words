import { RAW } from "./raw";
import { BATCHES } from "./batches";
import { expand } from "./expand";
import type { Word } from "./types";

export const ALL_ROWS = [...RAW, ...BATCHES.flatMap((b) => b.rows)];

export const WORDS: Word[] = ALL_ROWS.map(expand);
