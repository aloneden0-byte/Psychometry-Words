import { useEffect, useRef } from "react";
import { Btn, Card } from "../primitives";
import { Mascot } from "./Mascot";
import { StarRow } from "./StarRow";
import type { Theme } from "../../theme/themes";

interface CelebrationScreenProps {
  T: Theme;
  starsEarned: number;
  title?: string;
  subtitle?: string;
  onContinue: () => void;
  continueLabel?: string;
  onSecondary?: () => void;
  secondaryLabel?: string;
}

export function CelebrationScreen({
  T,
  starsEarned,
  title = "כל הכבוד!",
  subtitle,
  onContinue,
  continueLabel = "המשך",
  onSecondary,
  secondaryLabel,
}: CelebrationScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Card
      T={T}
      className="p-8 text-center flex flex-col items-center gap-4"
      style={{ background: `linear-gradient(160deg, ${T.gradientFrom ?? T.a}, ${T.gradientTo ?? T.c})` }}
    >
      <Mascot T={T} pose="celebrating" size={88} />
      <h2 ref={headingRef} tabIndex={-1} style={{ color: "#fff", fontWeight: 800, fontSize: "1.5rem" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm" style={{ color: "#fff" }}>
          {subtitle}
        </p>
      )}
      {starsEarned > 0 && (
        <div className="flex flex-col items-center gap-1">
          <StarRow T={T} filled={starsEarned} total={starsEarned} size={28} />
          <span className="text-sm" style={{ color: "#fff", fontWeight: 700 }}>
            +{starsEarned} כוכבים
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2 items-center">
        <Btn T={T} tone="solid" style={{ padding: "14px 32px", background: "#fff", color: T.ink }} onClick={onContinue}>
          {continueLabel}
        </Btn>
        {onSecondary && secondaryLabel && (
          <button onClick={onSecondary} className="text-sm underline underline-offset-2" style={{ color: "#fff" }}>
            {secondaryLabel}
          </button>
        )}
      </div>
    </Card>
  );
}
