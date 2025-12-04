'use client';

import {ReactNode, useEffect, useRef} from 'react';
import {Purchases} from '@revenuecat/purchases-js';

export function RevenueCatProvider({children}: {children: ReactNode}) {
  const initializedRef = useRef(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_PURCHASES_API_KEY_WEB;
    if (!apiKey || initializedRef.current) {
      return;
    }

    try {
      Purchases.configure({apiKey, appUserId: ''});
      initializedRef.current = true;
    } catch (error) {
      // Only log in production - dev environment may have invalid keys
      if (process.env.NODE_ENV === 'production') {
        console.error('RevenueCat setup failed:', error);
      }
    }
  }, []);

  return <>{children}</>;
}
