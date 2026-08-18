import { Flame } from "lucide-react";
import type { Theme } from "../../theme/themes";

interface StreakPillProps {
  T: Theme;
  days: number;
  label?: string;
}

export function StreakPill({ T, days, label = "רצף ימים" }: StreakPillProps) {
  return (
    <div
      className="rounded-2xl px-3 py-1.5 flex items-center gap-1.5 w-fit"
      style={{ background: T.d + "55", color: T.ink }}
      role="status"
      aria-label={`${days} ${label}`}
      data-testid="streak-pill"
    >
      <Flame size={16} color={T.starColor ?? T.d} aria-hidden="true" />
      <b>{days}</b>
      <span className="text-xs opacity-80">{label}</span>
    </div>
  );
}
