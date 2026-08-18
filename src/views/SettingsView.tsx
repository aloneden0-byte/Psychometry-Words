import type { ReactNode } from "react";
import { ChevronLeft, Clock, Code2, Database, Layers, Wand2 } from "lucide-react";
import { Btn, Card, Field, Num, Pill, Toggle } from "../components/primitives";
import { MODE_META, type Settings } from "../constants";
import type { Theme } from "../theme/themes";
import type { Word } from "../data/types";

interface SettingsViewProps {
  s: Settings;
  set: (patch: Partial<Settings>) => void;
  T: Theme;
  words: Word[];
  allTags: string[];
  reset: () => void;
  onOpenData: () => void;
}

export function SettingsView({ s, set, T, words, allTags, reset, onOpenData }: SettingsViewProps) {
  const S = ({ title, children, icon }: { title: string; children: ReactNode; icon: ReactNode }) => (
    <Card T={T} className="p-4 mb-3">
      <h2 className="flex items-center gap-2 mb-1" style={{ color: T.soft }}>
        {icon}
        <span className="text-xs" style={{ fontWeight: 700, letterSpacing: ".04em" }}>
          {title}
        </span>
      </h2>
      <div style={{ borderTop: `1px solid ${T.line}` }}>{children}</div>
    </Card>
  );

  return (
    <div>
      <button
        onClick={onOpenData}
        className="w-full flex items-center justify-between rounded-3xl p-4 mb-3 transition-all active:scale-98"
        style={{ background: T.card, border: `1px solid ${T.line}` }}
      >
        <span className="flex items-center gap-2" style={{ color: T.ink, fontWeight: 700 }}>
          <Database size={16} aria-hidden="true" />
          ניהול מילים ונתונים
        </span>
        <ChevronLeft size={16} color={T.soft} aria-hidden="true" />
      </button>

      <S title="מראה" icon={<Wand2 size={13} aria-hidden="true" />}>
        <Field T={T} label="גודל טקסט" hint={`${Math.round(s.scale * 100)}%`}>
          <label className="sr-only" htmlFor="scale-range">
            גודל טקסט
          </label>
          <input
            id="scale-range"
            type="range"
            min={0.8}
            max={1.5}
            step={0.05}
            value={s.scale}
            onChange={(e) => set({ scale: Number(e.target.value) })}
            style={{ width: 120, accentColor: T.a }}
          />
        </Field>
        <Field T={T} label="ניקוד" hint="מתי להציג את הצורה המנוקדת">
          <div className="flex gap-1">
            {(
              [
                ["always", "תמיד"],
                ["reveal", "בגילוי"],
                ["never", "לעולם"],
              ] as const
            ).map(([k, l]) => (
              <Pill key={k} T={T} active={s.nikudMode === k} onClick={() => set({ nikudMode: k })}>
                {l}
              </Pill>
            ))}
          </div>
        </Field>
        <Field T={T} label="גופן קריא יותר" hint="ריווח אותיות מוגדל, מיטבי לקוראים עם דיסלקציה">
          <div className="flex gap-1">
            {(
              [
                ["default", "רגיל"],
                ["legible", "קריא"],
              ] as const
            ).map(([k, l]) => (
              <Pill key={k} T={T} active={s.fontStack === k} onClick={() => set({ fontStack: k })}>
                {l}
              </Pill>
            ))}
          </div>
        </Field>
        <Field T={T} label="הילת מיקוד" hint="זוהר פסטל נושם סביב הכרטיס">
          <Toggle on={s.glow} set={(v) => set({ glow: v })} T={T} label="הילת מיקוד" />
        </Field>
        <Field T={T} label="אנימציות" hint="כיבוי מאיץ מכשירים חלשים">
          <Toggle on={s.motion} set={(v) => set({ motion: v })} T={T} label="אנימציות" />
        </Field>
      </S>

      <S title="תוכן הלמידה" icon={<Layers size={13} aria-hidden="true" />}>
        <Field T={T} label="רמות קושי" hint="1 בינוני-גבוה · 2 מתקדם · 3 ספרותי-ארמי">
          <div className="flex gap-1">
            {[1, 2, 3].map((l) => (
              <Pill key={l} T={T} active={s.levels.includes(l)} onClick={() => set({ levels: s.levels.includes(l) ? s.levels.filter((x) => x !== l) : [...s.levels, l] })}>
                {l}
              </Pill>
            ))}
          </div>
        </Field>
        <div className="py-3">
          <div className="text-sm mb-2" style={{ color: T.ink, fontWeight: 600 }}>
            תגיות
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Pill T={T} active={!s.tags.length} onClick={() => set({ tags: [] })}>
              הכול
            </Pill>
            {allTags.map((t) => (
              <Pill key={t} T={T} active={s.tags.includes(t)} onClick={() => set({ tags: s.tags.includes(t) ? s.tags.filter((x) => x !== t) : [...s.tags, t] })}>
                {t}
              </Pill>
            ))}
          </div>
        </div>
        <div className="py-3">
          <div className="text-sm mb-2" style={{ color: T.ink, fontWeight: 600 }}>
            מצבי תרגול פעילים
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(MODE_META).map(([k, m]) => (
              <Pill key={k} T={T} active={s.modes.includes(k)} onClick={() => set({ modes: s.modes.includes(k) ? s.modes.filter((x) => x !== k) : [...s.modes, k] })}>
                {m.label}
              </Pill>
            ))}
          </div>
        </div>
        <Field T={T} label="שאלות במקבץ">
          <Num v={s.sessionSize} set={(v) => set({ sessionSize: v })} T={T} min={3} max={200} aria-label="שאלות במקבץ" />
        </Field>
      </S>

      <S title="מנוע החזרה המרווחת" icon={<Clock size={13} aria-hidden="true" />}>
        <Field T={T} label="אלגוריתם" hint="SM-2 מתאים לרוב הלומדים">
          <div className="flex gap-1">
            {(
              [
                ["sm2", "SM-2"],
                ["leitner", "לייטנר"],
                ["none", "ללא"],
              ] as const
            ).map(([k, l]) => (
              <Pill key={k} T={T} active={s.engine === k} onClick={() => set({ engine: k })}>
                {l}
              </Pill>
            ))}
          </div>
        </Field>
        <Field T={T} label="סף מעבר" hint="ציון מינימלי שנחשב זכירה מוצלחת">
          <Num v={s.passThreshold} set={(v) => set({ passThreshold: v })} T={T} min={1} max={5} aria-label="סף מעבר" />
        </Field>
        <Field T={T} label="מרווח ראשון" hint="ימים לאחר תשובה נכונה ראשונה">
          <Num v={s.firstInterval} set={(v) => set({ firstInterval: v })} T={T} aria-label="מרווח ראשון" />
        </Field>
        <Field T={T} label="מרווח שני">
          <Num v={s.secondInterval} set={(v) => set({ secondInterval: v })} T={T} aria-label="מרווח שני" />
        </Field>
        <Field T={T} label="מקדם מרווח" hint="מכפיל גלובלי — נמוך = חזרות תכופות">
          <Num v={s.intervalModifier} set={(v) => set({ intervalModifier: v })} T={T} step={0.05} aria-label="מקדם מרווח" />
        </Field>
        <Field T={T} label="בונוס 'קל'">
          <Num v={s.easyBonus} set={(v) => set({ easyBonus: v })} T={T} step={0.1} aria-label="בונוס קל" />
        </Field>
        <Field T={T} label="קנס שכחה" hint="כמה מורידים מן ה-ease">
          <Num v={s.lapsePenalty} set={(v) => set({ lapsePenalty: v })} T={T} step={0.05} aria-label="קנס שכחה" />
        </Field>
        <Field T={T} label="ease מינימלי">
          <Num v={s.minEase} set={(v) => set({ minEase: v })} T={T} step={0.1} aria-label="ease מינימלי" />
        </Field>
        <Field T={T} label="ease מרבי">
          <Num v={s.maxEase} set={(v) => set({ maxEase: v })} T={T} step={0.1} aria-label="ease מרבי" />
        </Field>
        <Field T={T} label="מרווח מרבי" hint="בימים">
          <Num v={s.maxInterval} set={(v) => set({ maxInterval: v })} T={T} max={9999} aria-label="מרווח מרבי" />
        </Field>
      </S>

      <S title="מצב מפתח" icon={<Code2 size={13} aria-hidden="true" />}>
        <Field T={T} label="הפעל מצב מפתח" hint="חושף כלים שעוקפים את מגבלות הממשק, כולל קונסולת השאילתות בלשונית הנתונים">
          <Toggle on={s.devMode} set={(v) => set({ devMode: v })} T={T} label="הפעל מצב מפתח" />
        </Field>
        {s.devMode && (
          <>
            <Field T={T} label="בטל מגבלת מקבץ" hint="תרגול אינסופי ללא עצירה">
              <Toggle on={s.unlockCaps} set={(v) => set({ unlockCaps: v })} T={T} label="בטל מגבלת מקבץ" />
            </Field>
            <Field T={T} label="חלון מצב חי" hint="מציג את ה-state בזמן אמת">
              <Toggle on={s.showState} set={(v) => set({ showState: v })} T={T} label="חלון מצב חי" />
            </Field>
            <Field T={T} label="הסטת זמן" hint="מדמה ימים קדימה לבדיקת התזמון">
              <Num v={s.dayOffset} set={(v) => set({ dayOffset: v })} T={T} min={-999} max={999} aria-label="הסטת זמן" />
            </Field>
            <Field T={T} label="זרע אקראיות" hint="0 = אקראי לחלוטין">
              <Num v={s.seed} set={(v) => set({ seed: v })} T={T} max={99999} aria-label="זרע אקראיות" />
            </Field>
          </>
        )}
      </S>

      <Btn
        T={T}
        tone="bad"
        style={{ width: "100%", padding: 12 }}
        onClick={() => {
          if (confirm("לאפס הגדרות והתקדמות? מסד הנתונים יחזור למקור.")) reset();
        }}
      >
        אפס הכול
      </Btn>
      <div className="text-xs text-center mt-4 leading-relaxed px-4" style={{ color: T.soft }}>
        {words.length} רשומות · הגדרות והתקדמות נשמרות אוטומטית במכשיר
      </div>
    </div>
  );
}
