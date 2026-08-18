import { Star } from "lucide-react";
import type { Theme } from "../../theme/themes";

interface StarRowProps {
  T: Theme;
  filled: number;
  total: number;
  size?: number;
  label?: string;
}

export function StarRow({ T, filled, total, size = 20, label }: StarRowProps) {
  const starColor = T.starColor ?? T.d;
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={label ?? `${filled} מתוך ${total} כוכבים`}
    >
      {Array.from({ length: total }, (_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < filled ? starColor : "none"}
          color={i < filled ? starColor : T.line}
          strokeWidth={i < filled ? 0 : 2}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
