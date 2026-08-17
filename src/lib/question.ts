import type { Word } from "../data/types";
import { shuffle } from "./rng";
import { strip } from "./strip";

export type QuestionMode = "mcDef" | "mcWord" | "syn" | "cloze" | "type";

export interface ChoiceQuestion {
  kind: "choice";
  w: Word;
  prompt: string;
  sub: string;
  correct: string;
  options: string[];
  quote?: boolean;
}

export interface TypeQuestion {
  kind: "type";
  w: Word;
  prompt: string;
  sub: string;
  correct: string;
}

export type Question = ChoiceQuestion | TypeQuestion;

export function buildQuestion(w: Word, pool: Word[], mode: QuestionMode, rnd: () => number): Question {
  const others = shuffle(
    pool.filter((x) => x.id !== w.id),
    rnd,
  );
  const near = shuffle([...others.filter((x) => x.level === w.level), ...others], rnd).slice(0, 3);

  if (mode === "mcDef")
    return {
      kind: "choice",
      w,
      prompt: w.word,
      sub: "מהי המשמעות?",
      correct: w.def,
      options: shuffle([w.def, ...near.map((x) => x.def)], rnd),
    };

  if (mode === "mcWord")
    return {
      kind: "choice",
      w,
      prompt: w.def,
      sub: "איזו מילה מתאימה?",
      correct: w.word,
      options: shuffle([w.word, ...near.map((x) => x.word)], rnd),
    };

  if (mode === "syn") {
    const useSyn = w.ant.length === 0 || rnd() > 0.5;
    const arr = useSyn ? w.syn : w.ant;
    if (!arr.length) return buildQuestion(w, pool, "mcDef", rnd);
    const ans = arr[Math.floor(rnd() * arr.length)];
    const bad = near.flatMap((x) => (useSyn ? x.ant : x.syn)).filter(Boolean).slice(0, 3);
    while (bad.length < 3) bad.push(near[bad.length]?.word || "—");
    return {
      kind: "choice",
      w,
      prompt: w.word,
      sub: useSyn ? "בחרו את המילה הנרדפת" : "בחרו את המילה ההפוכה",
      correct: ans,
      options: shuffle([ans, ...bad.slice(0, 3)], rnd),
    };
  }

  if (mode === "cloze") {
    const blanked = w.example.replace(new RegExp(strip(w.word).split(" ")[0], "u"), "▁▁▁▁");
    return {
      kind: "choice",
      w,
      prompt: blanked,
      sub: "מה משלים את המשפט?",
      correct: w.word,
      options: shuffle([w.word, ...near.map((x) => x.word)], rnd),
      quote: true,
    };
  }

  return { kind: "type", w, prompt: w.def, sub: "הקלידו את המילה (ניקוד לא נדרש)", correct: w.word };
}
