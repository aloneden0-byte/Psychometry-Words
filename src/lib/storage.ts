const KEY = "millim-state-v1";

/**
 * Synchronous localStorage replacement for the reference app's async
 * `window.storage` (an artifact-sandbox-only API). Same two design choices
 * as the original: one JSON blob under one key, and every call wrapped in
 * try/catch so a disabled/quota-full storage (e.g. private browsing) never
 * crashes the app — it just falls back to in-memory state for the session.
 */
export function loadState<T extends object>(fallback: T): T {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveState(next: unknown): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* non-blocking */
  }
}
