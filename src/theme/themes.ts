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
}

/**
 * 5 pastel palettes. `soft` (secondary/hint text) in `sage` and `mist` was
 * darkened from the original design pass — the initial values measured
 * 4.49:1 and 4.50:1 against `bg`, just under WCAG AA's 4.5:1 text minimum.
 * Every other pairing here clears AA with real margin (see
 * scripts/check-contrast.ts, which re-verifies this on every change).
 */
export const THEMES: Record<string, Theme> = {
  iris: {
    name: "אירוס",
    bg: "#F4F1FA",
    card: "#FCFBFE",
    ink: "#302B42",
    soft: "#6E6689",
    line: "#E4DEF2",
    a: "#C6BCEA",
    b: "#AED8C2",
    c: "#F2BFC7",
    d: "#F3DFA8",
    dark: false,
    onAccent: "#302B42",
  },
  sage: {
    name: "מרווה",
    bg: "#EFF5F1",
    card: "#FBFDFC",
    ink: "#26362E",
    soft: "#4F6659",
    line: "#DBE8E0",
    a: "#A9D3BB",
    b: "#BFD6EC",
    c: "#EEC5B8",
    d: "#EADFA6",
    dark: false,
    onAccent: "#26362E",
  },
  almond: {
    name: "שקד",
    bg: "#FBF3EE",
    card: "#FFFCFA",
    ink: "#3B2F2A",
    soft: "#7C6A61",
    line: "#EFE0D7",
    a: "#F0C6AC",
    b: "#BFD9C6",
    c: "#E8B7BE",
    d: "#EBD9A4",
    dark: false,
    onAccent: "#3B2F2A",
  },
  mist: {
    name: "ערפל",
    bg: "#EFF2F7",
    card: "#FBFCFE",
    ink: "#26303D",
    soft: "#566270",
    line: "#DCE3EC",
    a: "#B3CBE6",
    b: "#B2D9CD",
    c: "#E4BFD3",
    d: "#E9DCA9",
    dark: false,
    onAccent: "#26303D",
  },
  night: {
    name: "לילה רך",
    bg: "#1E1B2A",
    card: "#272338",
    ink: "#EDE9F7",
    soft: "#A79FC2",
    line: "#372F4D",
    a: "#9A8BD0",
    b: "#7FB79C",
    c: "#D2909C",
    d: "#CFB673",
    dark: true,
    onAccent: "#12101B",
  },
};

export const LEVEL_COLOR_KEYS = ["b", "d", "c"] as const;

/**
 * CSS custom properties driven by the active theme, applied on the root
 * element. The focus ring uses `ink` (11.5–14.1:1 against bg/card in every
 * theme) rather than the reference's raw accent color, which measured only
 * ~1.4–1.6:1 against light-theme backgrounds — far under WCAG's 3:1 non-text
 * contrast requirement. The accent color still appears as a soft outer glow,
 * so the visual identity (theme accent = focus color) is preserved while the
 * actual contrast-bearing ring is always high-contrast.
 */
export function themeVars(T: Theme, scale: number): Record<string, string> {
  return {
    "--fs": String(scale),
    "--focus-ring": T.ink,
    "--focus-ring-glow": T.a + (T.dark ? "55" : "66"),
  };
}

