import type { ReactNode } from "react";
import type { Theme } from "../../theme/themes";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
  T: Theme;
}

export function Field({ label, hint, children, T }: FieldProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <div className="text-sm" style={{ color: T.ink, fontWeight: 600 }}>
          {label}
        </div>
        {hint && (
          <div className="text-xs mt-0.5" style={{ color: T.soft }}>
            {hint}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
