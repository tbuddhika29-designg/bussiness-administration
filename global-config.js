import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export async function initializeGlobalSettings() {
  try {
    const snap = await getDoc(doc(db, "settings", "config"));
    if (!snap.exists()) return;
    const data = snap.data();

    // මෙම ඩේටා වෙනත් Script වලට භාවිත කිරීමට window object එකට දමමු
    window.siteSettings = data;

    const currentPath = window.location.pathname;
    const isAdminPage = currentPath.includes("admin");

    // 1. Maintenance Mode (නඩත්තු කටයුතු) පරීක්ෂාව
    if (data.general?.maintenanceMode && !isAdminPage) {
      if (!currentPath.includes("maintenance.html")) {
        window.location.href = "maintenance.html";
        return;
      }
    }

    // 2. Site Name එක ඔටෝමැටිකව වෙනස් කිරීම
    if (data.general?.siteName) {
      // <title> එක අගට සයිට් නම එකතු කිරීම (Admin පේජ් හැර)
      if (!isAdminPage && document.title) {
        document.title = `${document.title} | ${data.general.siteName}`;
      }
      
      // HTML එකේ .dynamic-site-name ක්ලාස් එක ඇති හැම තැනටම නම දැමීම
      document.querySelectorAll('.dynamic-site-name').forEach(el => {
        el.textContent = data.general.siteName;
      });
    }

    // 3. පේජ් එක අනුව වෙනස් වන සෙටින්ග්ස් ක්‍රියාත්මක කිරීම
    applyPageSpecificSettings(data);

  } catch (error) {
    console.error("Error loading global settings:", error);
  }
}

function applyPageSpecificSettings(data) {
  // --- A. ලියාපදිංචි වීමේ පේජ් එක (Registration Page) ---
  const regForm = document.getElementById('registration-form');
  const regMessage = document.getElementById('registration-closed-msg');
  
  if (data.general?.registrationOpen === false) {
    if (regForm) regForm.style.display = 'none'; // Form එක හංගනවා
    if (regMessage) {
      regMessage.style.display = 'block'; // පණිවිඩය පෙන්වනවා
      regMessage.textContent = "නව සිසුන් ලියාපදිංචි කිරීම තාවකාලිකව අත්හිටුවා ඇත.";
    }
  }

  // --- B. පන්ති ගාස්තු / Plans පෙන්වන පේජ් එක (Pricing/Plans Page) ---
  const clientPlansGrid = document.getElementById('client-plans-grid');
  if (clientPlansGrid && data.plans) {
    clientPlansGrid.innerHTML = data.plans.map(p => `
      <div class="pricing-card">
        <h3>${p.name}</h3>
        <div class="price">Rs. ${p.price}</div>
        <p class="duration">වලංගු කාලය: ${p.period}</p>
        <button class="select-btn" onclick="payForPlan('${p.id}', ${p.price})">දැන්ම සම්බන්ධ වන්න</button>
      </div>
    `).join('');
  }

  // --- C. මුදල් ගෙවන පේජ් එක (Payment/Checkout Page) ---
  // බැංකු විස්තර පෙන්වීම
  if (data.payment) {
    const bankSection = document.getElementById('bank-payment-details');
    if (bankSection) {
      if (data.payment.bankEnabled) {
        document.getElementById('view-bank-name').textContent = data.payment.bankName;
        document.getElementById('view-bank-account').textContent = data.payment.bankAccount;
        document.getElementById('view-bank-holder').textContent = data.payment.bankHolder;
        document.getElementById('view-bank-branch').textContent = data.payment.bankBranch;
      } else {
        bankSection.innerHTML = "<p style='color:red;'>බැංකු මගින් මුදල් ගෙවීම් තාවකාලිකව අක්‍රියයි.</p>";
      }
    }

    // QR / PayHere විස්තර පෙන්වීම
    const qrSection = document.getElementById('qr-payment-details');
    if (qrSection) {
      if (data.payment.qrEnabled) {
        const qrImg = document.getElementById('view-qr-image');
        if (qrImg) qrImg.src = data.payment.qrLink;
        document.getElementById('view-qr-contact').textContent = data.payment.qrContact;
      } else {
        qrSection.style.display = 'none';
      }
    }
  }
}
