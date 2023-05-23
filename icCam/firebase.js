// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import {onAuthStateChanged, initializeAuth } from 'firebase/auth';
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
const db = initializeFirestore(app,{experimentalForceLongPolling: true,   useFetchStreams: false,});

export {db, auth, onAuthStateChanged};