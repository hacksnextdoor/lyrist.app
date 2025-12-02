'use client';
import type firebase from 'firebase/compat';
import {Dispatch, SetStateAction, createContext, useContext, useEffect, useState} from 'react';
import {Modal, Pressable, StyleSheet} from 'react-native';
import auth from '../firebase/firebase-auth-web';
import analytics from '../firebase/firebase-analytics-web';
import {OtpAuth} from '../components/OtpAuth';

const AuthContext = createContext<{
  user: firebase.User | null;
  userLoading: boolean;
  hasPlus: boolean;
  plusLoading: boolean;
  openAuthModal: boolean;
  setOpenAuthModal: Dispatch<SetStateAction<boolean>>;
  setPlusStatus: (userId: firebase.User['uid']) => Promise<void>;
} | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({children}) {
  const [userLoading, setUserLoading] = useState(true);
  const [hasPlus, setPlus] = useState(false);
  const [plusLoading, setPlusLoading] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [openAuthModal, setOpenAuthModal] = useState(false);

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

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        setUser(user);
        analytics().setUserId(user.uid);
        // analytics().setUserProperties({country: getCountry()});
        await setPlusStatus(user.uid);
      } else {
        setUser(null);
        setPlus(false);
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
        openAuthModal,
        setOpenAuthModal,
        setPlusStatus,
      }}>
      {children}
      <Modal visible={openAuthModal} onRequestClose={closeAuthModal} transparent>
        <Pressable style={styles.modalOverlay} onPress={closeAuthModal}>
          <Pressable onPress={e => e.stopPropagation()}>
            <OtpAuth onSuccess={closeAuthModal} onDismiss={closeAuthModal} />
          </Pressable>
        </Pressable>
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
});
