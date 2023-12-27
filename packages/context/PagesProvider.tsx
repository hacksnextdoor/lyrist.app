import type firebase from 'firebase/compat';
import {createContext, useContext, useEffect, useState} from 'react';
import database from '../firebase/firebase-database-web';
import {Page} from '../types';
import {useAuthContext} from './AuthProvider';

export const PagesContext = createContext<{
  pages: Page[] | null;
  pagesLoading: boolean;
  error: Error | null;
  findPageFromAudio: (idToFind: string) => Page | undefined;
  findPageFromPageId: (idToFind: string) => Page | undefined;
} | null>(null);

export function usePagesContext() {
  const context = useContext(PagesContext);
  if (!context) {
    throw new Error('usePagesContext must be used within PagesProvider');
  }
  return context;
}

export function PagesProvider({children}) {
  const {user} = useAuthContext();
  const [pagesLoading, setPagesLoading] = useState(true);
  const [pages, setPages] = useState<Page[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const findPageFromAudio = (idToFind: string) => pages?.find(page => page.audio?.id === idToFind);
  const findPageFromPageId = (idToFind: string) => pages?.find(page => page.id === idToFind);

  useEffect(() => {
    let ref: firebase.database.Query;

    if (user) {
      setPagesLoading(true);
      ref = database().ref(`authors/${user.uid}/pages`).orderByChild('dateLastModified');
      const onValue = (snapshot: firebase.database.DataSnapshot) => {
        if (snapshot && snapshot.val()) {
          setPages(Object.values(snapshot.val()));
        } else {
          setPages([]);
        }
        setPagesLoading(false);
        setError(null);
      };

      const onError = (a: Error) => {
        setError(a);
        setPagesLoading(false);
      };
      ref.on('value', onValue, onError);
    } else {
      setPagesLoading(false);
    }

    return () => {
      ref?.off('value');
    };
  }, [user]);

  return (
    <PagesContext.Provider
      value={{pages, pagesLoading, error, findPageFromAudio, findPageFromPageId}}>
      {children}
    </PagesContext.Provider>
  );
}
