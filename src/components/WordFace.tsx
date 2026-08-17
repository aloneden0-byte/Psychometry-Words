import type { Theme } from "../theme/themes";
import { LEVEL_COLOR_KEYS } from "../theme/themes";
import type { Word } from "../data/types";

interface WordFaceProps {
  w: Word;
  revealed: boolean;
  T: Theme;
  mode: "always" | "reveal" | "never";
}

export function WordFace({ w, revealed, T, mode }: WordFaceProps) {
  const showNikud = mode === "always" || (mode === "reveal" && revealed);
  return (
    <div className="text-center select-none">
      <div className="relative inline-block">
        <div
          key={showNikud ? "n" : "p"}
          className="wordface"
          style={{
            fontFamily: "var(--display)",
            fontWeight: 700,
            fontSize: "calc(2.6rem * var(--fs))",
            lineHeight: 1.5,
            color: T.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {showNikud ? w.nikud : w.word}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
        <span
          className="rounded-lg px-2 py-0.5 text-xs"
          style={{ fontFamily: "var(--mono)", background: T.line, color: T.ink, letterSpacing: ".06em" }}
        >
          {w.root}
        </span>
        <span className="text-xs" style={{ color: T.soft }}>
          {w.pos}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs"
          style={{ background: T[LEVEL_COLOR_KEYS[w.level - 1]], color: T.onAccent, fontWeight: 700 }}
        >
          רמה {w.level}
        </span>
      </div>
    </div>
  );
}
