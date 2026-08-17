import { describe, expect, it } from "vitest";
import { toCSV, parseCSV } from "../../src/lib/csv";
import { RAW } from "../../src/data/raw";
import { expand } from "../../src/data/expand";

describe("csv round-trip", () => {
  it("parses back what it exports", () => {
    const words = RAW.slice(0, 5).map(expand);
    const csv = toCSV(words);
    const parsed = parseCSV(csv);
    expect(parsed).toHaveLength(words.length);
    parsed.forEach((p, i) => {
      expect(p.word).toBe(words[i].word);
      expect(p.def).toBe(words[i].def);
      expect(p.syn).toEqual(words[i].syn);
    });
  });
});
