// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJyoDX0jGz9A4TIcNYmao05VnF939WHJA",
  authDomain: "my-notes-lk.firebaseapp.com",
  databaseURL: "https://my-notes-lk-default-rtdb.firebaseio.com",
  projectId: "my-notes-lk",
  storageBucket: "my-notes-lk.firebasestorage.app",
  messagingSenderId: "839422825491",
  appId: "1:839422825491:web:9274a612f0f885d84b1be6",
  measurementId: "G-XLZ55GD8XB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
