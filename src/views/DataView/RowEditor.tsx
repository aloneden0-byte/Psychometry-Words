import { useEffect, useRef, useState } from "react";
import { Save, Trash2, X } from "lucide-react";
import { Btn, Pill } from "../../components/primitives";
import type { Theme } from "../../theme/themes";
import type { Word } from "../../data/types";

interface RowEditorProps {
  row: Word;
  T: Theme;
  onSave: (r: Word) => void;
  onClose: () => void;
  onDelete: () => void;
}

const TEXT_FIELDS: [keyof Word, string][] = [
  ["word", "מילה"],
  ["nikud", "מנוקד"],
  ["root", "שורש"],
  ["pos", "חלק דיבר"],
  ["def", "הגדרה"],
  ["example", "משפט הקשר"],
];

const LIST_FIELDS: [keyof Word, string][] = [
  ["syn", "נרדפות"],
  ["ant", "הפכים"],
  ["tags", "תגיות"],
];

export function RowEditor({ row, T, onSave, onClose, onDelete }: RowEditorProps) {
  const [r, setR] = useState<Word>(row);
  const up = <K extends keyof Word>(k: K, v: Word[K]) => setR((x) => ({ ...x, [k]: v }));
  const txt = { background: "transparent", border: `1px solid ${T.line}`, color: T.ink };

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const titleId = "row-editor-title";

  useEffect(() => {
    triggerRef.current = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      (triggerRef.current as HTMLElement | null)?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3" style={{ background: "rgba(0,0,0,.35)" }} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full rounded-3xl p-4 overflow-y-auto sheet"
        style={{ background: T.card, maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <b id={titleId} style={{ color: T.ink }}>
            עריכת רשומה
          </b>
          <Btn T={T} onClick={onClose} aria-label="סגירה">
            <X size={15} aria-hidden="true" />
          </Btn>
        </div>
        {TEXT_FIELDS.map(([k, l]) => (
          <label key={k} className="block mb-2.5">
            <span className="text-xs" style={{ color: T.soft }}>
              {l}
            </span>
            <input
              value={(r[k] as string) || ""}
              onChange={(e) => up(k, e.target.value as Word[typeof k])}
              className="w-full rounded-xl px-3 py-2 text-sm mt-1 outline-none"
              style={txt}
            />
          </label>
        ))}
        {LIST_FIELDS.map(([k, l]) => (
          <label key={k} className="block mb-2.5">
            <span className="text-xs" style={{ color: T.soft }}>
              {l} — מופרד בפסיקים
            </span>
            <input
              value={((r[k] as string[]) || []).join(", ")}
              onChange={(e) =>
                up(
                  k,
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean) as Word[typeof k],
                )
              }
              className="w-full rounded-xl px-3 py-2 text-sm mt-1 outline-none"
              style={txt}
            />
          </label>
        ))}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs" style={{ color: T.soft }}>
            רמה
          </span>
          {[1, 2, 3].map((l) => (
            <Pill key={l} T={T} active={r.level === l} onClick={() => up("level", l as Word["level"])}>
              {l}
            </Pill>
          ))}
        </div>
        <div className="flex gap-2">
          <Btn T={T} tone="solid" style={{ flex: 1 }} onClick={() => onSave({ ...r, id: r.word.replace(/\s/g, "_") || r.id })}>
            <Save size={14} className="inline ml-1.5" aria-hidden="true" />
            שמור
          </Btn>
          <Btn T={T} tone="bad" onClick={onDelete} aria-label="מחיקת רשומה">
            <Trash2 size={15} aria-hidden="true" />
          </Btn>
        </div>
      </div>
    </div>
  );
}
