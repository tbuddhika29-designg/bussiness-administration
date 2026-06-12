// global-config.js
import { auth, db } from "./firebase-config.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function initializeGlobalSettings() {
    // පරිශීලකයා ලොග් වී සිටීදැයි පරීක්ෂා කිරීම (Rules වලට අනුකූලව)
    auth.onAuthStateChanged((user) => {
        if (!user) return; // ලොග් වී නැත්නම් කිසිවක් නොකරන්න

        onSnapshot(doc(db, "settings", "config"), (snapshot) => {
            if (!snapshot.exists()) return;
            
            const data = snapshot.data();
            const general = data.general;
            if (!general) return;

            // 1. Site Name වෙනස් කිරීම
            if (general.siteName) {
                document.title = general.siteName;
            }

            // 2. Maintenance Mode පාලනය (Admin පිටුව හැර අනෙක් සියලුම පිටු සඳහා)
            const currentPath = window.location.pathname;
            const isSettingsPage = currentPath.includes('settings') || currentPath.includes('admin');

            if (general.maintenanceMode && !isSettingsPage) {
                window.location.href = 'maintenance.html'; 
            }

            // 3. නව ලියාපදිංචි කිරීම් තහනම් කිරීම (register.html සඳහා)
            if (!general.registrationOpen && currentPath.includes('register.html')) {
                window.location.href = 'index.html';
            }
        });
    });
}
