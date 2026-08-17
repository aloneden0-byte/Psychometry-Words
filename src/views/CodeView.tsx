import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Card } from "../components/primitives";
import type { Theme } from "../theme/themes";

interface Lesson {
  t: string;
  w: string;
  why: string;
  code: string;
}

const LESSONS: Lesson[] = [
  {
    t: "1 · מבנה הנתונים הדחוס",
    w: "למה לא לכתוב אובייקטים מלאים?",
    why: "מאות אובייקטים מלאים = הרבה חזרה על שמות מפתחות. מערך של מערכים חוסך כשליש מגודל הקובץ, ופונקציית expand בונה את האובייקט המלא בזמן טעינה. העיקרון: אחסן דחוס, עבוד מורחב.",
    code: `export const FIELDS = ["word","nikud","root","pos",
  "level","def","syn","ant","example","tags"] as const;

export function expand(row: WordRow): Word {
  const o = {} as Record<typeof FIELDS[number], unknown>;
  FIELDS.forEach((f, i) => (o[f] = row[i]));
  return {
    ...(o as Omit<Word, "id"|"srs"|"stats">),
    id: String(o.word).replace(/\\s/g, "_"),
    srs:   { ease:2.5, interval:0, due:0, reps:0, lapses:0 },
    stats: { seen:0, correct:0, wrong:0 },
  };
}`,
  },
  {
    t: "2 · הסרת ניקוד",
    w: "איך משווים מילה שהוקלדה למילה במסד?",
    why: "בעברית סימני הניקוד הם תווים משולבים בטווח Unicode ‎U+0591–U+05C7. אם לא מסירים אותם, 'רָהוּט' ו'רהוט' יהיו שתי מחרוזות שונות. strip מנרמל את שתי הצורות לאותה מחרוזת לפני ההשוואה — ולכן שאלת ההקלדה בתרגול לא דורשת ניקוד.",
    code: `const NIKUD_RE = /[\\u0591-\\u05C7]/g;

export const strip = (s?: string | null) => (s || "")
  .replace(NIKUD_RE, "")   // ניקוד וטעמים
  .replace(/["'׳״]/g, "")  // גרש וגרשיים
  .replace(/\\s+/g, " ")    // רווחים כפולים
  .trim();

strip("רָהוּט") === strip("רהוט")  // true`,
  },
  {
    t: "3 · מנוע SM-2",
    w: "הלב של הלמידה — למה חוזרים על מילה בדיוק אז?",
    why: "לכל כרטיס יש ease (כמה קל הוא לכם) ו-interval (בעוד כמה ימים לחזור). תשובה נכונה מכפילה את המרווח ב-ease; שכחה מאפסת אותו ומורידה את ה-ease. כך מילים קשות חוזרות תכופות ומילים קלות מתרחקות — וזה מה שמחדד את הזיכרון לטווח ארוך. זהו האלגוריתם שמניע את לשונית ה'לימוד'.",
    code: `export const sm2: SrsEngine = (card, q, p) => {   // q = 0..5
  const s = { ...card.srs };
  if (q < p.passThreshold) {          // שכחה
    s.lapses += 1;
    s.reps = 0;
    s.interval = p.lapseInterval;
    s.ease = Math.max(p.minEase, s.ease - p.lapsePenalty);
  } else {                            // זכירה
    s.reps += 1;
    if      (s.reps === 1) s.interval = p.firstInterval;
    else if (s.reps === 2) s.interval = p.secondInterval;
    else s.interval = Math.round(s.interval * s.ease * p.intervalModifier);
    s.ease += 0.1 - (5-q) * (0.08 + (5-q) * 0.02);
    s.ease = Math.min(p.maxEase, Math.max(p.minEase, s.ease));
  }
  s.due = p.now + s.interval;
  return s;
};`,
  },
  {
    t: "4 · יצירת מסיחים",
    w: "למה מסיח אקראי הוא מסיח גרוע?",
    why: "אם המסיחים רחוקים מדי, אפשר לנחש בלי לדעת את המילה. הפונקציה מעדיפה מילים מאותה רמת קושי, ובשאלת נרדפות היא לוקחת דווקא את ההפכים של מילים אחרות — מסיח שנראה נכון עד שקוראים אותו. זה מה שהופך שאלה לתרגול ולא לניחוש.",
    code: `const others = shuffle(pool.filter(x => x.id !== w.id), rnd);

// עדיפות למילים באותה רמת קושי
const near = shuffle([
  ...others.filter(x => x.level === w.level),
  ...others
], rnd).slice(0, 3);

// בשאלת נרדפות — מסיחים מתוך ההפכים של אחרים
const bad = near.flatMap(x => useSyn ? x.ant : x.syn);`,
  },
  {
    t: "5 · אקראיות דטרמיניסטית",
    w: "איך מייצרים סשן שאפשר לשחזר בדיוק?",
    why: "Math.random אינו ניתן לשחזור — אי אפשר לחזור על אותו רצף שאלות. mulberry32 הוא מחולל זעיר שמקבל seed ומחזיר תמיד את אותה סדרה. useMemo מחשב את השאלה מחדש רק כשמשתנה n, ולכן רינדור מחדש לא מערבב את התשובות באמצע.",
    code: `export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const q = useMemo(() => {
  const rnd = rng(seedRef.current + n * 7919);
  ...
}, [n, deck, s.modes]);   // תלויות מדויקות = אין ערבוב מיותר`,
  },
  {
    t: "6 · Derived state",
    w: "החוק החשוב ביותר ב-React: אל תשמרו מה שאפשר לחשב",
    why: "החפיסה אינה state נפרד. היא נגזרת מ-words + הגדרות הסינון. אילו שמרנו אותה בנפרד, כל שינוי הגדרה היה מצריך סנכרון ידני — ומקור אמת כפול הוא מקור לבאגים. useMemo נותן את יתרון הביצועים בלי לשכפל את האמת.",
    code: `const deck = useMemo(() =>
  words.filter(w =>
    s.levels.includes(w.level) &&
    (!s.tags.length || w.tags.some(t => s.tags.includes(t)))
  ),
  [words, s.levels, s.tags]   // מחושב מחדש רק כשצריך
);`,
  },
  {
    t: "7 · אחסון מתמיד",
    w: "איך ההתקדמות שורדת סגירה של האפליקציה?",
    why: "localStorage הוא API סינכרוני של מפתח-ערך בדפדפן. שתי החלטות תכנוניות נשמרו מהגרסה המקורית: (א) כל המצב נשמר במפתח אחד כדי לא לירות עשרות בקשות; (ב) כל קריאה עטופה ב-try/catch — כשל אחסון (למשל דפדפן בגלישה פרטית שחוסם את ה-storage) לא אמור להפיל אפליקציה, רק לוותר על שמירה לאותו סשן.",
    code: `const KEY = "millim-state-v1";

export function loadState<T extends object>(fallback: T): T {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch { return fallback; }        // אחסון חסום/מכסה מלאה
}

export function saveState(next: unknown) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); }
  catch { /* לא חוסם */ }
}`,
  },
  {
    t: "8 · הקונסולה שפורצת מגבלות",
    w: "איך נותנים למשתמש להריץ קוד משלו?",
    why: "new Function מהדר מחרוזת לפונקציה — כך קונסולת השאילתות מריצה כל ביטוי JavaScript מעל הנתונים. שתי הגנות: הביטוי מקבל רק את w ואינו נוגע ב-scope של האפליקציה, וכל קריאה עטופה ב-try/catch כפול — אחד לשגיאת תחביר, אחד לשגיאת ריצה על רשומה בודדת. מכיוון שזו יכולת הרצת-קוד אמיתית, היא חשופה רק כשמצב המפתח פעיל בהגדרות.",
    code: `const runQuery = () => {
  try {
    const fn = new Function("w", \`"use strict"; return (\${expr});\`);
    const hit = words.filter(w => {
      try { return !!fn(w); } catch { return false; }  // רשומה בעייתית לא עוצרת הכול
    });
    setRes({ ok: true, n: hit.length, sample: hit.slice(0, 40) });
  } catch (e) {
    setRes({ ok: false, msg: e.message });             // שגיאת תחביר
  }
};`,
  },
  {
    t: "9 · נגישות: לא רק RTL",
    w: "למה טבעת מיקוד בצבע הערכה נכשלת במבחן הניגודיות?",
    why: "WCAG דורש יחס ניגודיות 3:1 לפחות עבור אלמנטים לא-טקסטואליים כמו טבעת מיקוד. צבע הערכה הפסטלי (a) נמדד ביחס של כ-1.5:1 בלבד מול הרקע — כמעט בלתי נראה לכבדי ראייה. הפתרון: טבעת כפולה — ink כצבע הניגודיות האמיתי (תמיד מעל 11:1), וזוהר עדין בצבע הערכה סביבו לשימור הזהות החזותית.",
    code: `:focus-visible {
  outline: 2px solid var(--focus-ring, #000);   /* = T.ink, ניגודיות גבוהה */
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--focus-ring-glow); /* = T.a, זוהר עדין בלבד */
}

export function themeVars(T: Theme, scale: number) {
  return {
    "--focus-ring": T.ink,
    "--focus-ring-glow": T.a + (T.dark ? "55" : "66"),
  };
}`,
  },
];

