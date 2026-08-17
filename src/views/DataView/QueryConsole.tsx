import { useState } from "react";
import { Terminal, Zap } from "lucide-react";
import { Btn, Card, Pill, Tag } from "../../components/primitives";
import type { Theme } from "../../theme/themes";
import type { Word } from "../../data/types";

const EXAMPLES = ["w.level === 3", "w.tags.includes('ארמית')", "w.syn.length > 2", "w.srs.reps === 0", "w.word.length > 8"];

export function QueryConsole({ words, T }: { words: Word[]; T: Theme }) {
  const [expr, setExpr] = useState("w.level === 3 && w.tags.includes('ארמית')");
  const [res, setRes] = useState<{ ok: true; n: number; sample: Word[] } | { ok: false; msg: string } | null>(null);

  /* קונסולת שאילתות — הביטוי מורץ בדפדפן שלכם בלבד, על הנתונים שלכם */
  const runQuery = () => {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("w", `"use strict"; return (${expr});`) as (w: Word) => unknown;
      const hit = words.filter((w) => {
        try {
          return !!fn(w);
        } catch {
          return false;
        }
      });
      setRes({ ok: true, n: hit.length, sample: hit.slice(0, 40) });
    } catch (e) {
      setRes({ ok: false, msg: e instanceof Error ? e.message : String(e) });
    }
  };

  return (
    <Card T={T} className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Terminal size={14} style={{ color: T.soft }} aria-hidden="true" />
        <span className="text-xs" style={{ color: T.soft }}>
          ביטוי JavaScript · המשתנה <code style={{ fontFamily: "var(--mono)" }}>w</code> הוא הרשומה. הביטוי רץ אך ורק בדפדפן שלכם, על
          הנתונים המקומיים — הוא לא נשלח לשום שרת.
        </span>
      </div>
      <label className="sr-only" htmlFor="query-expr">
        ביטוי שאילתה
      </label>
      <textarea
        id="query-expr"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        rows={3}
        className="w-full rounded-2xl p-3 text-sm outline-none"
        dir="ltr"
        style={{ background: T.bg, border: `1px solid ${T.line}`, color: T.ink, fontFamily: "var(--mono)" }}
      />
      <div className="flex gap-2 mt-2 flex-wrap">
        <Btn T={T} tone="solid" onClick={runQuery}>
          <Zap size={14} className="inline ml-1" aria-hidden="true" />
          הרץ
        </Btn>
        {EXAMPLES.map((e) => (
          <Pill key={e} T={T} onClick={() => setExpr(e)}>
            {e}
          </Pill>
        ))}
      </div>
      {res && (
        <div className="mt-3 rounded-2xl p-3" style={{ background: T.bg, border: `1px solid ${res.ok ? T.line : T.c}` }} role="status">
          {res.ok ? (
            <>
              <div className="text-xs mb-2" style={{ color: T.soft, fontFamily: "var(--mono)" }}>
                → {res.n} תוצאות
              </div>
              <div className="flex flex-wrap gap-1.5">
                {res.sample.map((w) => (
                  <Tag key={w.id} T={T} c={T.a}>
                    {w.word}
                  </Tag>
                ))}
              </div>
            </>
          ) : (
            <div className="text-xs" style={{ color: T.ink, fontFamily: "var(--mono)" }} dir="ltr">
              {res.msg}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
