import { Layers, Star, Target } from "lucide-react";
import { Card, Progress, ProgressRing } from "../components/primitives";
import { Mascot, StreakPill } from "../components/gamification";
import { computeLevel, computeMastered, computeStars } from "../lib/gamification";
import type { Theme } from "../theme/themes";
import type { Word } from "../data/types";
import type { Streak } from "../lib/gamification";
import type { TabKey } from "../constants";

interface DashboardViewProps {
  T: Theme;
  words: Word[];
  streak: Streak;
  onNavigate: (tab: TabKey) => void;
  onQuickPractice: () => void;
}

export function DashboardView({ T, words, streak, onNavigate, onQuickPractice }: DashboardViewProps) {
  const mastered = computeMastered(words);
  const totalStars = computeStars(words);
  const level = computeLevel(mastered);

  return (
    <div className="flex flex-col gap-4">
      <StreakPill T={T} days={streak.current} />

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("learn")}
          className="rounded-3xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95"
          style={{ background: T.b + "55" }}
        >
          <Layers size={22} color={T.ink} aria-hidden="true" />
          <span className="text-sm" style={{ color: T.ink, fontWeight: 700 }}>
            למידה
          </span>
        </button>
        <button
          onClick={onQuickPractice}
          className="rounded-3xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95"
          style={{ background: T.c + "55" }}
        >
          <Target size={22} color={T.ink} aria-hidden="true" />
          <span className="text-sm" style={{ color: T.ink, fontWeight: 700 }}>
            תרגול מהיר (5 שאלות)
          </span>
        </button>
      </div>

      <Card T={T} className="p-5 flex items-center gap-4">
        <ProgressRing T={T} cur={level.progressInLevel} total={level.neededForNext || 1} label="התקדמות לרמה הבאה" size={76}>
          <div className="text-center">
            <div style={{ color: T.ink, fontWeight: 800, fontSize: "1.1rem" }}>{level.current.level}</div>
          </div>
        </ProgressRing>
        <div>
          <div className="text-sm" style={{ color: T.soft }}>
            הרמה הנוכחית
          </div>
          <div style={{ color: T.ink, fontWeight: 800, fontSize: "1.2rem" }}>{level.current.name}</div>
          {level.next && (
            <div className="text-xs mt-1" style={{ color: T.soft }}>
              עוד {level.neededForNext - level.progressInLevel} מילים מוטמעות ל{level.next.name}
            </div>
          )}
        </div>
      </Card>

      <Card T={T} className="p-4">
        <div className="text-sm mb-3" style={{ color: T.ink, fontWeight: 700 }}>
          ההתקדמות שלך
        </div>
        <div className="flex flex-col gap-3">
          <Progress T={T} cur={mastered} total={words.length} label="מילים מוטמעות" />
          <div className="flex items-center gap-2 text-sm" style={{ color: T.ink }}>
            <Star size={16} color={T.starColor ?? T.d} fill={T.starColor ?? T.d} aria-hidden="true" />
            <b>{totalStars}</b>
            <span style={{ color: T.soft }}>כוכבים שנצברו בסך הכול</span>
          </div>
        </div>
      </Card>

      <Card T={T} className="p-5 flex items-center gap-4" style={{ background: `linear-gradient(135deg, ${T.gradientFrom}22, ${T.gradientTo}22)` }}>
        <Mascot T={T} pose="happy" size={64} />
        <p className="text-sm leading-relaxed" style={{ color: T.ink }}>
          {streak.current > 0 ? `כל הכבוד על רצף של ${streak.current} ימים! ממשיכים?` : "מוכנים למקבץ קצר של תרגול?"}
        </p>
      </Card>
    </div>
  );
}
