import type { SrsEngine } from "./types";

export const leitner: SrsEngine = (card, q, p) => {
  const s = { ...card.srs };
  const box = Math.max(0, Math.min(5, s.reps));
  const next = q >= p.passThreshold ? box + 1 : 0;
  s.reps = next;
  s.interval = [1, 2, 4, 8, 16, 32][Math.min(5, next)];
  s.due = p.now + s.interval;
  if (q < p.passThreshold) s.lapses += 1;
  return s;
};
