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
// Want to do local development?
// Uncomment this and use `yarn test:emulator:start`
// database().useEmulator('http://localhost:8080');
export default database;
