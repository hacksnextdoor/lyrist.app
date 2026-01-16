'use client';
import type firebase from 'firebase/compat';
import dynamic from 'next/dynamic';
import {usePathname, useRouter} from 'next/navigation';
import {Dispatch, SetStateAction, createContext, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Platform, Pressable, StyleSheet, View} from 'react-native';
import auth from '../firebase/firebase-auth-web';
import firestore from '../firebase/firebase-firestore-web';
import analytics from '../firebase/firebase-analytics-web';
import {OtpAuth} from '../components/OtpAuth';
import {LyristText} from '../components/LyristText';
import {LYRIST_BLUE, TURQUOISE} from '../constants';

const PricingCard = dynamic(() => import('../../site/PricingCard').then(mod => mod.PricingCard), {
  ssr: false,
  loading: () => (
    <View style={{padding: 48, alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  ),
});

const AuthContext = createContext<{
  user: firebase.User | null;
  userLoading: boolean;
  hasPlus: boolean;
  plusLoading: boolean;
  hasProfile: boolean;
  openAuthModal: boolean;
  setOpenAuthModal: Dispatch<SetStateAction<boolean>>;
  openPricingModal: boolean;
  setOpenPricingModal: Dispatch<SetStateAction<boolean>>;
  setPlusStatus: (userId: firebase.User['uid']) => Promise<void>;
  setHasProfile: Dispatch<SetStateAction<boolean>>;
  isTransitioning: boolean;
  setTransitionMessage: Dispatch<SetStateAction<string>>;
} | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({children}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [hasPlus, setPlus] = useState(false);
  const [plusLoading, setPlusLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openPricingModal, setOpenPricingModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('Loading...');
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track first auth check vs sign-in

  // SSR hydration guard - only render modals after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = openAuthModal || openPricingModal || isTransitioning;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openAuthModal, openPricingModal, isTransitioning]);

  const handleAuthSuccess = () => {
    setOpenAuthModal(false);
    // Only redirect to /search if signing in from the landing page
    if (pathname === '/') {
      router.push('/search');
    }
  };

  const closeAuthModal = () => setOpenAuthModal(false);

  const setPlusStatus = async (userId: string) => {
    try {
      setPlusLoading(true);
      let data = await fetch(`/api/plus/${userId}`, {cache: 'no-store'});
      let json = await data.json();
      setPlus(json);
    } catch {
    } finally {
      setPlusLoading(false);
    }
  };

  const checkProfile = async (user: firebase.User) => {
    try {
      const doc = await firestore().collection('users').doc(user.uid).get();
      console.log('checkProfile result:', user.uid, doc.exists);
      setHasProfile(doc.exists);
      return doc.exists;
    } catch (e) {
      console.error('checkProfile error:', e);
      setHasProfile(false);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        // Only show transition overlay on actual sign-in, not page refresh
        const isSignIn = !isInitialLoad;
        if (isSignIn) {
          setIsTransitioning(true);
          setTransitionMessage('Signing in...');
        }
        setUser(user);
        analytics().setUserId(user.uid);
        // analytics().setUserProperties({country: getCountry()});
        if (isSignIn) {
          setTransitionMessage('Loading your data...');
        }
        await Promise.all([setPlusStatus(user.uid), checkProfile(user)]);
        setIsTransitioning(false);
      } else {
        setUser(null);
        setPlus(false);
        setHasProfile(false);
      }
      setUserLoading(false);
      setIsInitialLoad(false); // After first auth check, any future auth is a sign-in
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userLoading,
        hasPlus,
        plusLoading,
        hasProfile,
        openAuthModal,
        setOpenAuthModal,
        openPricingModal,
        setOpenPricingModal,
        setPlusStatus,
        setHasProfile,
        isTransitioning,
        setTransitionMessage,
      }}>
      {children}
      {/* Auth modal - uses fixed View instead of Modal for mobile web compatibility */}
      {mounted && openAuthModal && (
        <View style={[styles.modalOverlay, webFixedStyle as any]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeAuthModal} />
          <View style={styles.modalContent}>
            <OtpAuth onSuccess={handleAuthSuccess} onDismiss={closeAuthModal} />
          </View>
        </View>
      )}
      {/* Pricing modal */}
      {mounted && openPricingModal && (
        <View style={[styles.pricingModalOverlay, webFixedStyle as any]}>
          <Pressable style={styles.pricingCloseButton} onPress={() => setOpenPricingModal(false)}>
            <LyristText style={styles.pricingCloseText} weight="Medium">
              ✕
            </LyristText>
          </Pressable>
          <PricingCard isActive intensity={1} />
        </View>
      )}
      {/* Blocking transition overlay - only during active sign-in */}
      {mounted && isTransitioning && (
        <View style={[styles.transitionOverlay, webFixedStyle as any]}>
          <View style={styles.transitionCard}>
            <ActivityIndicator size="large" color={LYRIST_BLUE} />
            <LyristText style={styles.transitionText} weight="Medium">
              {transitionMessage}
            </LyristText>
          </View>
        </View>
      )}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 9999,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
  },
  transitionOverlay: {
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
  transitionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  transitionText: {
    fontSize: 18,
    color: '#333',
  },
  pricingModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: TURQUOISE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  pricingCloseButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  pricingCloseText: {
    color: '#fff',
    fontSize: 20,
  },
});

// Web-specific fixed positioning (same pattern as LoadingProvider)
const webFixedStyle =
  Platform.OS === 'web'
    ? {
        position: 'fixed' as const,
      }
    : {};
