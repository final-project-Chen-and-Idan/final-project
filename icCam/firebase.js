// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrs5ht5-Q33uSzGqBVxMS2YV-DnEfqAVg",
  authDomain: "ic-cam.firebaseapp.com",
  projectId: "ic-cam",
  storageBucket: "ic-cam.appspot.com",
  messagingSenderId: "645684529003",
  appId: "1:645684529003:web:b9d6025afea79a96f2ee2e"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
export { db, auth, storage, onAuthStateChanged};