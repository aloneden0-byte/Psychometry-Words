import type { Word, Srs } from "../../data/types";

export interface SrsParams {
  now: number;
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
}

export type SrsEngine = (card: Word, q: number, p: SrsParams) => Srs;
