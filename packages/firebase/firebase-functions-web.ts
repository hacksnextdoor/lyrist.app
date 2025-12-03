import firebase from 'firebase/compat/app';
import 'firebase/compat/functions';
import {initFirebase} from './firebase-init';
import {isLocalhost, shouldUseEmulator} from './emulator-utils';
initFirebase();

const functions = firebase.functions;

// Connect to emulator if enabled (supports runtime toggle)
if (isLocalhost() && shouldUseEmulator()) {
  functions().useEmulator('localhost', 5001);
  console.log('🔥 Functions connected to emulator');
}

export default functions;
