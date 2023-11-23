import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import {initFirebase} from './firebase-init';
initFirebase();

export const analytics = firebase.analytics;
export function logFirebaseEvent(event: string, params?: any) {
  if (window.location.hostname.includes('vercel')) {
    console.log(event, params);
    return;
  }
  analytics().logEvent(event, params);
}
export default analytics;
