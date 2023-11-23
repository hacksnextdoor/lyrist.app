import firebase from 'firebase/compat/app';
import 'firebase/compat/functions';
import {initFirebase} from './firebase-init';
initFirebase();

const functions = firebase.functions;

// Want to do local development?
// Uncomment this and use `yarn test:emulator:start`
// firestore().useEmulator('http://localhost:8080');
export default functions;
