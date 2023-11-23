'use client';
import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {ActivityIndicator, View, useWindowDimensions} from 'react-native';
import auth from '../../packages/firebase/firebase-auth-web';
import {logFirebaseEvent} from '../../packages/firebase';
import {LyristText} from '../../packages/components';
import {USER_SIGNED_IN} from '../../packages/constants';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/search';
  const [message, setMessage] = useState('');
  const {height, width} = useWindowDimensions();
  useEffect(() => {
    async function signIn() {
      try {
        // Check if this page was opened as a result of the email link
        if (auth().isSignInWithEmailLink(window.location.href)) {
          setMessage('sign in link is valid');
          // Get the email address from local storage or prompt the user for it
          const email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            // Prompt the user for their email
            const userEmail = window.prompt('Please provide your email for confirmation');
            if (userEmail) {
              // Sign in with the email and link
              await auth().signInWithEmailLink(userEmail, window.location.href);
              logFirebaseEvent(USER_SIGNED_IN);
              // Redirect the user to the main app page
              if (auth().currentUser.displayName) {
                setMessage(prev => prev + ' going to /search');
                window.localStorage.removeItem('emailForSignIn');
                router.replace(next);
              } else {
                setMessage(prev => prev + ' going to /profile/new');
                router.replace('/profile/new');
              }
            } else {
              router.replace('/search');
            }
          } else {
            await auth().signInWithEmailLink(email, window.location.href);
            logFirebaseEvent(USER_SIGNED_IN);
            // Redirect the user to the main app page
            if (auth().currentUser == null || auth().currentUser.displayName) {
              setMessage(prev => prev + ' going to /search');
              router.replace(next);
            } else {
              setMessage(prev => prev + ' going to /profile/new');
              router.replace('/profile/new');
            }
          }
        } else {
          setMessage('Loading web app');
          // The page was not opened as a result of the email link
          // CANT JUST SIGN OUT OF ANON ACCOUNT, NEED TO PERFORM CLEAN UP
          // await auth().signInAnonymously();
          router.replace('/search');
        }
      } catch (e) {
        router.replace(`/?error=${JSON.stringify(e)}`);
      }
    }

    signIn();
  }, [router]);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height,
      }}>
      <LyristText>{message}</LyristText>
      <ActivityIndicator color={'#007AFF'} />
    </View>
  );
}
