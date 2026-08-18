import type { Theme } from "../../theme/themes";

interface LevelBadgeProps {
  T: Theme;
  level: number;
  name: string;
  active?: boolean;
  size?: number;
}

export function LevelBadge({ T, level, name, active = true, size = 48 }: LevelBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: active ? T.a : T.line,
          color: active ? T.onAccent : T.soft,
          border: active ? "none" : `1px dashed ${T.soft}`,
          fontWeight: 800,
          fontSize: size * 0.32,
        }}
      >
        {level}
      </div>
      {/* label stays at full T.soft/bg contrast regardless of active state — see BadgeCard for why opacity-dimming text is avoided */}
      <span className="text-xs" style={{ color: T.soft, fontWeight: active ? 700 : 400 }}>
        {name}
      </span>
    </div>
  );
}
