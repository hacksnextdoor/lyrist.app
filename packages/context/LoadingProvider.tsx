'use client';
import {createContext, useContext, useState, useCallback, useEffect, ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {Modal, View, StyleSheet, ActivityIndicator} from 'react-native';
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
      <Modal visible={isLoading} transparent>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <ActivityIndicator size="large" color={LYRIST_BLUE} />
            <LyristText style={styles.text} weight="Medium">
              {message}
            </LyristText>
          </View>
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
