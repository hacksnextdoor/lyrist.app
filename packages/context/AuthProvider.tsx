import type firebase from 'firebase/compat';
import {Dispatch, SetStateAction, createContext, useContext, useEffect, useState} from 'react';
import auth from '../firebase/firebase-auth-web';
import analytics from '../firebase/firebase-analytics-web';
import {AuthModal} from './AuthModal';

const AuthContext = createContext<{
  user: firebase.User | null;
  userLoading: boolean;
  hasPlus: boolean;
  plusLoading: boolean;
  openAuthModal: boolean;
  setOpenAuthModal: Dispatch<SetStateAction<boolean>>;
  setPlusStatus: (userId: firebase.User['uid']) => void;
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
      }
      setUserLoading(false);

      return () => {
        setUser(null);
      };
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
      <AuthModal isOpen={openAuthModal} onClose={() => setOpenAuthModal(false)} />
      {children}
    </AuthContext.Provider>
  );
}
