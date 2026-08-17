import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { Card } from "../../components/primitives";
import { checkIntegrity } from "../../lib/integrity";
import type { Theme } from "../../theme/themes";
import type { Word } from "../../data/types";

export function IntegrityCheck({ words, T }: { words: Word[]; T: Theme }) {
  const issues = useMemo(() => checkIntegrity(words), [words]);
  return (
    <Card T={T} className="p-4">
      {issues.length === 0 ? (
        <div className="text-sm text-center py-6" style={{ color: T.soft }} role="status">
          כל הרשומות תקינות.
        </div>
      ) : (
        issues.map((x, i) => (
          <div key={i} className="text-xs py-2 flex gap-2" style={{ borderTop: i ? `1px solid ${T.line}` : "none", color: T.ink }}>
            <AlertTriangle size={13} style={{ color: T.c }} className="shrink-0 mt-0.5" aria-hidden="true" />
            {x}
          </div>
        ))
      )}
    </Card>
  );
}
