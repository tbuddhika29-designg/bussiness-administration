import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIrScoHdI7hg5ZdxiWziicqWU_8eeeGwY",
  authDomain: "tbuddhika29-designg.firebaseapp.com",
  projectId: "tbuddhika29-designg",
  storageBucket: "tbuddhika29-designg.firebasestorage.app",
  messagingSenderId: "553897274402",
  appId: "1:553897274402:web:09db380ecd7d22d09aae7b",
  measurementId: "G-Z03BSD8C4Y"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