export function CodeView({ T }: { T: Theme }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <Card T={T} className="p-4 mb-1">
        <div className="text-sm leading-relaxed" style={{ color: T.ink }}>
          תשע ההחלטות שמרכיבות את האפליקציה הזו — הקוד האמיתי שרץ עכשיו, לא דוגמאות.
        </div>
      </Card>
      {LESSONS.map((l, i) => (
        <Card key={i} T={T} className="overflow-hidden">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-right p-4" aria-expanded={open === i}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div style={{ color: T.ink, fontWeight: 700, fontSize: ".95rem" }}>{l.t}</div>
                <div className="text-xs mt-0.5" style={{ color: T.soft }}>
                  {l.w}
                </div>
              </div>
              <ChevronLeft
                size={16}
                className="shrink-0 transition-transform"
                aria-hidden="true"
                style={{ color: T.soft, transform: open === i ? "rotate(-90deg)" : "none" }}
              />
            </div>
          </button>
          {open === i && (
            <div className="px-4 pb-4">
              <p className="text-sm leading-relaxed mb-3" style={{ color: T.ink }}>
                {l.why}
              </p>
              <pre
                dir="ltr"
                className="rounded-2xl p-3 overflow-x-auto text-xs leading-relaxed"
                style={{ background: T.bg, border: `1px solid ${T.line}`, color: T.ink, fontFamily: "var(--mono)" }}
              >
                {l.code}
              </pre>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
