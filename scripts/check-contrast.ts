import { THEMES } from "../src/theme/themes";

/** WCAG relative luminance + contrast ratio (same formula used to calibrate every theme in this repo). */
function luminance(hex: string): number {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const f = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(hex1: string, hex2: string): number {
  const [l1, l2] = [luminance(hex1), luminance(hex2)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Alpha-composite `fg` over `bg` at the given 2-digit hex alpha suffix (e.g. "77" as used in `T.a + "77"` overlays). */
function compositeAlpha(fg: string, bg: string, alphaHex: string): string {
  const alpha = parseInt(alphaHex, 16) / 255;
  const parse = (hex: string) => (hex.replace("#", "").match(/.{2}/g) ?? []).map((h) => parseInt(h, 16));
  const [fr, fg2, fb] = parse(fg);
  const [br, bgc, bb] = parse(bg);
  const mix = [fr, fg2, fb].map((c, i) => Math.round(c * alpha + [br, bgc, bb][i] * (1 - alpha)));
  return "#" + mix.map((v) => v.toString(16).padStart(2, "0")).join("");
}

const ALPHA_SUFFIXES = ["55", "66", "77", "88"];
const ACCENT_KEYS = ["a", "b", "c", "d"] as const;

let failures = 0;
const check = (label: string, ratio: number, min: number) => {
  const ok = ratio >= min;
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} ${label}: ${ratio.toFixed(2)} (need ${min}:1)`);
};

for (const [key, T] of Object.entries(THEMES)) {
  console.log(`\n== theme: ${key} (${T.name}) ==`);
  check("ink/bg (text)", contrast(T.ink, T.bg), 4.5);
  check("ink/card (text)", contrast(T.ink, T.card), 4.5);
  check("soft/bg (text)", contrast(T.soft, T.bg), 4.5);
  check("soft/card (text)", contrast(T.soft, T.card), 4.5);
  check("focus-ring (ink) /bg (non-text 3:1)", contrast(T.ink, T.bg), 3);

  for (const k of ACCENT_KEYS) {
    check(`onAccent/${k} (text on solid fill)`, contrast(T.onAccent, T[k]), 4.5);
  }

  for (const k of ACCENT_KEYS) {
    for (const alpha of ALPHA_SUFFIXES) {
      const composite = compositeAlpha(T[k], T.bg, alpha);
      check(`ink over ${k}+${alpha} overlay (text)`, contrast(T.ink, composite), 4.5);
    }
  }

  if (T.starColor) {
    check("starColor/bg (non-text icon)", contrast(T.starColor, T.bg), 3);
    check("starColor/card (non-text icon)", contrast(T.starColor, T.card), 3);
  }
  if (T.gradientFrom) {
    check("white/gradientFrom (text on decorative surface)", contrast("#FFFFFF", T.gradientFrom), 4.5);
  }
  if (T.gradientTo) {
    check("white/gradientTo (text on decorative surface)", contrast("#FFFFFF", T.gradientTo), 4.5);
  }
}

console.log(failures === 0 ? "\n✓ all themes pass WCAG AA." : `\n✗ ${failures} contrast check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
