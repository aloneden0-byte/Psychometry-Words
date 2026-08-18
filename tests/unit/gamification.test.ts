import { describe, expect, it } from "vitest";
import { updateStreak, computeStars, computeMastered, computeLevel, computeBadges, INITIAL_STREAK } from "../../src/lib/gamification";
import type { Word } from "../../src/data/types";

const word = (overrides: Partial<Word> = {}): Word => ({
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
  ...overrides,
});

describe("updateStreak", () => {
  it("starts a streak at 1 on first engagement", () => {
    const s = updateStreak(INITIAL_STREAK, 100);
    expect(s.current).toBe(1);
    expect(s.best).toBe(1);
    expect(s.lastActiveDay).toBe(100);
  });

  it("increments on consecutive days", () => {
    let s = updateStreak(INITIAL_STREAK, 100);
    s = updateStreak(s, 101);
    s = updateStreak(s, 102);
    expect(s.current).toBe(3);
    expect(s.best).toBe(3);
  });

  it("is a no-op if already updated today", () => {
    let s = updateStreak(INITIAL_STREAK, 100);
    s = updateStreak(s, 100);
    expect(s.current).toBe(1);
  });

  it("resets to 1 after a gap day", () => {
    let s = updateStreak(INITIAL_STREAK, 100);
    s = updateStreak(s, 105);
    expect(s.current).toBe(1);
    expect(s.best).toBe(1);
  });

  it("keeps best after a reset", () => {
    let s = updateStreak(INITIAL_STREAK, 100);
    s = updateStreak(s, 101);
    s = updateStreak(s, 102);
    s = updateStreak(s, 110);
    expect(s.current).toBe(1);
    expect(s.best).toBe(3);
  });
});

describe("computeStars / computeMastered", () => {
  it("sums correct answers across words", () => {
    const words = [word({ stats: { seen: 5, correct: 3, wrong: 2 } }), word({ id: "w2", stats: { seen: 2, correct: 2, wrong: 0 } })];
    expect(computeStars(words)).toBe(5);
  });

  it("counts words with reps >= 3 as mastered", () => {
    const words = [
      word({ srs: { ease: 2.5, interval: 1, due: 0, reps: 3, lapses: 0 } }),
      word({ id: "w2", srs: { ease: 2.5, interval: 1, due: 0, reps: 1, lapses: 0 } }),
    ];
    expect(computeMastered(words)).toBe(1);
  });
});

describe("computeLevel", () => {
  it("starts at level 1 with 0 mastered", () => {
    const lvl = computeLevel(0);
    expect(lvl.current.level).toBe(1);
    expect(lvl.next?.level).toBe(2);
  });

  it("advances to the correct tier", () => {
    expect(computeLevel(15).current.level).toBe(2);
    expect(computeLevel(150).current.level).toBe(5);
    expect(computeLevel(150).next).toBeNull();
  });
});

describe("computeBadges", () => {
  it("marks first-star badge earned once a star exists", () => {
    const badges = computeBadges({ words: [], totalStars: 1, mastered: 0, streak: INITIAL_STREAK });
    const first = badges.find((b) => b.id === "first-star");
    expect(first?.earned).toBe(true);
  });

  it("leaves badges unearned when thresholds aren't met", () => {
    const badges = computeBadges({ words: [], totalStars: 0, mastered: 0, streak: INITIAL_STREAK });
    expect(badges.every((b) => !b.earned)).toBe(true);
  });
});
