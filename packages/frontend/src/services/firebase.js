import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const appId = firebaseConfig.appId;
const initialAuthToken = null; // This was the previous behavior

export { db, auth, storage, appId, initialAuthToken };
