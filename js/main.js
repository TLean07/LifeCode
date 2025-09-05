import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDonlQLZPZC5yM5jXOR1ELx8nv3dgB8_Kk",
  authDomain: "lifecode-ec59b.firebaseapp.com",
  projectId: "lifecode-ec59b",
  storageBucket: "lifecode-ec59b.firebasestorage.app",
  messagingSenderId: "553119062602",
  appId: "1:553119062602:web:2009b0bc7ed3406df164b3",
  measurementId: "G-ZPNQD1YPH7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_URL = 'https://us-central1-lifecode-ec59b.cloudfunctions.net/api';

window.app = {
    auth,
    API_URL,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
};
