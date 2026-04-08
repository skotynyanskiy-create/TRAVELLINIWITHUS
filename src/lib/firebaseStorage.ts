import { getStorage } from 'firebase/storage';
import { app, firebaseConfig } from './firebaseApp';

export const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
