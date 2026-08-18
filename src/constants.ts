import { Home, Layers, Target, Trophy, Settings2 } from "lucide-react";
import type { ComponentType } from "react";

export interface Settings {
  theme: string;
  scale: number;
  nikudMode: "always" | "reveal" | "never";
  motion: boolean;
  glow: boolean;
  density: string;
  fontStack: "default" | "legible";
  levels: number[];
  tags: string[];
  sessionSize: number;
  modes: string[];
  engine: string;
  passThreshold: number;
  firstInterval: number;
  secondInterval: number;
  intervalModifier: number;
  easyBonus: number;
  lapsePenalty: number;
  lapseInterval: number;
  minEase: number;
  maxEase: number;
  maxInterval: number;
  devMode: boolean;
  unlockCaps: boolean;
  showState: boolean;
  dayOffset: number;
  seed: number;
  customScore: string;
}

export const DEFAULTS: Settings = {
  theme: "brainy",
  scale: 1,
  nikudMode: "reveal",
  motion: true,
  glow: true,
  density: "comfy",
  fontStack: "default",
  levels: [1, 2, 3],
  tags: [],
  sessionSize: 12,
  modes: ["mcDef", "mcWord", "syn", "cloze", "type"],
  engine: "sm2",
  passThreshold: 3,
  firstInterval: 1,
  secondInterval: 3,
  intervalModifier: 1,
  easyBonus: 1.3,
  lapsePenalty: 0.2,
  lapseInterval: 1,
  minEase: 1.3,
  maxEase: 3.2,
  maxInterval: 365,
  devMode: false,
  unlockCaps: false,
  showState: false,
  dayOffset: 0,
  seed: 0,
  customScore: "",
};

export const MODE_META: Record<string, { label: string }> = {
  mcDef: { label: "מילה ← הגדרה" },
  mcWord: { label: "הגדרה ← מילה" },
  syn: { label: "נרדף / הפך" },
  cloze: { label: "השלמת משפט" },
  type: { label: "הקלדה" },
};

export type TabKey = "home" | "learn" | "practice" | "rewards" | "settings";

export const TABS: { k: TabKey; l: string; I: ComponentType<{ size?: number }> }[] = [
  { k: "home", l: "בית", I: Home },
  { k: "learn", l: "למידה", I: Layers },
  { k: "practice", l: "תרגול", I: Target },
  { k: "rewards", l: "הישגים", I: Trophy },
  { k: "settings", l: "הגדרות", I: Settings2 },
];
