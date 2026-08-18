import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Btn, Card, Empty, Progress, Tag } from "../components/primitives";
import { CelebrationScreen } from "../components/gamification";
import { WordFace } from "../components/WordFace";
import { LiveRegion } from "../components/LiveRegion";
import type { Theme } from "../theme/themes";
import type { Word } from "../data/types";
import type { Settings } from "../constants";

const BATCH_SIZE = 5;

interface LearnViewProps {
  deck: Word[];
  T: Theme;
  s: Settings;
  grade: (id: string, q: number) => void;
  glow: boolean;
  onDone?: () => void;
}

export function LearnView({ deck, T, s, grade, glow, onDone }: LearnViewProps) {
  const [i, setI] = useState(0);
  const [rev, setRev] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [seenInBatch, setSeenInBatch] = useState(0);
  const [batchDone, setBatchDone] = useState(false);

  useEffect(() => {
    setI(0);
    setRev(false);
  }, [deck.length]);

  if (!deck.length) return <Empty T={T} text="אין מילים שעונות על הסינון. שנו את הרמות או התגיות בהגדרות." />;

  if (batchDone) {
    return (
      <CelebrationScreen
        T={T}
        starsEarned={0}
        title="כרטיסיית לימוד הושלמה!"
        subtitle={`עברתם על ${BATCH_SIZE} מילים חדשות`}
        continueLabel={onDone ? "לבית" : "המשך"}
        onContinue={() => {
          setBatchDone(false);
          setSeenInBatch(0);
          onDone?.();
        }}
        onSecondary={
          onDone
            ? () => {
                setBatchDone(false);
                setSeenInBatch(0);
              }
            : undefined
        }
        secondaryLabel={onDone ? "מקבץ נוסף" : undefined}
      />
    );
  }

  const w = deck[Math.min(i, deck.length - 1)];

  const reveal = () => {
    setRev(true);
    setAnnounce("המשמעות נחשפה");
  };

  const next = (q: number) => {
    grade(w.id, q);
    setRev(false);
    setAnnounce("");
    setI((x) => (x + 1) % deck.length);
    setSeenInBatch((x) => {
      const nx = x + 1;
      if (nx >= BATCH_SIZE) setBatchDone(true);
      return nx;
    });
  };

  const onGradeKeyDown = (e: React.KeyboardEvent) => {
    if (!rev) return;
    if (e.key === "1") next(0);
    else if (e.key === "2") next(3);
    else if (e.key === "3") next(4);
    else if (e.key === "4") next(5);
  };

  return (
    <div className="flex flex-col gap-4" onKeyDown={onGradeKeyDown}>
      <Progress T={T} cur={seenInBatch + 1} total={BATCH_SIZE} label="מקבץ לימוד" />
      <LiveRegion message={announce} />
      <div className="relative">
        {glow && <div className="focus-glow" aria-hidden="true" style={{ background: `radial-gradient(circle, ${T.a}55, transparent 70%)` }} />}
        <Card T={T} className="relative p-6 pt-8">
          <WordFace w={w} revealed={rev} T={T} mode={s.nikudMode} />
          <div className={`reveal ${rev ? "open" : ""}`}>
            <div className="pt-5 mt-5" style={{ borderTop: `1px dashed ${T.line}` }}>
              <p className="text-center leading-relaxed" style={{ color: T.ink, fontSize: "calc(1.05rem * var(--fs))" }}>
                {w.def}
              </p>
              <p
                className="text-center mt-4 leading-relaxed"
                style={{ color: T.soft, fontFamily: "var(--display)", fontSize: "calc(.95rem * var(--fs))" }}
              >
                ״{w.example}״
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                {w.syn.map((x) => (
                  <Tag key={x} T={T} c={T.b}>
                    ≈ {x}
                  </Tag>
                ))}
                {w.ant.map((x) => (
                  <Tag key={x} T={T} c={T.c}>
                    ↔ {x}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
          {!rev && (
            <div className="mt-6 text-center">
              <Btn T={T} tone="solid" style={{ padding: "16px 28px" }} onClick={reveal}>
                גלה ניקוד ומשמעות
              </Btn>
            </div>
          )}
        </Card>
      </div>
      {rev && (
        <div className="grid grid-cols-4 gap-2">
          <Btn T={T} tone="bad" style={{ minHeight: 56 }} onClick={() => next(0)} title="מקש 1">
            שכחתי
          </Btn>
          <Btn T={T} tone="warm" style={{ minHeight: 56 }} onClick={() => next(3)} title="מקש 2">
            קשה
          </Btn>
          <Btn T={T} tone="good" style={{ minHeight: 56 }} onClick={() => next(4)} title="מקש 3">
            ידעתי
          </Btn>
          <Btn T={T} tone="solid" style={{ minHeight: 56 }} onClick={() => next(5)} title="מקש 4">
            קל
          </Btn>
        </div>
      )}
      <div className="flex justify-between">
        <Btn
          T={T}
          aria-label="הכרטיסייה הקודמת"
          onClick={() => {
            setRev(false);
            setI((x) => (x - 1 + deck.length) % deck.length);
          }}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </Btn>
        <span className="text-xs self-center" style={{ color: T.soft, fontFamily: "var(--mono)" }}>
          ease {w.srs.ease.toFixed(2)} · int {w.srs.interval}ד · reps {w.srs.reps}
        </span>
        <Btn
          T={T}
          aria-label="הכרטיסייה הבאה"
          onClick={() => {
            setRev(false);
            setI((x) => (x + 1) % deck.length);
          }}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </Btn>
      </div>
    </div>
  );
}
