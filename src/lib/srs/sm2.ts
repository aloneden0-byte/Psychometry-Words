import type { SrsEngine } from "./types";

/* מנוע חזרה מרווחת: SM-2. q = איכות הזכירה 0..5. */
export const sm2: SrsEngine = (card, q, p) => {
  const s = { ...card.srs };
  if (q < p.passThreshold) {
    s.lapses += 1;
    s.reps = 0;
    s.interval = p.lapseInterval;
    s.ease = Math.max(p.minEase, s.ease - p.lapsePenalty);
  } else {
    s.reps += 1;
    if (s.reps === 1) s.interval = p.firstInterval;
    else if (s.reps === 2) s.interval = p.secondInterval;
    else s.interval = Math.round(s.interval * s.ease * p.intervalModifier);
    s.ease = s.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    s.ease = Math.min(p.maxEase, Math.max(p.minEase, s.ease));
    if (q >= 5) s.interval = Math.round(s.interval * p.easyBonus);
  }
  s.interval = Math.min(p.maxInterval, Math.max(1, s.interval));
  s.due = p.now + s.interval;
  return s;
};
