import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {initFirebase} from './firebase-init';
initFirebase();

const auth = firebase.auth;

// Want to do local development?
// Uncomment this and use `yarn test:emulator:start`
// auth().useEmulator('http://localhost:9099');
export default auth;
