import { useMemo, useState } from "react";
import { Download, Plus, Search, Trash2, Upload } from "lucide-react";
import { Btn, Card, Pill } from "../../components/primitives";
import { RowEditor } from "./RowEditor";
import { QueryConsole } from "./QueryConsole";
import { IntegrityCheck } from "./IntegrityCheck";
import { toCSV, parseCSV } from "../../lib/csv";
import { checkIntegrity } from "../../lib/integrity";
import { SCHEMA } from "../../data/types";
import type { Theme } from "../../theme/themes";
import type { Word } from "../../data/types";
import type { Settings } from "../../constants";

interface DataViewProps {
  words: Word[];
  setWords: (w: Word[]) => void;
  T: Theme;
  s: Settings;
}

type Tab = "rows" | "schema" | "query" | "bulk" | "io" | "check";

const blank = (): Word => ({
  id: "new_" + Date.now(),
  word: "",
  nikud: "",
  root: "",
  pos: "שם עצם",
  level: 2,
  def: "",
  syn: [],
  ant: [],
  example: "",
  tags: [],
  srs: { ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0 },
  stats: { seen: 0, correct: 0, wrong: 0 },
});

export function DataView({ words, setWords, T, s }: DataViewProps) {
  const [tab, setTab] = useState<Tab>("rows");
  const [qy, setQy] = useState("");
  const [edit, setEdit] = useState<Word | null>(null);
  const [io, setIo] = useState("");

  const filtered = useMemo(() => {
    const t = qy.trim();
    if (!t) return words;
    return words.filter((w) => [w.word, w.def, w.root, ...w.syn, ...w.tags].join(" ").includes(t));
  }, [words, qy]);

  const issueCount = useMemo(() => checkIntegrity(words).length, [words]);

  const tabs: [Tab, string][] = [
    ["rows", "טבלה"],
    ["schema", "סכמה"],
    ["query", "שאילתות"],
    ["bulk", "פעולות גורפות"],
    ["io", "ייבוא / ייצוא"],
    ["check", `בדיקת תקינות (${issueCount})`],
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1.5 flex-wrap" role="group" aria-label="לשוניות נתונים">
        {tabs.map(([k, l]) => (
          <Pill key={k} T={T} active={tab === k} onClick={() => setTab(k)}>
            {l}
          </Pill>
        ))}
      </div>

      {tab === "rows" && (
        <>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-2xl px-3 py-2" style={{ border: `1px solid ${T.line}` }}>
              <Search size={15} style={{ color: T.soft }} aria-hidden="true" />
              <label className="sr-only" htmlFor="data-search">
                חיפוש חופשי בכל השדות
              </label>
              <input
                id="data-search"
                value={qy}
                onChange={(e) => setQy(e.target.value)}
                placeholder="חיפוש חופשי בכל השדות…"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: T.ink }}
              />
            </div>
            <Btn T={T} tone="solid" onClick={() => setEdit(blank())} aria-label="הוספת רשומה חדשה">
              <Plus size={16} aria-hidden="true" />
            </Btn>
          </div>
          <div className="text-xs" style={{ color: T.soft, fontFamily: "var(--mono)" }}>
            {filtered.length} / {words.length} רשומות
          </div>
          <div className="flex flex-col gap-1.5">
            {filtered.slice(0, 120).map((w) => (
              <button
                key={w.id}
                onClick={() => setEdit({ ...w })}
                className="rounded-2xl px-3.5 py-2.5 text-right transition-all active:scale-98"
                style={{ background: T.card, border: `1px solid ${T.line}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div style={{ fontFamily: "var(--display)", fontWeight: 700, color: T.ink, fontSize: "1.05rem" }}>{w.word}</div>
                    <div className="text-xs truncate mt-0.5" style={{ color: T.soft }}>
                      {w.def}
                    </div>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs shrink-0"
                    style={{ background: [T.b, T.d, T.c][w.level - 1], color: T.onAccent, fontWeight: 700 }}
                  >
                    {w.level}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {tab === "schema" && (
        <Card T={T} className="p-4">
          <div className="text-xs mb-3" style={{ color: T.soft }}>
            מבנה הרשומה. כל שדה ניתן לעריכה ולייצוא.
          </div>
          {SCHEMA.map((r) => (
            <div key={r.f} className="py-2 flex gap-3 items-start" style={{ borderTop: `1px solid ${T.line}` }}>
              <code className="text-xs shrink-0" style={{ fontFamily: "var(--mono)", color: T.ink, width: 72 }}>
                {r.f}
              </code>
              <code className="text-xs shrink-0" style={{ fontFamily: "var(--mono)", color: T.soft, width: 62 }}>
                {r.t}
              </code>
              <span className="text-xs" style={{ color: T.soft }}>
                {r.d}
              </span>
            </div>
          ))}
        </Card>
      )}

      {tab === "query" && (s.devMode ? <QueryConsole words={words} T={T} /> : <DevModeGate T={T} />)}

      {tab === "bulk" && (
        <Card T={T} className="p-4 flex flex-col gap-2">
          <div className="text-xs mb-1" style={{ color: T.soft }}>
            פעולות על כל הרשומות המסוננות ({filtered.length})
          </div>
          <Btn
            T={T}
            onClick={() =>
              setWords(
                words.map((w) => (filtered.includes(w) ? { ...w, srs: { ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0 } } : w)),
              )
            }
          >
            אפס לוח זמנים
          </Btn>
          <Btn T={T} onClick={() => setWords(words.map((w) => (filtered.includes(w) ? { ...w, stats: { seen: 0, correct: 0, wrong: 0 } } : w)))}>
            אפס סטטיסטיקה
          </Btn>
          <Btn T={T} onClick={() => setWords(words.map((w) => (filtered.includes(w) ? { ...w, srs: { ...w.srs, due: 0 } } : w)))}>
            סמן הכול כמיועד לחזרה
          </Btn>
          <Btn
            T={T}
            tone="bad"
            onClick={() => {
              if (confirm(`למחוק ${filtered.length} רשומות?`)) setWords(words.filter((w) => !filtered.includes(w)));
            }}
          >
            <Trash2 size={14} className="inline ml-1.5" aria-hidden="true" />
            מחק את המסוננות
          </Btn>
        </Card>
      )}

      {tab === "io" && (
        <Card T={T} className="p-4 flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            <Btn T={T} onClick={() => setIo(JSON.stringify(words, null, 2))}>
              <Download size={14} className="inline ml-1.5" aria-hidden="true" />
              ייצוא JSON
            </Btn>
            <Btn T={T} onClick={() => setIo(toCSV(words))}>
              <Download size={14} className="inline ml-1.5" aria-hidden="true" />
              ייצוא CSV
            </Btn>
            <Btn
              T={T}
              tone="good"
              onClick={() => {
                try {
                  const t = io.trim();
                  const rows = t.startsWith("[") ? JSON.parse(t) : parseCSV(t);
                  if (!Array.isArray(rows) || !rows.length) throw new Error("לא נמצאו רשומות");
                  setWords(rows.map((r) => ({ ...blank(), ...r, id: (r.word || "?").replace(/\s/g, "_") })));
                } catch (e) {
                  alert("הייבוא נכשל: " + (e instanceof Error ? e.message : String(e)));
                }
              }}
            >
              <Upload size={14} className="inline ml-1.5" aria-hidden="true" />
              ייבוא מהתיבה
            </Btn>
          </div>
          <label className="sr-only" htmlFor="io-box">
            תיבת ייבוא וייצוא
          </label>
          <textarea
            id="io-box"
            value={io}
            onChange={(e) => setIo(e.target.value)}
            rows={12}
            dir="ltr"
            placeholder="הדביקו כאן JSON או CSV לייבוא, או לחצו ייצוא כדי למלא."
            className="w-full rounded-2xl p-3 text-xs outline-none"
            style={{ background: T.bg, border: `1px solid ${T.line}`, color: T.ink, fontFamily: "var(--mono)" }}
          />
          <div className="text-xs leading-relaxed" style={{ color: T.soft }}>
            כותרות ה־CSV: <code style={{ fontFamily: "var(--mono)" }}>word,nikud,root,pos,level,def,syn,ant,example,tags</code> · מערכים
            מופרדים בתו <code>|</code>
          </div>
        </Card>
      )}

      {tab === "check" && <IntegrityCheck words={words} T={T} />}

      {edit && (
        <RowEditor
          row={edit}
          T={T}
          onClose={() => setEdit(null)}
          onSave={(r) => {
            setWords(words.some((w) => w.id === r.id) ? words.map((w) => (w.id === r.id ? r : w)) : [...words, r]);
            setEdit(null);
          }}
          onDelete={() => {
            setWords(words.filter((w) => w.id !== edit.id));
            setEdit(null);
          }}
        />
      )}
    </div>
  );
}

function DevModeGate({ T }: { T: Theme }) {
  return (
    <Card T={T} className="p-4 text-sm leading-relaxed" style={{ color: T.soft }}>
      קונסולת השאילתות היא כלי למפתחים המריץ קוד JavaScript מותאם אישית. הפעילו את "מצב מפתח" בלשונית ההגדרות כדי לחשוף אותה.
    </Card>
  );
}
