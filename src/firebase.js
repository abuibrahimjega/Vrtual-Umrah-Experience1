import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEA3rC7HCuPATns9ofmgMAVNG6ECqfZtA",
  authDomain: "virtual-umrah-experience.firebaseapp.com",
  projectId: "virtual-umrah-experience",
  storageBucket: "virtual-umrah-experience.firebasestorage.app",
  messagingSenderId: "2585604539",
  appId: "1:2585604539:web:f690b0699f1b63205c949e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
