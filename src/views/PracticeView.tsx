import { useMemo, useRef, useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Btn, Card, Empty, Progress, Stat } from "../components/primitives";
import { CelebrationScreen, StreakPill } from "../components/gamification";
import { LiveRegion } from "../components/LiveRegion";
import { buildQuestion, type QuestionMode } from "../lib/question";
import { rng } from "../lib/rng";
import { strip } from "../lib/strip";
import type { Theme } from "../theme/themes";
import type { Word } from "../data/types";
import type { Settings } from "../constants";

const GENTLE_WRONG = [
  (correct: string) => `כמעט! התשובה הנכונה היא ${correct}`,
  (correct: string) => `לא נורא — התשובה הנכונה: ${correct}`,
  (correct: string) => `בפעם הבאה! התשובה הנכונה היא ${correct}`,
  (correct: string) => `קרוב! התשובה הנכונה: ${correct}`,
];

interface PracticeViewProps {
  deck: Word[];
  T: Theme;
  s: Settings;
  grade: (id: string, q: number) => void;
  glow: boolean;
  sessionSizeOverride?: number;
  onDone?: () => void;
}

interface Score {
  ok: number;
  no: number;
  streak: number;
  best: number;
}

export function PracticeView({ deck, T, s, grade, glow, sessionSizeOverride, onDone }: PracticeViewProps) {
  const [n, setN] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState<Score>({ ok: 0, no: 0, streak: 0, best: 0 });
  const [announce, setAnnounce] = useState("");
  const seedRef = useRef(s.seed || Date.now());

  const q = useMemo(() => {
    if (!deck.length) return null;
    const rnd = rng(seedRef.current + n * 7919);
    const w = deck[Math.floor(rnd() * deck.length)];
    const modes = s.modes.length ? s.modes : ["mcDef"];
    const mode = modes[Math.floor(rnd() * modes.length)] as QuestionMode;
    return buildQuestion(w, deck, mode, rnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, deck, s.modes]);

  if (!deck.length) return <Empty T={T} text="אין מילים שעונות על הסינון. שנו את הרמות או התגיות בהגדרות." />;
  if (!q) return null;

  const done = pick !== null;
  const correct = done && (q.kind === "type" ? strip(typed) === strip(q.correct) : pick === q.correct);
  const sessionSize = sessionSizeOverride ?? s.sessionSize;

  const answer = (val: string) => {
    if (done) return;
    setPick(val);
    const ok = q.kind === "type" ? strip(val) === strip(q.correct) : val === q.correct;
    grade(q.w.id, ok ? 4 : 1);
    setAnnounce(ok ? "נכון!" : GENTLE_WRONG[n % GENTLE_WRONG.length](q.correct));
    setScore((s0) => {
      const st = ok ? s0.streak + 1 : 0;
      return { ok: s0.ok + (ok ? 1 : 0), no: s0.no + (ok ? 0 : 1), streak: st, best: Math.max(s0.best, st) };
    });
  };

  const cap = s.unlockCaps ? Infinity : sessionSize;
  const total = score.ok + score.no;

  if (!s.unlockCaps && total >= sessionSize) {
    return (
      <CelebrationScreen
        T={T}
        starsEarned={score.ok}
        subtitle={`סיימתם מקבץ של ${sessionSize} שאלות · דיוק ${Math.round((score.ok / Math.max(1, total)) * 100)}%`}
        continueLabel={onDone ? "לבית" : "מקבץ נוסף"}
        onContinue={() => {
          if (onDone) onDone();
          else setScore({ ok: 0, no: 0, streak: 0, best: score.best });
        }}
        onSecondary={onDone ? () => setScore({ ok: 0, no: 0, streak: 0, best: score.best }) : undefined}
        secondaryLabel={onDone ? "מקבץ נוסף" : undefined}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Progress T={T} cur={Math.min(total, cap === Infinity ? total : cap)} total={cap === Infinity ? Math.max(total, 1) : cap} label="שאלה" />
      </div>
      <LiveRegion message={announce} />

      {/* סטטיסטיקת הסבב מוצגת בין שאלות בלבד — לא בזמן מענה, כדי לשמור מיקוד על שאלה אחת */}
      {done && (
        <div className="flex gap-2 justify-center text-xs" style={{ fontFamily: "var(--mono)" }}>
          <Stat T={T} c={T.b} v={score.ok} l="נכון" />
          <Stat T={T} c={T.c} v={score.no} l="שגוי" />
          <StreakPill T={T} days={score.streak} label="רצף" />
        </div>
      )}

      <div className="relative">
        {glow && (
          <div
            className="focus-glow"
            aria-hidden="true"
            style={{ background: `radial-gradient(circle, ${(done ? (correct ? T.b : T.c) : T.a)}55, transparent 70%)` }}
          />
        )}
        <Card T={T} className="relative p-6">
          <div className="text-xs text-center mb-3" style={{ color: T.soft }}>
            {q.sub}
          </div>
          <div
            className="text-center leading-relaxed"
            style={{
              fontFamily: (q.kind === "choice" && q.quote) || q.kind === "type" ? "var(--body)" : "var(--display)",
              fontWeight: q.kind === "choice" && !q.quote ? 700 : 400,
              fontSize: `calc(${q.prompt.length > 46 ? 1.05 : 2.1}rem * var(--fs))`,
              color: T.ink,
            }}
          >
            {q.kind === "choice" && q.quote ? `״${q.prompt}״` : q.prompt}
          </div>

          {q.kind === "choice" ? (
            <MCQOptions q={q} T={T} done={done} pick={pick} answer={answer} />
          ) : (
            <div className="mt-6 flex gap-2">
              <label className="sr-only" htmlFor="typed-answer">
                {q.sub}
              </label>
              <input
                id="typed-answer"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                disabled={done}
                onKeyDown={(e) => e.key === "Enter" && answer(typed)}
                placeholder="הקלידו כאן…"
                className="flex-1 rounded-2xl px-4 py-3 text-center"
                style={{
                  background: "transparent",
                  border: `1px solid ${done ? (correct ? T.b : T.c) : T.line}`,
                  color: T.ink,
                  fontFamily: "var(--display)",
                  fontSize: "calc(1.2rem * var(--fs))",
                  minHeight: 52,
                }}
              />
              <Btn T={T} tone="solid" style={{ minHeight: 52, padding: "0 20px" }} onClick={() => answer(typed)} disabled={done}>
                בדוק
              </Btn>
            </div>
          )}

          {done && (
            <div className="mt-5 pt-4 text-center" style={{ borderTop: `1px dashed ${T.line}` }}>
              <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "calc(1.5rem * var(--fs))", color: T.ink }}>
                {q.w.nikud}
              </div>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: T.soft }}>
                {q.w.def}
              </p>
              <p className="text-xs mt-2" style={{ color: T.soft, fontFamily: "var(--display)" }}>
                ״{q.w.example}״
              </p>
            </div>
          )}
        </Card>
      </div>

      {done && (
        <Btn
          T={T}
          tone="solid"
          style={{ padding: "16px", minHeight: 56 }}
          onClick={() => {
            setPick(null);
            setTyped("");
            setAnnounce("");
            setN((x) => x + 1);
          }}
        >
          השאלה הבאה
        </Btn>
      )}
    </div>
  );
}

