import { getFirestore } from 'firebase/firestore';
import { app, firebaseConfig } from './firebaseApp';

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
