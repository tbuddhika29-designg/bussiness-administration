// global-config.js
import { db } from "./firebase-config.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function initializeGlobalSettings() {
    // 1. Settings Document එක නිරීක්ෂණය කිරීම (Real-time)
    onSnapshot(doc(db, "settings", "config"), (snapshot) => {
        if (!snapshot.exists()) {
            console.error("Error: 'settings/config' document does not exist in Firestore.");
            return;
        }

        const data = snapshot.data();
        const general = data.general;

        if (!general) {
            console.error("Error: 'general' field not found inside the document.");
            return;
        }

        console.log("Global Settings Loaded:", general);

        // 2. Site Name යාවත්කාලීන කිරීම
        if (general.siteName) {
            document.title = general.siteName;
        }

        // 3. Maintenance Mode පාලනය
        const currentPath = window.location.pathname;
        
        // Admin සහ Maintenance පිටු redirect වීමෙන් වළක්වන්න
        const isExcluded = currentPath.includes('admin-panel.html') || 
                           currentPath.includes('settings.html') || 
                           currentPath.includes('maintenance.html');

        if (general.maintenanceMode === true && !isExcluded) {
            console.log("Maintenance mode is ON. Redirecting...");
            window.location.href = 'maintenance.html'; 
        }

        // 4. නව ලියාපදිංචි කිරීම් පාලනය
        if (general.registrationOpen === false && currentPath.includes('register.html')) {
            console.log("Registration is closed. Redirecting...");
            window.location.href = 'index.html';
        }
    }, (error) => {
        console.error("Firestore Snapshot Error:", error);
    });
}
