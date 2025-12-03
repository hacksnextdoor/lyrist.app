import {useState, useEffect} from 'react';
import {Platform} from 'react-native';

/**
 * Hook that tracks hydration state for web apps.
 * Returns true once the component has mounted on the client.
 * 
 * Also adds 'hydrated' class to <html> element for CSS-based loading states.
 * 
 * Usage:
 * - Use `hydrated` to conditionally render client-only content
 * - CSS can use `html.hydrated` selector to show/hide loading screens
 */
export function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    
    // Add hydrated class to html element for CSS loading states
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.classList.add('hydrated');
    }
  }, []);

  return hydrated;
}

/**
 * SSR-safe check if we're on the client and hydrated.
 * Useful for code that needs to run only after hydration.
 */
export function isHydrated(): boolean {
  if (Platform.OS !== 'web') return true;
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('hydrated');
}
