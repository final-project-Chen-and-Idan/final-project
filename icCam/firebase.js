// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {onAuthStateChanged, initializeAuth } from 'firebase/auth';
import {getStorage} from 'firebase/storage'
// import { getMessaging, getToken } from "firebase/messaging";
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

  


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
const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage),});
const db = getFirestore(app);
const storage = getStorage(app)
// const messaging  = getMessaging(app)
// const token = getToken(messaging, {vapidKey:"BNEYA0gwLvwuHwV8_Q5kuwxFD1_6e1OTDa7rpfiVe-kGSgu9Ml2ukq2Xfoo8TzKCStlsZzlugflmEFOXa3JDDIU"})
export { db, auth, storage, onAuthStateChanged};