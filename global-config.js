// global-config.js
import { db } from "./firebase-config.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function initializeGlobalSettings() {
    // දත්ත වෙනස් වන සෑම විටම ස්වයංක්‍රීයව යාවත්කාලීන වේ (Real-time)
    onSnapshot(doc(db, "settings", "config"), (snapshot) => {
        if (!snapshot.exists()) return;
        
        const data = snapshot.data();
        const general = data.general;
        if (!general) return;

        // 1. Site Name යාවත්කාලීන කිරීම
        if (general.siteName) {
            document.title = general.siteName;
        }

        // 2. Maintenance Mode පාලනය (Admin පිටුව හැර අනෙක් සියලුම පිටු සඳහා)
        const isMaintenance = general.maintenanceMode;
        const currentPath = window.location.pathname;
        const isAdminPage = currentPath.includes('admin') || currentPath.includes('settings');

        if (isMaintenance && !isAdminPage) {
            // maintenance.html පිටුවක් සාදා එයට redirect කරන්න
            window.location.href = 'maintenance.html'; 
        }

        // 3. නව ලියාපදිංචි කිරීම් තහනම් කිරීම (register.html සඳහා)
        if (!general.registrationOpen && currentPath.includes('register.html')) {
            alert("නව ලියාපදිංචි කිරීම් තාවකාලිකව නවතා ඇත.");
            window.location.href = 'index.html';
        }
    });
}
