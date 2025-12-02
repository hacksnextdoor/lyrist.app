import functions from '../firebase/firebase-functions-web';

export function createFunction<T = any, R = any>(name: string): (data?: T) => Promise<R | unknown> {
  const callable = functions().httpsCallable(name);
  return async (data?: T) => (await callable(data ?? {})).data;
}
