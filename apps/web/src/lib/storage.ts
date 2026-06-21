import { type AppState, initialState, normalizeState } from '@ottawa-church/domain';

const storageKey = 'ottawa-church-events-state-v1';

export function loadState(): AppState {
  if (typeof localStorage === 'undefined') return initialState;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return initialState;
  try {
    return normalizeState(JSON.parse(raw) as Partial<AppState>);
  } catch {
    return initialState;
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(storageKey);
}
