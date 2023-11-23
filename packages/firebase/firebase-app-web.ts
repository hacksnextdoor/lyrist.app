import firebase from 'firebase/compat/app';

import {initFirebase} from './firebase-init';
initFirebase();

const app = firebase.app();
export default app;
