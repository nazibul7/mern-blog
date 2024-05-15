// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2ef7f.firebaseapp.com",
  projectId: "mern-blog-2ef7f",
  storageBucket: "mern-blog-2ef7f.appspot.com",
  messagingSenderId: "688209789919",
  appId: "1:688209789919:web:8ceac4c9b01d34124e3a6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app}