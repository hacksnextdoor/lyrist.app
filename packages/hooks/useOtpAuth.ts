'use client';

import {signInWithCustomToken, signInWithPopup, GoogleAuthProvider, getAuth} from 'firebase/auth';
import {useState, useCallback} from 'react';
import {createFunction} from '../utils/createFunction';
import {Purchases} from '@revenuecat/purchases-js';

export function useOtpAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkedEmail, setLinkedEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  const requestCode = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const generatedCode = (await createFunction('generateOtp')()) as string;
      await createFunction('sendEmailWithCode')({email, code: generatedCode});
      setLinkedEmail(email);
      setCode(generatedCode);
      return generatedCode;
    } catch (e: any) {
      setError(e.message || 'Failed to send code');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCode = useCallback(
    async (inputCode: string) => {
      if (!linkedEmail) {
        throw new Error('No email linked');
      }
      if (inputCode !== code) {
        throw new Error('Invalid code');
      }

      setLoading(true);
      setError(null);
      try {
        const token = (await createFunction('getToken')({email: linkedEmail})) as string;
        const userCredential = await signInWithCustomToken(getAuth(), token);
        const {user} = userCredential;

        // Only sync with RevenueCat if it's configured (optional for web)
        try {
          const purchases = Purchases.getSharedInstance();
          await purchases.changeUser(user.uid);
        } catch (rcError) {
          // RevenueCat not configured, continue without it
          console.log('RevenueCat not configured, skipping user sync');
        }

        return user;
      } catch (e: any) {
        setError(e.message || 'Failed to verify code');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [linkedEmail, code],
  );

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();

      // Check if auth is initialized
      if (!auth) {
        throw new Error('Authentication not initialized. Please refresh the page.');
      }

      const provider = new GoogleAuthProvider();

      // Add custom parameters for better UX
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const result = await signInWithPopup(auth, provider);
      const {user} = result;

      // Only sync with RevenueCat if it's configured (optional for web)
      try {
        const purchases = Purchases.getSharedInstance();
        await purchases.changeUser(user.uid);
      } catch (rcError) {
        // RevenueCat not configured, continue without it
        console.log('RevenueCat not configured, skipping user sync');
      }

      return user;
    } catch (e: any) {
      // Handle specific errors
      if (e.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else if (e.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled.');
      } else if (e.code === 'auth/cancelled-popup-request') {
        // User opened another popup, ignore this error
        return;
      } else if (e.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else if (e.code === 'auth/too-many-requests') {
        setError('Too many sign-in attempts. Please try again later.');
      } else {
        setError(e.message || 'Failed to sign in with Google');
      }
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    requestCode,
    verifyCode,
    signInWithGoogle,
    loading,
    error,
    linkedEmail,
    code,
  };
}
