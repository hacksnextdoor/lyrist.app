import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {initFirebase} from './firebase-init';
import {isLocalhost, shouldUseEmulator} from './emulator-utils';
initFirebase();

const firestore = firebase.firestore;

// Connect to emulator if enabled (supports runtime toggle)
if (isLocalhost() && shouldUseEmulator()) {
  firestore().useEmulator('localhost', 8080);
  console.log('🔥 Firestore connected to emulator');
}

export default firestore;
