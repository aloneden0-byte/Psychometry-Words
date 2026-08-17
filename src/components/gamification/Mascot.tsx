import type { Theme } from "../../theme/themes";

interface MascotProps {
  T: Theme;
  pose?: "neutral" | "happy" | "celebrating";
  size?: number;
  className?: string;
}

/**
 * Simple flat geometric owl mascot — rounded shapes only (body, ear-tufts,
 * eyes, beak, wings), re-themed via theme tokens instead of a binary asset.
 * Intentionally simple, not a polished illustration.
 */
export function Mascot({ T, pose = "neutral", size = 96, className }: MascotProps) {
  const bodyColor = T.a;
  const bellyColor = T.card;
  const beakColor = T.starColor ?? T.d;
  const eyeWhite = T.card;
  const pupilColor = T.onAccent;

  const wingsUp = pose === "celebrating";
  const eyesHappy = pose === "happy" || pose === "celebrating";

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      {/* ear tufts */}
      <path d="M 30 24 L 22 6 L 42 18 Z" fill={bodyColor} />
      <path d="M 70 24 L 78 6 L 58 18 Z" fill={bodyColor} />

      {/* wings */}
      {wingsUp ? (
        <>
          <ellipse cx="16" cy="46" rx="9" ry="16" fill={bodyColor} transform="rotate(-35 16 46)" />
          <ellipse cx="84" cy="46" rx="9" ry="16" fill={bodyColor} transform="rotate(35 84 46)" />
        </>
      ) : (
        <>
          <ellipse cx="20" cy="64" rx="8" ry="14" fill={bodyColor} />
          <ellipse cx="80" cy="64" rx="8" ry="14" fill={bodyColor} />
        </>
      )}

      {/* body */}
      <ellipse cx="50" cy="58" rx="34" ry="32" fill={bodyColor} />
      {/* belly */}
      <ellipse cx="50" cy="64" rx="21" ry="20" fill={bellyColor} />

      {/* eyes */}
      {eyesHappy ? (
        <>
          <path d="M 30 52 Q 38 42 46 52" stroke={pupilColor} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 54 52 Q 62 42 70 52" stroke={pupilColor} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="38" cy="52" r="11" fill={eyeWhite} />
          <circle cx="62" cy="52" r="11" fill={eyeWhite} />
          <circle cx="39" cy="53" r="5" fill={pupilColor} />
          <circle cx="63" cy="53" r="5" fill={pupilColor} />
        </>
      )}

      {/* beak */}
      <path d="M 46 62 L 54 62 L 50 70 Z" fill={beakColor} />

      {/* crown accent */}
      <path d="M 42 12 L 46 4 L 50 10 L 54 4 L 58 12 L 50 16 Z" fill={beakColor} />
    </svg>
  );
}
