import type { AppTab } from '@/core/navigation/types';
import type { GameLaunchRef } from '@/core/games/gameRegistry';
import { tryHandleBack } from '@/core/navigation/backGuards';

type NavBase = {
  v: 1;
  /**
   * Depth within the in-app navigation stack.
   * - 0: tab root
   * - 1: in-tab detail / modal
   * - 2: game overlay (full-screen)
   */
  depth: 0 | 1 | 2;
};

export type TabNavState = NavBase & { kind: 'tab'; tab: AppTab; depth: 0 };

export type ProfilePostNavState = NavBase & {
  kind: 'profilePost';
  tab: 'profile';
  levelId: string;
  depth: 1;
};

export type ArcadeGameNavState = NavBase & {
  kind: 'arcadeGame';
  tab: 'arcade';
  gameId: string;
  depth: 1;
};

export type GameNavState = NavBase & {
  kind: 'game';
  ref: GameLaunchRef;
  depth: 2;
};

export type NavState = TabNavState | ProfilePostNavState | ArcadeGameNavState | GameNavState;

type HistoryState = {
  __parsNav?: NavState;
};

function getHistoryState(): HistoryState | null {
  return (window.history.state ?? null) as HistoryState | null;
}

export function getNavState(): NavState | null {
  const hs = getHistoryState();
  const nav = hs?.__parsNav;
  return isNavState(nav) ? nav : null;
}

export function canGoBack(nav: NavState | null): boolean {
  return !!nav && nav.depth > 0;
}

export function back(): void {
  // Allow screens (e.g. in-game) to intercept back and show confirmation UX.
  if (tryHandleBack()) return;
  window.history.back();
}

export function backOrReplaceTab(tab: AppTab): void {
  // Allow screens (e.g. in-game) to intercept back and show confirmation UX.
  if (tryHandleBack()) return;
  const nav = getNavState();
  if (canGoBack(nav)) {
    back();
    return;
  }
  replace({ kind: 'tab', tab, v: 1, depth: 0 });
}

export function init(defaultTab: AppTab): NavState {
  const existing = getNavState();
  if (existing) return existing;

  const fromHash = parseHash(window.location.hash);
  const initial: NavState = fromHash ?? { kind: 'tab', tab: defaultTab, v: 1, depth: 0 };
  // Replace (not push) so fresh sessions start at a single root entry.
  replace(initial);
  return initial;
}

export function subscribe(onChange: (nav: NavState) => void): () => void {
  // When the user presses browser back, `popstate` fires *after* the navigation happened.
  // If a back guard wants to handle it (e.g. show "Exit game?" confirm),
  // we immediately undo the back via `history.forward()` and keep app state unchanged.
  let skipGuardOnce = false;

  const handler = (e: PopStateEvent) => {
    if (!skipGuardOnce && tryHandleBack()) {
      skipGuardOnce = true;
      window.history.forward();
      return;
    }
    skipGuardOnce = false;

    const nav = (e.state as HistoryState | null)?.__parsNav;
    if (isNavState(nav)) {
      onChange(nav);
      return;
    }

    // Fallback: if state is missing (e.g. user edited URL hash),
    // try to parse hash and keep app coherent.
    const parsed = parseHash(window.location.hash);
    if (parsed) {
      replace(parsed);
      onChange(parsed);
      return;
    }

    // Absolute fallback: restore root.
    const fallback: NavState = { kind: 'tab', tab: 'dashboard', v: 1, depth: 0 };
    replace(fallback);
    onChange(fallback);
  };

  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}

export function replace(nav: NavState): void {
  const url = hashFor(nav);
  window.history.replaceState({ ...(getHistoryState() ?? {}), __parsNav: nav } satisfies HistoryState, '', url);
}

export function push(nav: NavState): void {
  const url = hashFor(nav);
  window.history.pushState({ ...(getHistoryState() ?? {}), __parsNav: nav } satisfies HistoryState, '', url);
}

function isNavState(x: unknown): x is NavState {
  if (!x || typeof x !== 'object') return false;
  const v = (x as any).v;
  const kind = (x as any).kind;
  const depth = (x as any).depth;
  if (v !== 1) return false;
  if (depth !== 0 && depth !== 1 && depth !== 2) return false;
  if (kind === 'tab') {
    const tab = (x as any).tab;
    return depth === 0 && typeof tab === 'string';
  }
  if (kind === 'profilePost') {
    return depth === 1 && (x as any).tab === 'profile' && typeof (x as any).levelId === 'string';
  }
  if (kind === 'arcadeGame') {
    return depth === 1 && (x as any).tab === 'arcade' && typeof (x as any).gameId === 'string';
  }
  if (kind === 'game') {
    const ref = (x as any).ref;
    return (
      depth === 2 &&
      !!ref &&
      typeof ref === 'object' &&
      typeof ref.gameId === 'string' &&
      (typeof ref.levelId === 'string' || typeof ref.levelId === 'number')
    );
  }
  return false;
}

function hashFor(nav: NavState): string {
  const h = (() => {
    switch (nav.kind) {
      case 'tab':
        return `tab/${encodeURIComponent(nav.tab)}`;
      case 'profilePost':
        return `profile/post/${encodeURIComponent(nav.levelId)}`;
      case 'arcadeGame':
        return `arcade/game/${encodeURIComponent(nav.gameId)}`;
      case 'game': {
        const gameId = encodeURIComponent(nav.ref.gameId);
        const levelId = encodeURIComponent(String(nav.ref.levelId));
        const campaign = nav.ref.campaignLevelId ? encodeURIComponent(nav.ref.campaignLevelId) : '';
        return campaign ? `play/${gameId}/${levelId}?c=${campaign}` : `play/${gameId}/${levelId}`;
      }
    }
  })();

  // Keep pathname/query intact; only manipulate hash.
  return `${window.location.pathname}${window.location.search}#${h}`;
}

function parseHash(hash: string): NavState | null {
  const raw = (hash || '').replace(/^#/, '');
  if (!raw) return null;

  const [pathPart, queryPart] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean).map((p) => decodeURIComponent(p));
  const kind = parts[0];

  if (kind === 'tab') {
    const tab = parts[1] as AppTab | undefined;
    if (!tab) return null;
    return { kind: 'tab', tab, v: 1, depth: 0 };
  }

  if (kind === 'profile' && parts[1] === 'post' && parts[2]) {
    return { kind: 'profilePost', tab: 'profile', levelId: parts[2], v: 1, depth: 1 };
  }

  if (kind === 'arcade' && parts[1] === 'game' && parts[2]) {
    return { kind: 'arcadeGame', tab: 'arcade', gameId: parts[2], v: 1, depth: 1 };
  }

  if (kind === 'play' && parts[1] && parts[2]) {
    const gameId = parts[1] as any;
    const levelIdRaw = parts[2];
    const levelIdNum = Number(levelIdRaw);
    const levelId = Number.isFinite(levelIdNum) && levelIdRaw.trim() !== '' ? levelIdNum : levelIdRaw;

    const campaignLevelId =
      queryPart?.startsWith('c=') ? decodeURIComponent(queryPart.slice(2)) : undefined;
    
    // Determine mode: if campaignLevelId exists, it's career mode, otherwise arcade
    const mode: 'career' | 'arcade' = campaignLevelId ? 'career' : 'arcade';

    return {
      kind: 'game',
      ref: { gameId, levelId, mode, campaignLevelId },
      v: 1,
      depth: 2,
    };
  }

  return null;
}



