import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

  // Your Firebase configuration object goes here
  const firebaseConfig = {
    apiKey: "AIzaSyCvhQAuEN1R1TRS7cQjTdQXm1dBfsF_hWE",
    authDomain: "sewa-resume.firebaseapp.com",
    projectId: "sewa-resume",
    storageBucket: "sewa-resume.firebasestorage.app",
    messagingSenderId: "644613225340",
    appId: "1:644613225340:web:a1cc02984ee4daa1f282f9",
    measurementId: "G-65RENBD5FH"
  };


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);