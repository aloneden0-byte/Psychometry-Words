import type { Theme } from "../../theme/themes";

interface ProgressRingProps {
  T: Theme;
  cur: number;
  total: number;
  label: string;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}

export function ProgressRing({ T, cur, total, label, size = 72, stroke = 8, children }: ProgressRingProps) {
  const pct = total > 0 ? Math.min(1, cur / total) : 0;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={cur}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.line} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={T.a}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
