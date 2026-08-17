import type { ReactNode } from "react";
import type { Theme } from "../../theme/themes";

interface PillProps {
  children: ReactNode;
  T: Theme;
  active?: boolean;
  onClick: () => void;
  "aria-label"?: string;
}

export function Pill({ children, T, active, onClick, ...rest }: PillProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full px-3 py-1 text-xs transition-all active:scale-95"
      style={{
        background: active ? T.a : "transparent",
        border: `1px solid ${active ? T.a : T.line}`,
        color: active ? T.onAccent : T.ink,
        fontWeight: 600,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
