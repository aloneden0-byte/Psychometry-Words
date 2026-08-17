import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Terminal } from "lucide-react";
import { Btn, Card } from "./components/primitives";
import { SkipLink } from "./components/SkipLink";
import { TabNav } from "./components/TabNav";
import { DashboardView } from "./views/DashboardView";
import { LearnView } from "./views/LearnView";
import { PracticeView } from "./views/PracticeView";
import { RewardsView } from "./views/RewardsView";
import { DataView } from "./views/DataView/DataView";
import { SettingsView } from "./views/SettingsView";
import { usePersistedState } from "./hooks/usePersistedState";
import { WORDS } from "./data/words";
import { THEMES, themeVars } from "./theme/themes";
import { ENGINES } from "./lib/srs/engines";
import { INITIAL_STREAK, updateStreak, type Streak } from "./lib/gamification";
import { DEFAULTS, TABS, type TabKey, type Settings } from "./constants";
import type { Word } from "./data/types";

interface Store {
  settings: Settings;
  words: Word[];
  streak: Streak;
}

const INITIAL: Store = { settings: DEFAULTS, words: WORDS, streak: INITIAL_STREAK };

export default function App() {
  const [store, setStore, persist] = usePersistedState<Store>(INITIAL);
  const [tab, setTab] = useState<TabKey>("home");
  const [dataOpen, setDataOpen] = useState(false);
  const [quickPractice, setQuickPractice] = useState(false);
  const s: Settings = { ...DEFAULTS, ...store.settings };
  const words = store.words?.length ? store.words : WORDS;
  const T = THEMES[s.theme] || THEMES.brainy;

  useEffect(() => persist(store), [store, persist]);

  const set = (patch: Partial<Settings>) => setStore((st) => ({ ...st, settings: { ...st.settings, ...patch } }));
  const setWords = (w: Word[]) => setStore((st) => ({ ...st, words: w }));
  const reset = () => setStore(INITIAL);

  const allTags = useMemo(() => [...new Set(words.flatMap((w) => w.tags))].sort(), [words]);

  /* Derived state — נגזר מ-words + הגדרות הסינון, לא נשמר בנפרד */
  const deck = useMemo(
    () => words.filter((w) => s.levels.includes(w.level) && (!s.tags.length || w.tags.some((t) => s.tags.includes(t)))),
    [words, s.levels, s.tags],
  );

  const grade = useCallback(
    (id: string, q: number) => {
      const engine = ENGINES[s.engine] || ENGINES.sm2;
      const p = {
        now: Math.floor(Date.now() / 864e5) + s.dayOffset,
        passThreshold: s.passThreshold,
        firstInterval: s.firstInterval,
        secondInterval: s.secondInterval,
        intervalModifier: s.intervalModifier,
        easyBonus: s.easyBonus,
        lapsePenalty: s.lapsePenalty,
        lapseInterval: s.lapseInterval,
        minEase: s.minEase,
        maxEase: s.maxEase,
        maxInterval: s.maxInterval,
      };
      setStore((st) => ({
        ...st,
        words: st.words.map((w) =>
          w.id !== id
            ? w
            : {
                ...w,
                srs: engine(w, q, p),
                stats: {
                  seen: w.stats.seen + 1,
                  correct: w.stats.correct + (q >= p.passThreshold ? 1 : 0),
                  wrong: w.stats.wrong + (q >= p.passThreshold ? 0 : 1),
                },
              },
        ),
        streak: updateStreak(st.streak ?? INITIAL_STREAK, p.now),
      }));
    },
    [
      s.engine,
      s.passThreshold,
      s.dayOffset,
      s.firstInterval,
      s.secondInterval,
      s.intervalModifier,
      s.easyBonus,
      s.lapsePenalty,
      s.lapseInterval,
      s.minEase,
      s.maxEase,
      s.maxInterval,
      setStore,
    ],
  );

  const mastered = words.filter((w) => w.srs.reps >= 3).length;

  const goHome = () => {
    setQuickPractice(false);
    setTab("home");
  };
  const startQuickPractice = () => {
    setQuickPractice(true);
    setTab("practice");
  };

  const vars = {
    ...themeVars(T, s.scale),
    "--display": s.fontStack === "legible" ? "'Assistant', 'Heebo', system-ui, sans-serif" : "'Frank Ruhl Libre', 'David Libre', Georgia, serif",
    "--body": s.fontStack === "legible" ? "'Assistant', 'Heebo', system-ui, sans-serif" : "'Assistant', 'Heebo', system-ui, sans-serif",
    "--mono": "'IBM Plex Mono', ui-monospace, monospace",
    letterSpacing: s.fontStack === "legible" ? "0.01em" : undefined,
  } as React.CSSProperties;

  return (
    <div
      dir="rtl"
      className={`min-h-screen w-full ${s.motion ? "motion" : "no-motion"}`}
      style={{ background: T.bg, color: T.ink, fontFamily: "var(--body)", ...vars }}
    >
      <SkipLink T={T} />
      <header
        className="px-4 pt-5 pb-3 sticky top-0 z-20"
        style={{ background: T.bg + "F2", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.line}` }}
      >
        <div className="flex items-baseline justify-between">
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: "1.6rem", letterSpacing: "-.02em" }}>מִלִּים</h1>
          <div className="text-xs" style={{ color: T.soft, fontFamily: "var(--mono)" }}>
            {mastered}/{words.length} מוטמעות
          </div>
        </div>
      </header>

      <main id="main" className="px-4 py-5 pb-28 mx-auto" style={{ maxWidth: 620 }} tabIndex={-1}>
        {dataOpen ? (
          <div>
            <Btn T={T} onClick={() => setDataOpen(false)} style={{ marginBottom: 12 }}>
              <ChevronRight size={16} className="inline ml-1" aria-hidden="true" />
              חזרה להגדרות
            </Btn>
            <DataView words={words} setWords={setWords} T={T} s={s} />
          </div>
        ) : (
          TABS.map(
            ({ k }) =>
              tab === k && (
                <div key={k} role="tabpanel" id={`panel-${k}`} aria-labelledby={`tab-${k}`}>
                  {k === "home" && (
                    <DashboardView T={T} words={words} streak={store.streak ?? INITIAL_STREAK} onNavigate={setTab} onQuickPractice={startQuickPractice} />
                  )}
                  {k === "learn" && <LearnView deck={deck} T={T} s={s} grade={grade} glow={s.glow} onDone={goHome} />}
                  {k === "practice" && (
                    <PracticeView deck={deck} T={T} s={s} grade={grade} glow={s.glow} sessionSizeOverride={quickPractice ? 5 : undefined} onDone={goHome} />
                  )}
                  {k === "rewards" && <RewardsView T={T} words={words} streak={store.streak ?? INITIAL_STREAK} />}
                  {k === "settings" && (
                    <SettingsView s={s} set={set} T={T} words={words} allTags={allTags} reset={reset} onOpenData={() => setDataOpen(true)} />
                  )}
                </div>
              ),
          )
        )}

        {s.devMode && s.showState && (
          <Card T={T} className="p-3 mt-4">
            <div className="flex items-center gap-1.5 mb-2 text-xs" style={{ color: T.soft }}>
              <Terminal size={12} aria-hidden="true" />
              מצב חי
            </div>
            <pre dir="ltr" className="text-xs overflow-x-auto" style={{ fontFamily: "var(--mono)", color: T.soft }}>
              {JSON.stringify(
                {
                  tab,
                  deck: deck.length,
                  day: Math.floor(Date.now() / 864e5) + s.dayOffset,
                  engine: s.engine,
                  modes: s.modes,
                  levels: s.levels,
                  seed: s.seed,
                },
                null,
                1,
              )}
            </pre>
          </Card>
        )}
      </main>

      {!dataOpen && <TabNav tab={tab} setTab={setTab} T={T} />}
    </div>
  );
}
