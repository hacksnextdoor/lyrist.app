import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import {initFirebase} from './firebase-init';
import {isLocalhost, shouldUseEmulator} from './emulator-utils';
initFirebase();

const database = firebase.database;
export function generateId() {
  const {key} = database().ref().push();
  if (!key) {
    throw new Error('should never be null');
  }
  return key;
}

// Connect to emulator if enabled (supports runtime toggle)
if (isLocalhost() && shouldUseEmulator()) {
  database().useEmulator('localhost', 9000);
  console.log('🔥 Database connected to emulator');
}

export default database;
