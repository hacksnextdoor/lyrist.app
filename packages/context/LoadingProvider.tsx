'use client';
import {createContext, useContext, useState, useCallback, useEffect, ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {View, StyleSheet, ActivityIndicator, Platform} from 'react-native';
import {LyristText} from '../components/LyristText';
import {LYRIST_BLUE} from '../constants';

type LoadingContextType = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  setLoadingMessage: (message: string) => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}

export function LoadingProvider({children}: {children: ReactNode}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');
  const pathname = usePathname();

  // Auto-hide loading when route changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const showLoading = useCallback((msg: string = 'Loading...') => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingMessage = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  return (
    <LoadingContext.Provider value={{showLoading, hideLoading, setLoadingMessage, isLoading}}>
      {children}
      {/* Uses fixed View instead of Modal to work immediately without portal issues */}
      {isLoading && (
        <View style={[styles.overlay, webOverlayStyle as any]}>
          <View style={styles.card}>
            <ActivityIndicator size="large" color={LYRIST_BLUE} />
            <LyristText style={styles.text} weight="Medium">
              {message}
            </LyristText>
          </View>
        </View>
      )}
    </LoadingContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

// Web-specific fixed positioning
const webOverlayStyle =
  Platform.OS === 'web'
    ? {
        position: 'fixed' as const,
      }
    : {};
