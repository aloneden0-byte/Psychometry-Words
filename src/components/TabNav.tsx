import { useRef } from "react";
import type { Theme } from "../theme/themes";
import { TABS, type TabKey } from "../constants";

interface TabNavProps {
  tab: TabKey;
  setTab: (k: TabKey) => void;
  T: Theme;
}

export function TabNav({ tab, setTab, T }: TabNavProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    let next = idx;
    if (e.key === "ArrowLeft") next = (idx + 1) % TABS.length;
    else if (e.key === "ArrowRight") next = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    const k = TABS[next].k;
    setTab(k);
    refs.current[k]?.focus();
  };

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 px-3 pb-3 pt-2"
      aria-label="ניווט ראשי"
      style={{ background: T.bg + "F2", backdropFilter: "blur(12px)", borderTop: `1px solid ${T.line}` }}
    >
      <div className="flex gap-1 mx-auto" style={{ maxWidth: 620 }} role="tablist" aria-label="לשוניות">
        {TABS.map(({ k, l, I }, idx) => (
          <button
            key={k}
            ref={(el) => {
              refs.current[k] = el;
            }}
            role="tab"
            id={`tab-${k}`}
            aria-selected={tab === k}
            aria-controls={`panel-${k}`}
            tabIndex={tab === k ? 0 : -1}
            onClick={() => setTab(k)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all active:scale-95"
            style={{
              background: tab === k ? T.a + (T.dark ? "44" : "88") : "transparent",
              color: tab === k ? T.ink : T.soft,
            }}
          >
            <I size={17} />
            <span className="text-xs" style={{ fontWeight: tab === k ? 700 : 400 }}>
              {l}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
