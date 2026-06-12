// global-config.js
import { db } from "./firebase-config.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function initializeGlobalSettings() {
    // ලොග් වී සිටීම හෝ නොසිටීම අදාළ නැත, සැකසුම් සෑමවිටම පරීක්ෂා කරන්න
    onSnapshot(doc(db, "settings", "config"), (snapshot) => {
        if (!snapshot.exists()) return;
        
        const data = snapshot.data();
        const general = data.general;
        if (!general) return;

        // 1. Site Name වෙනස් කිරීම
        if (general.siteName) {
            document.title = general.siteName;
        }

        // 2. Maintenance Mode පාලනය
        const currentPath = window.location.pathname;
        
        // Admin පිටු සහ maintenance පිටුවම පරීක්ෂා කර ලූප් එකක් ඇතිවීම වළක්වන්න
        const isExcluded = currentPath.includes('admin') || 
                           currentPath.includes('settings') || 
                           currentPath.includes('maintenance.html');

        if (general.maintenanceMode && !isExcluded) {
            window.location.href = 'maintenance.html'; 
        }

        // 3. නව ලියාපදිංචි කිරීම් තහනම් කිරීම
        if (!general.registrationOpen && currentPath.includes('register.html')) {
            window.location.href = 'index.html';
        }
    });
}
