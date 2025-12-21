export type BackGuard = () => boolean;

const guards: BackGuard[] = [];

/**
 * Register a back guard (LIFO). If the guard returns true, the back action is handled
 * and default navigation should be skipped.
 */
export function registerBackGuard(guard: BackGuard): () => void {
  guards.push(guard);
  return () => {
    const idx = guards.lastIndexOf(guard);
    if (idx >= 0) guards.splice(idx, 1);
  };
}

export function tryHandleBack(): boolean {
  const guard = guards.at(-1);
  if (!guard) return false;
  try {
    return guard();
  } catch (e) {
    console.error('Back guard threw', e);
    return false;
  }
}


