'use client';
import type firebase from 'firebase/compat';
import {useEffect, useState} from 'react';
import database from '../firebase/firebase-database-web';
import {decrypt} from '../encryption';
import type {Audio} from '../types';

/**
 * Hook for loading an EXISTING page from Firebase.
 *
 * This hook is intentionally simple:
 * - If pageId is provided, attach listeners and load data
 * - If pageId is null, return empty state immediately
 *
 * This hook does NOT handle:
 * - Page creation (use useCreatePage mutation)
 * - Draft/unsaved state (handle locally in component)
 * - Audio without a page (that's the "new page" state, handled by component)
 *
 * @param pageId - The page ID to load, or null for new page state
 */
export function usePage(pageId: string | null) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audio, setAudio] = useState<Audio | undefined>(undefined);
  const [loading, setLoading] = useState(pageId !== null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when pageId changes
    setTitle('');
    setBody('');
    setAudio(undefined);
    setError(null);

    if (pageId === null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`usePage: Attaching listeners for pageId: ${pageId}`);

    const bodyRef = database().ref(`pages/${pageId}/body`);
    const titleRef = database().ref(`library/${pageId}/title`);
    const audioRef = database().ref(`library/${pageId}/audio`);

    let isCurrent = true;

    const handleBody = (snapshot: firebase.database.DataSnapshot) => {
      if (!isCurrent) return;
      if (snapshot.exists() && snapshot.val() != null) {
        setBody(decrypt(snapshot.val()));
      } else {
        setBody('');
      }
      setLoading(false);
    };

    const handleTitle = (snapshot: firebase.database.DataSnapshot) => {
      if (!isCurrent) return;
      if (snapshot.exists() && snapshot.val() != null) {
        setTitle(snapshot.val());
      }
    };

    const handleAudio = (snapshot: firebase.database.DataSnapshot) => {
      if (!isCurrent) return;
      if (snapshot.exists() && snapshot.val() != null) {
        setAudio(snapshot.val());
      }
    };

    const handleError = (err: Error) => {
      if (!isCurrent) return;
      console.error(`usePage: Firebase error for ${pageId}:`, err);
      setError(err);
      setLoading(false);
    };

    bodyRef.on('value', handleBody, handleError);
    titleRef.on('value', handleTitle, handleError);
    audioRef.on('value', handleAudio, handleError);

    return () => {
      console.log(`usePage: Detaching listeners for pageId: ${pageId}`);
      isCurrent = false;
      bodyRef.off('value', handleBody);
      titleRef.off('value', handleTitle);
      audioRef.off('value', handleAudio);
    };
  }, [pageId]);

  return {
    title,
    body,
    audio,
    loading,
    error,
  };
}
