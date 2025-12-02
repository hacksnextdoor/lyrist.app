import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {initFirebase} from './firebase-init';
initFirebase();

const auth = firebase.auth;

// Automatically connect to emulator in development
if (
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
) {
  auth().useEmulator('http://localhost:9099');
  console.log('🔥 Firebase Auth connected to emulator');
}

export default auth;
