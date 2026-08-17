import { useCallback, useState } from "react";
import { loadState, saveState } from "../lib/storage";

/**
 * Synchronous localStorage-backed state (see Code tab, lesson 7).
 * Unlike the reference's async `window.storage` version, there is no
 * mount-time fetch race — the initial value is read synchronously from
 * useState's initializer, so `ready` is always true.
 */
export function usePersistedState<T extends object>(initial: T) {
  const [state, setState] = useState<T>(() => loadState(initial));

  const persist = useCallback((next: T) => saveState(next), []);

  return [state, setState, persist] as const;
}
