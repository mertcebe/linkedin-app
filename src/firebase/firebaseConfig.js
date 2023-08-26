import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCV9T20XrNuZ9zR4Wg_rL1Em6EfffDPZkM",
  authDomain: "linkedin-app-93c8a.firebaseapp.com",
  projectId: "linkedin-app-93c8a",
  storageBucket: "linkedin-app-93c8a.appspot.com",
  messagingSenderId: "182144690678",
  appId: "1:182144690678:web:8e2d737adc3fe9e7beffd7",
  measurementId: "G-2H5T35BMFB"
};

const app = initializeApp(firebaseConfig);

const database = getFirestore();

const auth = getAuth();

export {database as default, auth};