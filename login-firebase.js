// මෙම code login page එකින් firebase section එකට දුන්න script tag එක තුනින් replace කරන්න

<!-- FIREBASE -->
<script type="module">
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

function showAlert(msg, type='error') {
  const box = document.getElementById('alert-box');
  const txt = document.getElementById('alert-text');
  box.className = `alert ${type}`;
  txt.textContent = msg;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setLoading(on) {
  const btn = document.getElementById('loginBtn');
  btn.classList.toggle('loading', on);
  btn.disabled = on;
}

window.login = async () => {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showAlert('Please enter your email and password.');
    return;
  }

  setLoading(true);
  try {
    // Firebase Auth සිට login කරන්න
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Firestore සිට user document එක පරීක්ෂා කරන්න
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // පළමු ලොගිනුවෙන් පස්සේ user document එක create කරන්න
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || 'User',
        email: user.email,
        approved: false,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      showAlert('Account registered. Awaiting admin approval.', 'success');
      setTimeout(() => { window.location.href = 'pending-approval.html'; }, 900);
      return;
    }

    // Approval status එක check කරන්න
    const userData = userSnap.data();
    if (!userData.approved) {
      showAlert('Your account is pending admin approval. Please try again later.', 'error');
      setLoading(false);
      setTimeout(() => { window.location.href = 'pending-approval.html'; }, 1500);
      return;
    }

    // Last login update කරන්න
    await updateDoc(userRef, { lastLogin: new Date() });

    showAlert('Login successful! Redirecting…', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
  } catch (error) {
    const msgs = {
      'auth/user-not-found':    'No account found with this email.',
      'auth/wrong-password':    'Incorrect password. Please try again.',
      'auth/invalid-email':     'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/invalid-credential':'Invalid email or password.',
    };
    showAlert(msgs[error.code] || error.message);
  } finally {
    setLoading(false);
  }
};

// Enter key support
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') window.login();
});
</script>
