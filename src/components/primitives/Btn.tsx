import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Theme } from "../../theme/themes";

type Tone = "ghost" | "solid" | "good" | "bad" | "warm";

interface BtnProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  children: ReactNode;
  T: Theme;
  tone?: Tone;
  style?: React.CSSProperties;
  /** Required whenever the button has no visible text child (icon-only buttons). */
  "aria-label"?: string;
}

export function Btn({ children, T, tone = "ghost", style, ...rest }: BtnProps) {
  const map: Record<Tone, { bg: string; bd: string; fg: string }> = {
    ghost: { bg: "transparent", bd: T.line, fg: T.ink },
    solid: { bg: T.a, bd: T.a, fg: T.onAccent },
    good: { bg: T.b, bd: T.b, fg: T.onAccent },
    bad: { bg: T.c, bd: T.c, fg: T.onAccent },
    warm: { bg: T.d, bd: T.d, fg: T.onAccent },
  };
  const m = map[tone];
  const shadow = tone === "ghost" ? "none" : `0 6px 16px -6px ${m.bg}99`;
  return (
    <button
      {...rest}
      className="rounded-[20px] px-4 py-2 text-sm transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none"
      style={{ background: m.bg, border: `1px solid ${m.bd}`, color: m.fg, fontWeight: 600, boxShadow: shadow, ...style }}
    >
      {children}
    </button>
  );
}
