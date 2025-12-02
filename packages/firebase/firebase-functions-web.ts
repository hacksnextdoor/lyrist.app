import firebase from 'firebase/compat/app';
import 'firebase/compat/functions';
import {initFirebase} from './firebase-init';
initFirebase();

const functions = firebase.functions;

// Automatically connect to emulator in development
if (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  functions().useEmulator('localhost', 5001);
  console.log('🔥 Functions connected to emulator');
}

export default functions;
