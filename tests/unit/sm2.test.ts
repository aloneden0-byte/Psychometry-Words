import { describe, expect, it } from "vitest";
import { sm2 } from "../../src/lib/srs/sm2";
import { DEFAULTS } from "../../src/constants";
import type { Word } from "../../src/data/types";

const params = {
  now: 100,
  passThreshold: DEFAULTS.passThreshold,
  firstInterval: DEFAULTS.firstInterval,
  secondInterval: DEFAULTS.secondInterval,
  intervalModifier: DEFAULTS.intervalModifier,
  easyBonus: DEFAULTS.easyBonus,
  lapsePenalty: DEFAULTS.lapsePenalty,
  lapseInterval: DEFAULTS.lapseInterval,
  minEase: DEFAULTS.minEase,
  maxEase: DEFAULTS.maxEase,
  maxInterval: DEFAULTS.maxInterval,
};

const card: Word = {
  id: "w",
  word: "w",
  nikud: "w",
  root: "—",
  pos: "שם עצם",
  level: 1,
  def: "d",
  syn: [],
  ant: [],
  example: "e",
  tags: [],
  srs: { ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0 },
  stats: { seen: 0, correct: 0, wrong: 0 },
};

describe("sm2", () => {
  it("schedules the first correct answer at firstInterval", () => {
    const s = sm2(card, 4, params);
    expect(s.reps).toBe(1);
    expect(s.interval).toBe(params.firstInterval);
    expect(s.due).toBe(params.now + params.firstInterval);
  });

  it("resets reps and applies lapseInterval on a forgotten card", () => {
    const studied = { ...card, srs: { ease: 2.5, interval: 10, due: 90, reps: 3, lapses: 0 } };
    const s = sm2(studied, 1, params);
    expect(s.reps).toBe(0);
    expect(s.lapses).toBe(1);
    expect(s.interval).toBe(params.lapseInterval);
    expect(s.ease).toBeLessThan(2.5);
  });

  it("clamps ease within [minEase, maxEase]", () => {
    let s = card.srs;
    let w = card;
    for (let i = 0; i < 20; i++) {
      s = sm2(w, 0, params);
      w = { ...w, srs: s };
    }
    expect(s.ease).toBeGreaterThanOrEqual(params.minEase);
    for (let i = 0; i < 20; i++) {
      s = sm2(w, 5, params);
      w = { ...w, srs: s };
    }
    expect(s.ease).toBeLessThanOrEqual(params.maxEase);
  });

  it("never exceeds maxInterval", () => {
    let w = { ...card, srs: { ease: params.maxEase, interval: 300, due: 0, reps: 5, lapses: 0 } };
    const s = sm2(w, 5, params);
    expect(s.interval).toBeLessThanOrEqual(params.maxInterval);
  });
});
