import type { ReactNode } from "react";
import type { Theme } from "../../theme/themes";

export function Tag({ children, T, c }: { children: ReactNode; T: Theme; c: string }) {
  return (
    <span className="rounded-full px-2.5 py-1 text-xs" style={{ background: c + (T.dark ? "44" : "66"), color: T.ink }}>
      {children}
    </span>
  );
}
