// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBocwNWjPMZFlyPdRPM9T1JnoAjP_UhSw4",
  authDomain: "meal-planner-17a19.firebaseapp.com",
  projectId: "meal-planner-17a19",
  storageBucket: "meal-planner-17a19.appspot.com",
  messagingSenderId: "466571016730",
  appId: "1:466571016730:web:4044d47629df930279efa3",
  measurementId: "G-RB34C6PZDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const fireStore = getFirestore(app);

