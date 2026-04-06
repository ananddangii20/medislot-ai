
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQY-P5ANYce9LU8EDRuEMXq6I0DKyOrkw",
  authDomain: "aiai-ecbea.firebaseapp.com",
  projectId: "aiai-ecbea",
  storageBucket: "aiai-ecbea.firebasestorage.app",
  messagingSenderId: "544601370778",
  appId: "1:544601370778:web:264617ae2a983ffbc2af23",
  measurementId: "G-7P1GWKQY3M"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();