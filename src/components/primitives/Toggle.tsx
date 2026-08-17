import type { Theme } from "../../theme/themes";

interface ToggleProps {
  on: boolean;
  set: (v: boolean) => void;
  T: Theme;
  label: string;
}

export function Toggle({ on, set, T, label }: ToggleProps) {
  return (
    <button
      onClick={() => set(!on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="rounded-full transition-all"
      style={{ width: 46, height: 26, background: on ? T.a : T.line, padding: 3 }}
    >
      <div
        className="rounded-full transition-all"
        style={{
          width: 20,
          height: 20,
          background: T.card,
          transform: `translateX(${on ? -20 : 0}px)`,
          boxShadow: "0 1px 3px rgba(0,0,0,.15)",
        }}
      />
    </button>
  );
}
