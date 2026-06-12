// global-config.js
import { db } from "./firebase-config.js";
import { doc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// 1. මධ්‍යගත සැකසුම් (Maintenance, Site Name) පාලනය කිරීම
export function initializeGlobalSettings() {
    onSnapshot(doc(db, "settings", "config"), (snapshot) => {
        if (!snapshot.exists()) {
            console.error("Error: 'settings/config' document does not exist.");
            return;
        }
        
        const data = snapshot.data();
        const general = data.general; // ඔබගේ Firestore ව්‍යුහය 'general' Map එකක් නම්
        
        if (!general) {
            console.error("Error: 'general' field not found inside the document.");
            return;
        }

        // 1. Site Name යාවත්කාලීන කිරීම
        if (general.siteName) {
            console.log("Setting site name to:", general.siteName);
            document.title = general.siteName;
        }

        // 2. Maintenance Mode පාලනය
        const currentPath = window.location.pathname;
        const isExcluded = currentPath.includes('admin') || 
                           currentPath.includes('settings') || 
                           currentPath.includes('maintenance.html');

        if (general.maintenanceMode === true && !isExcluded) {
            console.log("Maintenance mode is ON. Redirecting...");
            window.location.href = 'maintenance.html'; 
        }

        // 3. ලියාපදිංචි කිරීම් පාලනය
        if (general.registrationOpen === false && currentPath.includes('register.html')) {
            window.location.href = 'index.html';
        }
    }, (error) => {
        console.error("Firestore Snapshot Error:", error);
    });
}

// 2. පරිශීලකයා Admin කෙනෙක්දැයි පරීක්ෂා කිරීම
export async function isAdmin(user) {
    if (!user) return false;
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
            return true;
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
    }
    return false;
}
