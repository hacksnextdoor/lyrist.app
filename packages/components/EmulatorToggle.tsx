'use client';

import {useState, useEffect} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {LyristText} from './LyristText';
import {LYRIST_BLUE} from '../constants';

const EMULATOR_KEY = 'USE_FIREBASE_EMULATOR';

export function EmulatorToggle() {
  const [isEmulator, setIsEmulator] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage override first, then env var
    const stored = window.localStorage.getItem(EMULATOR_KEY);
    if (stored !== null) {
      setIsEmulator(stored === 'true');
    } else {
      setIsEmulator(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true');
    }
  }, []);

  const toggleMode = () => {
    const newValue = !isEmulator;
    window.localStorage.setItem(EMULATOR_KEY, String(newValue));
    // Clear all other localStorage and redirect to landing page
    const keys = Object.keys(window.localStorage).filter(k => k !== EMULATOR_KEY);
    keys.forEach(k => window.localStorage.removeItem(k));
    window.location.href = '/';
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || isEmulator === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LyristText style={styles.text}>{isEmulator ? '🔥 Emulator' : '☁️ lyrist-dev'}</LyristText>
      <Pressable onPress={toggleMode} style={styles.button}>
        <LyristText style={styles.buttonText}>
          Switch to {isEmulator ? 'lyrist-dev' : 'Emulator'}
        </LyristText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 9999,
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
  button: {
    backgroundColor: LYRIST_BLUE,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 11,
  },
});
