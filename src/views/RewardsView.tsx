import { Star } from "lucide-react";
import { Card, Progress } from "../components/primitives";
import { LevelBadge, BadgeCard, StreakPill } from "../components/gamification";
import { LEVELS, computeBadges, computeLevel, computeMastered, computeStars } from "../lib/gamification";
import type { Theme } from "../theme/themes";
import type { Word } from "../data/types";
import type { Streak } from "../lib/gamification";

interface RewardsViewProps {
  T: Theme;
  words: Word[];
  streak: Streak;
}

export function RewardsView({ T, words, streak }: RewardsViewProps) {
  const mastered = computeMastered(words);
  const totalStars = computeStars(words);
  const level = computeLevel(mastered);
  const badges = computeBadges({ words, totalStars, mastered, streak });

  return (
    <div className="flex flex-col gap-4">
      <Card T={T} className="p-6 text-center" style={{ background: `linear-gradient(160deg, ${T.gradientFrom}, ${T.gradientTo})` }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Star size={28} color="#fff" fill="#fff" aria-hidden="true" />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "2rem" }}>{totalStars}</span>
        </div>
        <div className="text-sm" style={{ color: "#fff" }}>
          סך הכול כוכבים
        </div>
      </Card>

      <StreakPill T={T} days={streak.best} label="השיא שלכם (ימים ברצף)" />

      <Card T={T} className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs" style={{ color: T.soft }}>
              הרמה הנוכחית
            </div>
            <div style={{ color: T.ink, fontWeight: 800, fontSize: "1.2rem" }}>{level.current.name}</div>
          </div>
        </div>
        {level.next && <Progress T={T} cur={level.progressInLevel} total={level.neededForNext} label={`ל${level.next.name}`} />}
        <div className="flex justify-between mt-4">
          {LEVELS.map((l) => (
            <LevelBadge key={l.level} T={T} level={l.level} name={l.name} active={mastered >= l.threshold} size={40} />
          ))}
        </div>
      </Card>

      <div>
        <div className="text-sm mb-2 px-1" style={{ color: T.ink, fontWeight: 700 }}>
          תגים
        </div>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <BadgeCard key={b.id} T={T} icon={b.icon} title={b.title} description={b.description} earned={b.earned} />
          ))}
        </div>
      </div>
    </div>
  );
}
