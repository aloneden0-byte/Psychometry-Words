import type { Word } from "../data/types";
import { strip } from "./strip";

/**
 * Structural validity checks shared between the Data tab's "check" panel
 * and scripts/validate-words.ts (the word-bank CI gate). Catches format
 * regressions, not linguistic accuracy — niqqud/root correctness still
 * needs a human/fluent review pass (see README).
 */
export function checkIntegrity(words: Word[]): string[] {
  const out: string[] = [];
  const seen = new Map<string, number>();
  words.forEach((w) => {
    if (seen.has(w.word)) out.push(`כפילות: ${w.word}`);
    else seen.set(w.word, 1);
    if (!w.def) out.push(`חסרה הגדרה: ${w.word}`);
    if (!w.example) out.push(`חסר משפט הקשר: ${w.word}`);
    if (!w.syn?.length) out.push(`אין נרדפות: ${w.word}`);
    if (![1, 2, 3].includes(w.level)) out.push(`רמה לא חוקית: ${w.word}`);
    if (!w.nikud) out.push(`חסר ניקוד: ${w.word}`);
    else {
      // Hebrew legitimately spells the same word two ways: the vocalized
      // form often drops a vav/yud that the unvocalized "כתיב מלא" form
      // keeps to mark the vowel without niqqud (e.g. תָוֶר vs תור). So we
      // don't require exact equality after stripping niqqud — only flag a
      // gross mismatch (wrong word pasted in, empty stem, etc.), tolerating
      // small ktiv-male/ktiv-haser length differences.
      const bare = strip(w.nikud);
      if (Math.abs(bare.length - w.word.length) > 2) out.push(`ניקוד עשוי לא להתאים למילה: ${w.word}`);
    }
  });
  return out;
}
