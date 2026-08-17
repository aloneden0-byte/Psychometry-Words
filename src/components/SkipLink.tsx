import type { Theme } from "../theme/themes";

export function SkipLink({ T }: { T: Theme }) {
  return (
    <a href="#main" className="skip-link" style={{ background: T.a, color: T.onAccent }}>
      דלגו לתוכן הראשי
    </a>
  );
}
