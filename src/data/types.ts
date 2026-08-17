export type WordRow = [
  word: string,
  nikud: string,
  root: string,
  pos: string,
  level: 1 | 2 | 3,
  def: string,
  syn: string[],
  ant: string[],
  example: string,
  tags: string[],
];

export interface Srs {
  ease: number;
  interval: number;
  due: number;
  reps: number;
  lapses: number;
}

export interface Stats {
  seen: number;
  correct: number;
  wrong: number;
}

export interface Word {
  id: string;
  word: string;
  nikud: string;
  root: string;
  pos: string;
  level: 1 | 2 | 3;
  def: string;
  syn: string[];
  ant: string[];
  example: string;
  tags: string[];
  srs: Srs;
  stats: Stats;
}

export const FIELDS = [
  "word",
  "nikud",
  "root",
  "pos",
  "level",
  "def",
  "syn",
  "ant",
  "example",
  "tags",
] as const;

export interface SchemaRow {
  f: string;
  t: string;
  d: string;
}

export const SCHEMA: SchemaRow[] = [
  { f: "id", t: "string", d: "מפתח ראשי — נגזר מן המילה, ייחודי" },
  { f: "word", t: "string", d: "המילה ללא ניקוד — כפי שתופיע בבחינה" },
  { f: "nikud", t: "string", d: "צורה מנוקדת — נחשפת בלחיצה" },
  { f: "root", t: "string", d: "שורש או מקור לועזי/ארמי" },
  { f: "pos", t: "string", d: "חלק דיבר" },
  { f: "level", t: "number", d: "רמת קושי 1–3" },
  { f: "def", t: "string", d: "הגדרה" },
  { f: "syn", t: "string[]", d: "מילים נרדפות" },
  { f: "ant", t: "string[]", d: "מילים הפוכות" },
  { f: "example", t: "string", d: "משפט הקשר" },
  { f: "tags", t: "string[]", d: "תגיות סמנטיות לסינון" },
  { f: "srs", t: "object", d: "{ ease, interval, due, reps, lapses }" },
  { f: "stats", t: "object", d: "{ seen, correct, wrong }" },
];
