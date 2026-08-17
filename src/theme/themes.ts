export interface Theme {
  name: string;
  bg: string;
  card: string;
  ink: string;
  soft: string;
  line: string;
  a: string;
  b: string;
  c: string;
  d: string;
  dark: boolean;
  /** Text color to use ON TOP of solid a/b/c/d accent fills (badges, solid buttons, active pills). */
  onAccent: string;
  /** Vivid gradient stops for full-bleed decorative surfaces (celebration screens, hero headers) — used only behind onAccent/white text, exempt from the a/b/c/d text-bearing-fill contrast rules. */
  gradientFrom?: string;
  gradientTo?: string;
  /** Vivid icon-fill color for star/reward iconography — checked for 3:1 non-text contrast against bg/card, like any icon color. */
  starColor?: string;
}

/**
 * Single "brainy" theme — a bright, playful purple/mint/pink/gold palette
 * replacing the previous 5 pastel alternates. Every pairing below is
 * calibrated the same way the original 5 were: `ink`/`soft` measured
 * against `bg`/`card` for WCAG AA text contrast (4.5:1+), `onAccent`
 * measured against each of `a/b/c/d` for text-on-solid-fill, `ink`
 * measured against `a/b/c/d` alpha-composited at the actual 55/66/77/88
 * suffixes used in code, and `starColor`/gradient stops measured against
 * `bg`/`card` for the 3:1 non-text minimum. See scripts/check-contrast.ts.
 */
export const THEMES: Record<string, Theme> = {
  brainy: {
    name: "בריינית",
    bg: "#F5F1FF",
    card: "#FDFCFF",
    ink: "#2A1B54",
    soft: "#6B5A94",
    line: "#E6DFFA",
    a: "#9B7FE8",
    b: "#7FD9B9",
    c: "#F5A9C8",
    d: "#FCD34D",
    dark: false,
    onAccent: "#241849",
    gradientFrom: "#7C4FE0",
    gradientTo: "#C2255C",
    starColor: "#A8660A",
  },
};

export const LEVEL_COLOR_KEYS = ["b", "d", "c"] as const;

/**
 * CSS custom properties driven by the active theme, applied on the root
 * element. The focus ring uses `ink` (13+:1 against bg/card) rather than
 * the accent color, which fails WCAG's 3:1 non-text contrast requirement
 * against light backgrounds. The accent color still appears as a soft
 * outer glow, preserving "theme accent = focus color" as a visual identity
 * while the actual contrast-bearing ring is always high-contrast.
 */
export function themeVars(T: Theme, scale: number): Record<string, string> {
  return {
    "--fs": String(scale),
    "--focus-ring": T.ink,
    "--focus-ring-glow": T.a + (T.dark ? "55" : "66"),
  };
}
