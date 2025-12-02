import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {initFirebase} from './firebase-init';
initFirebase();

const firestore = firebase.firestore;

// Automatically connect to emulator in development
if (
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
) {
  firestore().useEmulator('localhost', 8080);
  console.log('🔥 Firestore connected to emulator');
}

export default firestore;
