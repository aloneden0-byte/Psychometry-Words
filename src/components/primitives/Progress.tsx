import type { Theme } from "../../theme/themes";

export function Progress({ T, cur, total, label }: { T: Theme; cur: number; total: number; label: string }) {
  const pct = total > 0 ? (cur / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5" style={{ color: T.soft }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--mono)" }}>
          {cur} / {total}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: T.line }}
        role="progressbar"
        aria-valuenow={cur}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label}
      >
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: T.a }} />
      </div>
    </div>
  );
}
