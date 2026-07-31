import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCidsBVJ6ylAVL_7QGjddbdScrERKxAqnA",
  authDomain: "next-ai-673ef.firebaseapp.com",
  projectId: "next-ai-673ef",
  storageBucket: "next-ai-673ef.firebasestorage.app",
  messagingSenderId: "602779872258",
  appId: "1:602779872258:web:627d9a2626c79452478b1b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;