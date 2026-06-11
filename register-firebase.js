// මෙම code ගිණුම registration page එකින් firebase section එකට දුන්න script tag එක තුනින් replace කරන්න

<script type="module">
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

function showAlert(msg, type = 'error') {
  const box = document.getElementById('alert-box');
  const txt = document.getElementById('alert-text');
  box.className = `alert ${type}`;
  txt.textContent = msg;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setLoading(on) {
  const btn = document.getElementById('regBtn');
  btn.classList.toggle('loading', on);
  btn.disabled = on;
}

window.register = async () => {
  const fullname  = document.getElementById('fullname').value.trim();
  const studentId = document.getElementById('studentId').value.trim();
  const programme = document.getElementById('programme').value.trim();
  const email     = document.getElementById('email').value.trim();
  const password  = document.getElementById('password').value;
  const confirm   = document.getElementById('confirmPassword').value;
  const agreed    = document.getElementById('termsWrap').classList.contains('checked');

  if (!fullname)           { showAlert('Please enter your full name.'); return; }
  if (!studentId)          { showAlert('Please enter your student ID.'); return; }
  if (!programme)          { showAlert('Please enter your programme.'); return; }
  if (!email)              { showAlert('Please enter your email address.'); return; }
  if (password.length < 8) { showAlert('Password must be at least 8 characters.'); return; }
  if (password !== confirm) { showAlert('Passwords do not match.'); return; }
  if (!agreed)             { showAlert('Please agree to the Terms of Service to continue.'); return; }

  setLoading(true);
  try {
    // Firebase Auth සිට user account එක create කරන්න
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Display name update කරන්න
    await updateProfile(user, { displayName: fullname });

    // Firestore සිට user document එක create කරන්න (pending approval)
    // FIX: Admin panels සමඟ ගැළපෙන ලෙස default fields එකතු කර ඇත
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: fullname,
      name: fullname,               // FIX: Admin panel එකේ u.name ලෙස පෙන්වීමට
      email: email,
      studentId: studentId,
      programme: programme,
      phone: "",                    // FIX: හිස් phone field එකක් තැබීම
      role: "student",              // FIX: Default role එක student කිරීම
      approved: false,              // Admin approval බලා තිබෙනවා
      paymentStatus: "none",        // FIX: මුල් ගෙවීම් තත්ත්වය none කිරීම
      subscriptionActive: false,    // FIX: Subscription එක active නැත
      plan: "Free",                 // FIX: Default plan එක Free කිරීම
      createdAt: new Date(),
      approvalDate: null,
      lastLogin: new Date()
    });

    showAlert('Account created! Admin approval පසු ලබා දිනු පස්සේ ඔබට portal එ enter විය හැකිය.', 'success');
    setTimeout(() => { window.location.href = 'pending-approval.html'; }, 1200);
  } catch (error) {
    const msgs = {
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/invalid-email':        'Please enter a valid email address.',
      'auth/weak-password':        'Password is too weak. Please choose a stronger password.',
      'auth/operation-not-allowed':'Account creation is currently disabled.',
    };
    showAlert(msgs[error.code] || error.message);
  } finally {
    setLoading(false);
  }
};
</script>
