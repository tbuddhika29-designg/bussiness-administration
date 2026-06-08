import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function checkAuthAndApproval(requiredApproval = false) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Login page එට නොයා දෙන්න
        window.location.href = 'login.html';
        resolve(null);
        return;
      }

      if (!requiredApproval) {
        resolve(user);
        return;
      }

      // Firestore තුනින් user දත්ත පරීක්ෂා කරන්න
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.approved) {
            resolve(user);
          } else {
            // Pending approval page එට ගිහින්න
            window.location.href = 'pending-approval.html';
            resolve(null);
          }
        } else {
          // පළමු ලොගිනුවෙන් පස්සේ pending දැම්මට
          window.location.href = 'pending-approval.html';
          resolve(null);
        }
      } catch (error) {
        console.error('Error checking approval:', error);
        window.location.href = 'login.html';
        resolve(null);
      }
    });
  });
}

export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function getUserApprovalStatus(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user status:', error);
    return null;
  }
}
