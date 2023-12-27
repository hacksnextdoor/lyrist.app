'use client';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {AppProviders} from '../../packages/context';
import {AppHeader} from './AppHeader';

export default function HomeLayout({children}) {
  // HACK FOR AVOIDING HYDRATION FAILURES
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  // DELETE THIS EVENTUALLY

  return (
    <AppProviders>
      <AppHeader />
      <View style={{alignItems: 'center'}}>
        <View style={{width: '100%', maxWidth: 500}}>{children}</View>
      </View>
    </AppProviders>
  );
}
