import type { ComponentType } from "react";
import { Lock } from "lucide-react";
import { Card } from "../primitives";
import type { Theme } from "../../theme/themes";

interface BadgeCardProps {
  T: Theme;
  icon: ComponentType<{ size?: number; color?: string }>;
  title: string;
  description: string;
  earned: boolean;
}

/**
 * "Locked" state is conveyed via the icon container (muted fill + lock icon)
 * and an sr-only status label — never via reduced opacity on the card as a
 * whole, which silently drops the title/description text below WCAG AA
 * contrast (the same failure mode fixed once already in Stat.tsx).
 */
export function BadgeCard({ T, icon: Icon, title, description, earned }: BadgeCardProps) {
  return (
    <Card T={T} className="p-3 flex flex-col items-center text-center gap-1.5">
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{ width: 44, height: 44, background: earned ? T.d + "77" : T.line }}
      >
        {earned ? <Icon size={22} color={T.ink} /> : <Lock size={18} color={T.soft} aria-hidden="true" />}
      </div>
      <div className="text-sm" style={{ color: T.ink, fontWeight: 700 }}>
        {title}
      </div>
      <div className="text-xs leading-snug" style={{ color: T.soft }}>
        {description}
      </div>
      <span className="sr-only">{earned ? "הושג" : "טרם הושג"}</span>
    </Card>
  );
}
