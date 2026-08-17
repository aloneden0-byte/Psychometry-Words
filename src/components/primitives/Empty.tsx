import { Filter } from "lucide-react";
import type { Theme } from "../../theme/themes";

export function Empty({ T, text }: { T: Theme; text: string }) {
  return (
    <div className="text-center py-16 px-6" style={{ color: T.soft }} role="status">
      <Filter size={28} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}
