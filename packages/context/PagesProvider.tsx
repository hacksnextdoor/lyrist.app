import type firebase from 'firebase/compat';
import {createContext, useContext, useEffect, useState} from 'react';
import auth from '../firebase/firebase-auth-web';
import database from '../firebase/firebase-database-web';
import {Page} from '../types';

export const PagesContext = createContext<{
  pages: Page[];
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
  const [pagesLoading, setPagesLoading] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const findPageFromAudio = (idToFind: string) => pages.find(page => page.audio?.id === idToFind);
  const findPageFromPageId = (idToFind: string) => pages.find(page => page.id === idToFind);

  useEffect(() => {
    let ref: firebase.database.Query;

    const onValue = (snapshot: firebase.database.DataSnapshot) => {
      if (snapshot && snapshot.val()) {
        setPages(Object.values(snapshot.val()));
      } else {
        setPages([]);
      }
    };

    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        ref = database().ref(`authors/${user.uid}/pages`).orderByChild('dateLastModified');

        const onError = (a: Error) => {
          setError(a);
        };

        ref.on('value', onValue, onError);
      } else {
        ref?.off('value', onValue);
      }

      setPagesLoading(false);
    });

    return () => {
      unsubscribe();
      ref?.off('value', onValue);
    };
  }, [pagesLoading]);

  return (
    <PagesContext.Provider
      value={{pages, pagesLoading, error, findPageFromAudio, findPageFromPageId}}>
      {children}
    </PagesContext.Provider>
  );
}
