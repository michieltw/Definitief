import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForLocalDevelopmentAndBuild",
  authDomain: "blackout-hockey-mlm.firebaseapp.com",
  projectId: "blackout-hockey-mlm",
  storageBucket: "blackout-hockey-mlm.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
