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
      console.error('RevenueCat setup failed:', error);
    }
  }, []);

  return <>{children}</>;
}
