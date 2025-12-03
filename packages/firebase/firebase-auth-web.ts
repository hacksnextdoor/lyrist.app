import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {initFirebase} from './firebase-init';
import {shouldUseEmulator, isLocalhost} from './emulator-utils';
initFirebase();

const auth = firebase.auth;

// Automatically connect to emulator in development
if (isLocalhost() && shouldUseEmulator()) {
  auth().useEmulator('http://localhost:9099');
  console.log('🔥 Firebase Auth connected to emulator');
}

export default auth;
