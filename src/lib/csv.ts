import type { Word } from "../data/types";
import { FIELDS } from "../data/types";

export const toCSV = (rows: Word[]): string => {
  const head = FIELDS.join(",");
  const esc = (v: unknown) => `"${String(Array.isArray(v) ? v.join("|") : v).replace(/"/g, '""')}"`;
  return [head, ...rows.map((r) => FIELDS.map((f) => esc(r[f])).join(","))].join("\n");
};

export const parseCSV = (text: string): Word[] => {
  const lines = text.trim().split(/\r?\n/);
  const head = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((ln) => {
    const cells: string[] = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < ln.length; i++) {
      const ch = ln[i];
      if (ch === '"') {
        if (q && ln[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = !q;
      } else if (ch === "," && !q) {
        cells.push(cur);
        cur = "";
      } else cur += ch;
    }
    cells.push(cur);
    const o: Record<string, unknown> = {};
    head.forEach((h, i) => {
      const v = cells[i] ?? "";
      o[h] = ["syn", "ant", "tags"].includes(h) ? v.split("|").filter(Boolean) : h === "level" ? Number(v) || 1 : v;
    });
    o.id = String((o.word as string) || "?").replace(/\s/g, "_");
    o.srs = { ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0 };
    o.stats = { seen: 0, correct: 0, wrong: 0 };
    return o as unknown as Word;
  });
};
