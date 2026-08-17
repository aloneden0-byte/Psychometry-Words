import type { WordRow } from "../types";
import { rows as moral } from "./batch-01-moral";
import { rows as logic } from "./batch-02-logic";
import { rows as speech } from "./batch-03-speech";
import { rows as emotion } from "./batch-04-emotion";
import { rows as illusion_secrecy } from "./batch-05-illusion-secrecy";
import { rows as knowledge_truth } from "./batch-06-knowledge-truth";
import { rows as quantity_style } from "./batch-07-quantity-style";
import { rows as behavior_traits } from "./batch-08-behavior-traits";
import { rows as relations_politics } from "./batch-09-relations-politics";
import { rows as aramaic_legal } from "./batch-10-aramaic-legal";
import { rows as nature_science } from "./batch-11-nature-science";
import { rows as economy_time } from "./batch-12-economy-time";
import { rows as creativity } from "./batch-13-creativity";
import { rows as time_stability } from "./batch-14-time-stability";

export interface Batch {
  name: string;
  rows: WordRow[];
}

export const BATCHES: Batch[] = [
  { name: "moral", rows: moral },
  { name: "logic", rows: logic },
  { name: "speech", rows: speech },
  { name: "emotion", rows: emotion },
  { name: "illusion_secrecy", rows: illusion_secrecy },
  { name: "knowledge_truth", rows: knowledge_truth },
  { name: "quantity_style", rows: quantity_style },
  { name: "behavior_traits", rows: behavior_traits },
  { name: "relations_politics", rows: relations_politics },
  { name: "aramaic_legal", rows: aramaic_legal },
  { name: "nature_science", rows: nature_science },
  { name: "economy_time", rows: economy_time },
  { name: "creativity", rows: creativity },
  { name: "time_stability", rows: time_stability },
];
