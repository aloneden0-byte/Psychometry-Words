import type { Theme } from "../../theme/themes";

interface NumProps {
  v: number;
  set: (v: number) => void;
  T: Theme;
  step?: number;
  min?: number;
  max?: number;
  w?: number;
  "aria-label"?: string;
}

export function Num({ v, set, T, step = 1, min = 0, max = 9999, w = 74, ...rest }: NumProps) {
  return (
    <input
      type="number"
      value={v}
      step={step}
      min={min}
      max={max}
      onChange={(e) => set(Number(e.target.value))}
      className="rounded-xl px-2 py-1.5 text-sm text-center"
      style={{ width: w, background: "transparent", border: `1px solid ${T.line}`, color: T.ink, fontFamily: "var(--mono)" }}
      {...rest}
    />
  );
}
