import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import {initFirebase} from './firebase-init';
initFirebase();

const database = firebase.database;
export function generateId() {
  const {key} = database().ref().push();
  if (!key) {
    throw new Error('should never be null');
  }
  return key;
}

// Automatically connect to emulator in development
if (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  database().useEmulator('localhost', 9000);
  console.log('🔥 Database connected to emulator');
}

export default database;
