import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import firebaseConfig from "./firebaseConfig";

const firebaseConfig = {
  apiKey : import.meta.env.VITE_REACT_APP_API_KEY,
  authDomain : import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
  projectId : import.meta.env.VITE_REACT_APP_PROJECT_ID,
  storageBucket : import.meta.env.VITE_REACT_APP_STORAGE_BUCKET,
  messagingSenderId : import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID,
  appId : import.meta.env.VITE_REACT_APP_APP_ID,
  measurementId : import.meta.env.VITE_REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const logInWithEmailAndPassword = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const logout = () => {
  signOut(auth);
};

export { auth, db, storage, logInWithEmailAndPassword, logout };
