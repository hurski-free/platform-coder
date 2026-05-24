const STORAGE_PREFIX = 'platform-coder:block-build:';

function storageKey(levelId: string, platformIndex: number): string {
  return `${STORAGE_PREFIX}${levelId}:${platformIndex}`;
}

export function loadBuildOrder(levelId: string, platformIndex: number): string[] | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }

  const raw = sessionStorage.getItem(storageKey(levelId, platformIndex));
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function saveBuildOrder(
  levelId: string,
  platformIndex: number,
  order: readonly string[],
): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  sessionStorage.setItem(storageKey(levelId, platformIndex), JSON.stringify([...order]));
}

export function clearBuildOrder(levelId: string, platformIndex: number): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  sessionStorage.removeItem(storageKey(levelId, platformIndex));
}

export function clearBuildOrdersForLevel(levelId: string): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  const prefix = `${STORAGE_PREFIX}${levelId}:`;
  const keysToRemove: string[] = [];

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    sessionStorage.removeItem(key);
  }
}
