import type { ComponentType } from "react";
import { Star, Flame, Award, Sparkles, Trophy, Gem } from "lucide-react";
import type { Word } from "../data/types";

export interface Streak {
  current: number;
  best: number;
  lastActiveDay: number;
}

export const INITIAL_STREAK: Streak = { current: 0, best: 0, lastActiveDay: -1 };

/** Advances the streak on the first engagement of a given day; a no-op if already updated today. */
export function updateStreak(streak: Streak, today: number): Streak {
  if (streak.lastActiveDay === today) return streak;
  const current = streak.lastActiveDay === today - 1 ? streak.current + 1 : 1;
  return { current, best: Math.max(streak.best, current), lastActiveDay: today };
}

/** Total stars = every correct answer ever given, reframing existing stats.correct as the star currency. */
export function computeStars(words: Word[]): number {
  return words.reduce((sum, w) => sum + w.stats.correct, 0);
}

export function computeMastered(words: Word[]): number {
  return words.filter((w) => w.srs.reps >= 3).length;
}

export interface LevelInfo {
  level: number;
  name: string;
  threshold: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: "מתחיל", threshold: 0 },
  { level: 2, name: "חוקר", threshold: 15 },
  { level: 3, name: "בקיא", threshold: 40 },
  { level: 4, name: "מומחה", threshold: 80 },
  { level: 5, name: "אלוף", threshold: 150 },
];

export interface LevelProgress {
  current: LevelInfo;
  next: LevelInfo | null;
  progressInLevel: number;
  neededForNext: number;
}

export function computeLevel(mastered: number): LevelProgress {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (mastered >= lvl.threshold) current = lvl;
  }
  const idx = LEVELS.indexOf(current);
  const next = LEVELS[idx + 1] ?? null;
  const progressInLevel = mastered - current.threshold;
  const neededForNext = next ? next.threshold - current.threshold : 0;
  return { current, next, progressInLevel, neededForNext };
}

export interface BadgeContext {
  words: Word[];
  totalStars: number;
  mastered: number;
  streak: Streak;
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  earned: (ctx: BadgeContext) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: "first-star",
    title: "כוכב ראשון",
    description: "ענו נכון בפעם הראשונה",
    icon: Star,
    earned: (ctx) => ctx.totalStars >= 1,
  },
  {
    id: "ten-stars",
    title: "10 כוכבים",
    description: "צברו 10 תשובות נכונות",
    icon: Sparkles,
    earned: (ctx) => ctx.totalStars >= 10,
  },
  {
    id: "week-streak",
    title: "רצף שבוע",
    description: "שבעה ימים רצופים של תרגול",
    icon: Flame,
    earned: (ctx) => ctx.streak.best >= 7,
  },
  {
    id: "mastered-25",
    title: "25 מוטמעות",
    description: "הטמעתם 25 מילים",
    icon: Award,
    earned: (ctx) => ctx.mastered >= 25,
  },
  {
    id: "mastered-100",
    title: "100 מוטמעות",
    description: "הטמעתם 100 מילים",
    icon: Trophy,
    earned: (ctx) => ctx.mastered >= 100,
  },
  {
    id: "hard-tier",
    title: "אלוף הרמה הקשה",
    description: "10 מילים ברמה 3 נענו נכון",
    icon: Gem,
    earned: (ctx) => ctx.words.filter((w) => w.level === 3 && w.stats.correct >= 1).length >= 10,
  },
];

export interface Badge extends Omit<BadgeDef, "earned"> {
  earned: boolean;
}

export function computeBadges(ctx: BadgeContext): Badge[] {
  return BADGES.map((b) => ({ ...b, earned: b.earned(ctx) }));
}
