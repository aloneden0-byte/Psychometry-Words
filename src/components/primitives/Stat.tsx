import type { ReactNode } from "react";
import type { Theme } from "../../theme/themes";

export function Stat({ T, c, v, l, icon }: { T: Theme; c: string; v: number; l: string; icon?: ReactNode }) {
  return (
    <div className="rounded-xl px-3 py-1.5 flex items-center gap-1.5" style={{ background: c + (T.dark ? "33" : "55"), color: T.ink }}>
      {icon}
      <b>{v}</b>
      <span>{l}</span>
    </div>
  );
}
