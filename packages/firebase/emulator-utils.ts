const EMULATOR_KEY = 'USE_FIREBASE_EMULATOR';

export function shouldUseEmulator(): boolean {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
  }

  // Check localStorage override first
  const stored = window.localStorage.getItem(EMULATOR_KEY);
  if (stored !== null) {
    return stored === 'true';
  }

  // Fall back to env var
  return process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
}

export function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

/**
 * Returns true if in a dev/debug environment (emulator mode or lyrist-dev subdomain)
 * Use this to show debug UI that should only appear during development
 */
export function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if using emulator
  if (shouldUseEmulator() && isLocalhost()) return true;

  // Check if on lyrist-dev subdomain
  if (window.location.hostname.includes('lyrist-dev')) return true;

  return false;
}