function MCQOptions({
  q,
  T,
  done,
  pick,
  answer,
}: {
  q: { options: string[]; correct: string };
  T: Theme;
  done: boolean;
  pick: string | null;
  answer: (val: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < q.options.length) answer(q.options[idx]);
    };
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
  }, [done, q.options, answer]);

  return (
    <div className="grid gap-2 mt-6" ref={containerRef}>
      {q.options.map((o, k) => {
        const isC = o === q.correct;
        const isP = o === pick;
        const bg = !done ? "transparent" : isC ? T.b + "77" : isP ? T.c + "77" : "transparent";
        return (
          <button
            key={k}
            onClick={() => answer(o)}
            disabled={done}
            className="rounded-2xl px-5 py-4 text-right transition-all active:scale-98"
            style={{
              background: bg,
              border: `1px solid ${done && (isC || isP) ? "transparent" : T.line}`,
              color: T.ink,
              fontSize: "calc(.95rem * var(--fs))",
              lineHeight: 1.6,
              minHeight: 56,
            }}
          >
            <span className="ml-2" style={{ fontFamily: "var(--mono)", color: T.soft }}>
              {k + 1}
            </span>
            {o}
            {done && isC && <Check size={15} className="inline mr-2" aria-hidden="true" />}
            {done && isP && !isC && <X size={15} className="inline mr-2" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
