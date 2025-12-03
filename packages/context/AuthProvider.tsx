'use client';
import type firebase from 'firebase/compat';
import {usePathname, useRouter} from 'next/navigation';
import {Dispatch, SetStateAction, createContext, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Modal, Pressable, StyleSheet, View} from 'react-native';
import auth from '../firebase/firebase-auth-web';
import firestore from '../firebase/firebase-firestore-web';
import analytics from '../firebase/firebase-analytics-web';
import {OtpAuth} from '../components/OtpAuth';
import {LyristText} from '../components/LyristText';
import {LYRIST_BLUE} from '../constants';

const AuthContext = createContext<{
  user: firebase.User | null;
  userLoading: boolean;
  hasPlus: boolean;
  plusLoading: boolean;
  hasProfile: boolean;
  openAuthModal: boolean;
  setOpenAuthModal: Dispatch<SetStateAction<boolean>>;
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
  const [userLoading, setUserLoading] = useState(true);
  const [hasPlus, setPlus] = useState(false);
  const [plusLoading, setPlusLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('Loading...');

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
        setIsTransitioning(true);
        setTransitionMessage('Signing in...');
        setUser(user);
        analytics().setUserId(user.uid);
        // analytics().setUserProperties({country: getCountry()});
        setTransitionMessage('Loading your data...');
        await Promise.all([setPlusStatus(user.uid), checkProfile(user)]);
        setIsTransitioning(false);
      } else {
        setUser(null);
        setPlus(false);
        setHasProfile(false);
      }
      setUserLoading(false);
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
        setPlusStatus,
        setHasProfile,
        isTransitioning,
        setTransitionMessage,
      }}>
      {children}
      <Modal visible={openAuthModal} onRequestClose={closeAuthModal} transparent>
        <Pressable style={styles.modalOverlay} onPress={closeAuthModal}>
          <Pressable onPress={e => e.stopPropagation()}>
            <OtpAuth onSuccess={handleAuthSuccess} onDismiss={closeAuthModal} />
          </Pressable>
        </Pressable>
      </Modal>
      {/* Blocking transition overlay */}
      <Modal visible={isTransitioning} transparent>
        <View style={styles.transitionOverlay}>
          <View style={styles.transitionCard}>
            <ActivityIndicator size="large" color={LYRIST_BLUE} />
            <LyristText style={styles.transitionText} weight="Medium">
              {transitionMessage}
            </LyristText>
          </View>
        </View>
      </Modal>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  transitionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transitionCard: {
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
  transitionText: {
    fontSize: 18,
    color: '#333',
  },
});
