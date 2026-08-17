import { describe, expect, it } from "vitest";
import { buildQuestion } from "../../src/lib/question";
import { rng } from "../../src/lib/rng";
import { RAW } from "../../src/data/raw";
import { expand } from "../../src/data/expand";

const words = RAW.map(expand);

describe("buildQuestion", () => {
  it("mcDef always includes the correct definition among options", () => {
    const rnd = rng(1);
    const w = words[0];
    const q = buildQuestion(w, words, "mcDef", rnd);
    expect(q.kind).toBe("choice");
    if (q.kind === "choice") {
      expect(q.options).toContain(q.correct);
      expect(q.correct).toBe(w.def);
    }
  });

  it("mcWord always includes the correct word among options", () => {
    const rnd = rng(2);
    const w = words[5];
    const q = buildQuestion(w, words, "mcWord", rnd);
    expect(q.kind).toBe("choice");
    if (q.kind === "choice") {
      expect(q.options).toContain(w.word);
    }
  });

  it("type mode returns the word as the correct answer", () => {
    const rnd = rng(3);
    const w = words[10];
    const q = buildQuestion(w, words, "type", rnd);
    expect(q.kind).toBe("type");
    expect(q.correct).toBe(w.word);
  });

  it("syn mode falls back to mcDef when a word has no synonyms or antonyms", () => {
    const bare = { ...words[0], syn: [], ant: [] };
    const rnd = rng(4);
    const q = buildQuestion(bare, words, "syn", rnd);
    expect(q.kind).toBe("choice");
    if (q.kind === "choice") expect(q.correct).toBe(bare.def);
  });

  it("is deterministic for a fixed seed", () => {
    const w = words[20];
    const q1 = buildQuestion(w, words, "mcDef", rng(42));
    const q2 = buildQuestion(w, words, "mcDef", rng(42));
    expect(q1).toEqual(q2);
  });
});
