"use strict";

/* =========================
   كريب التنين - Script نظيف
   Tracking + Menu + WhatsApp + Admin Dashboard
========================= */

/* ====== CONFIG ====== */
const PHONE = "201012054613"; // ✅ الرقم الصحيح للمطعم
const ADMIN_CODE = "1234";

/* ====== STORAGE KEYS ====== */
const STORAGE = {
  ANALYTICS: "dc_analytics"
};

/* ====== MENU DATA ====== */
const menu = [
  // ركن الكريب (سافوري)
  { name: "كريب زنجر", desc: "زنجر مقرمش مع صوص خاص", price: "60 ج", category: "savory", msg: "طلب كريب زنجر" },
  { name: "كريب بانيه فريش", desc: "بانيه طازة مع خضار", price: "60 ج", category: "savory", msg: "طلب كريب بانيه فريش" },
  { name: "كريب بانيه كرانش", desc: "بانيه كرانش مقرمش", price: "25 ج", category: "savory", msg: "طلب كريب بانيه كرانش" },
  { name: "كريب برجر", desc: "برجر لحم مع جبن", price: "35 ج", category: "savory", msg: "طلب كريب برجر" },
  { name: "كريب كفتة", desc: "كفتة مشوية على الفحم", price: "25 ج", category: "savory", msg: "طلب كريب كفتة" },
  { name: "كريب كبدة", desc: "كبدة بلدي مع بصل", price: "50 ج", category: "savory", msg: "طلب كريب كبدة" },
  { name: "كريب شاورما", desc: "شاورما لحمة مع صوص ثوم", price: "80 ج", category: "savory", msg: "طلب كريب شاورما" },
  // ركن الكريب الحلو
  { name: "كريب نوتيلا", desc: "نوتيلا مع موز ومكسرات", price: "35 ج", category: "sweet", msg: "طلب كريب نوتيلا" },
  { name: "كريب فاكهة", desc: "فواكه موسمية مع عسل", price: "35 ج", category: "sweet", msg: "طلب كريب فاكهة" },
  { name: "كريب مكس", desc: "نوتيلا + فواكه + مكسرات", price: "50 ج", category: "sweet", msg: "طلب كريب مكس" },
  // ركن الساندوتشات
  { name: "ساندوتش كبدة", desc: "كبدة بلدي على الصاج", price: "10 ج", category: "sandwich", msg: "طلب ساندوتش كبدة" },
  { name: "ساندوتش كفتة", desc: "كفتة مشوية", price: "10 ج", category: "sandwich", msg: "طلب ساندوتش كفتة" },
  { name: "ساندوتش كبدة وقوانص", desc: "كبدة وقوانص بالبصل", price: "10 ج", category: "sandwich", msg: "طلب ساندوتش كبدة وقوانص" },
  { name: "ساندوتش سجق شرقي", desc: "سجق حار مع مخلل", price: "10 ج", category: "sandwich", msg: "طلب ساندوتش سجق شرقي" },
  { name: "ساندوتش حواوشي", desc: "لحم مفروم مع بصل", price: "10 ج", category: "sandwich", msg: "طلب ساندوتش حواوشي" },
  { name: "ساندوتش برجر", desc: "برجر لحم طازة", price: "10 ج", category: "sandwich", msg: "طلب ساندوتش برجر" },
  { name: "برجر جامبو", desc: "برجر مزدوج مع جبن", price: "20 ج", category: "sandwich", msg: "طلب برجر جامبو" },
  { name: "بانيه كرانش", desc: "بانيه مقرمش مع صوص", price: "15 ج", category: "sandwich", msg: "طلب بانيه كرانش" },
  { name: "ساندوتش زنجر", desc: "زنجر حار مع كولسلو", price: "30 ج", category: "sandwich", msg: "طلب ساندوتش زنجر" }
];

/* ====== HELPER FUNCTIONS ====== */
function getTodayKey() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getAnalytics() {
  const data = localStorage.getItem(STORAGE.ANALYTICS);
  return data ? JSON.parse(data) : {};
}

function saveAnalytics(data) {
  localStorage.setItem(STORAGE.ANALYTICS, JSON.stringify(data));
}

function getTodayStats() {
  const analytics = getAnalytics();
  const today = getTodayKey();
  if (!analytics[today]) {
    analytics[today] = { visits: 0, calls: 0, whatsapp: 0, orders: 0 };
  }
  return analytics[today];
}

function updateTodayStats(updates) {
  const analytics = getAnalytics();
  const today = getTodayKey();
  if (!analytics[today]) {
    analytics[today] = { visits: 0, calls: 0, whatsapp: 0, orders: 0 };
  }
  Object.assign(analytics[today], updates);
  saveAnalytics(analytics);
}

/* ====== TRACKING FUNCTIONS ====== */
function trackVisit() {
  const todayStats = getTodayStats();
  if (!sessionStorage.getItem('visit_tracked')) {
    updateTodayStats({ visits: todayStats.visits + 1 });
    sessionStorage.setItem('visit_tracked', 'true');
  }
}

function trackCall() {
  const todayStats = getTodayStats();
  updateTodayStats({ calls: todayStats.calls + 1 });
}

function trackWhatsapp() {
  const todayStats = getTodayStats();
  updateTodayStats({ whatsapp: todayStats.whatsapp + 1 });
}

function trackOrder() {
  const todayStats = getTodayStats();
  updateTodayStats({ orders: todayStats.orders + 1 });
}

/* ====== WEEKLY STATS ====== */
function getWeeklyStats() {
  const analytics = getAnalytics();
  const today = new Date();
  const weekly = { visits: 0, calls: 0, whatsapp: 0, orders: 0 };
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    if (analytics[dateKey]) {
      weekly.visits += analytics[dateKey].visits || 0;
      weekly.calls += analytics[dateKey].calls || 0;
      weekly.whatsapp += analytics[dateKey].whatsapp || 0;
      weekly.orders += analytics[dateKey].orders || 0;
    }
  }
  return weekly;
}

/* ====== WHATSAPP LINK ====== */
function waLink(msg) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

/* ====== RENDER MENU ====== */
function renderMenu() {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;
  grid.innerHTML = "";
  
  menu.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card fade-in";
    card.style.animationDelay = Math.random() * 0.3 + "s";
    card.innerHTML = `
      <div class="menu-card-inner">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="price">${item.price}</div>
        <button class="btn-order" data-msg="${item.msg}">اطلب الآن 🧡</button>
      </div>
    `;
    const btn = card.querySelector(".btn-order");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      trackOrder();
      trackWhatsapp();
      window.open(waLink(item.msg), "_blank");
      addClickEffect(btn);
    });
    grid.appendChild(card);
  });
}

/* ====== CLICK EFFECT ====== */
function addClickEffect(element) {
  element.classList.add("btn-click");
  setTimeout(() => element.classList.remove("btn-click"), 300);
}

/* ====== UPDATE UI ====== */
function updateUI() {
  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  
  // تحديث إحصائيات الفوتر العامة
  const footerVisitors = document.getElementById("statVisitors");
  const footerCalls = document.getElementById("statCalls");
  const footerWhatsapp = document.getElementById("statWhatsapp");
  const footerOrders = document.getElementById("statOrders");
  
  if (footerVisitors) footerVisitors.innerText = todayStats.visits;
  if (footerCalls) footerCalls.innerText = todayStats.calls;
  if (footerWhatsapp) footerWhatsapp.innerText = todayStats.whatsapp;
  if (footerOrders) footerOrders.innerText = todayStats.orders;
  
  // تحديث إحصائيات لوحة التحكم (إذا كانت موجودة)
  const adminVisitors = document.getElementById("statVisitorsAdmin");
  const adminCalls = document.getElementById("statCallsAdmin");
  const adminWhatsapp = document.getElementById("statWhatsappAdmin");
  const adminOrders = document.getElementById("statOrdersAdmin");
  const weekVisitors = document.getElementById("weekVisitors");
  const weekCalls = document.getElementById("weekCalls");
  const weekWhatsapp = document.getElementById("weekWhatsapp");
  const weekOrders = document.getElementById("weekOrders");
  
  if (adminVisitors) adminVisitors.innerText = todayStats.visits;
  if (adminCalls) adminCalls.innerText = todayStats.calls;
  if (adminWhatsapp) adminWhatsapp.innerText = todayStats.whatsapp;
  if (adminOrders) adminOrders.innerText = todayStats.orders;
  if (weekVisitors) weekVisitors.innerText = weeklyStats.visits;
  if (weekCalls) weekCalls.innerText = weeklyStats.calls;
  if (weekWhatsapp) weekWhatsapp.innerText = weeklyStats.whatsapp;
  if (weekOrders) weekOrders.innerText = weeklyStats.orders;
}

/* ====== BIND GLOBAL EVENTS ====== */
function bindEvents() {
  // جميع أزرار الاتصال (tel:)
  document.querySelectorAll('a[href^="tel:"]').forEach(btn => {
    btn.removeEventListener("click", handleCallClick);
    btn.addEventListener("click", handleCallClick);
  });
  
  // جميع أزرار الواتساب (ما عدا أزرار الطلب داخل المنيو)
  document.querySelectorAll('a[href*="wa.me"]:not(.btn-order)').forEach(btn => {
    btn.removeEventListener("click", handleWhatsappClick);
    btn.addEventListener("click", handleWhatsappClick);
  });
}

function handleCallClick() {
  trackCall();
}

function handleWhatsappClick() {
  trackWhatsapp();
}

/* ====== ADMIN DASHBOARD ====== */
let adminVisible = false;
let adminPanel = null;

function createAdminPanel() {
  if (adminPanel) return;
  adminPanel = document.createElement("div");
  adminPanel.id = "adminDashboard";
  adminPanel.className = "admin-panel hidden";
  adminPanel.innerHTML = `
    <div class="admin-header">
      <h2>📊 لوحة التحكم - كريب التنين</h2>
      <button id="closeAdmin" class="close-btn">✖</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card today">
        <h3>📅 إحصائيات اليوم</h3>
        <div class="stat-row">👥 زوار: <span id="statVisitorsAdmin">0</span></div>
        <div class="stat-row">📞 اتصالات: <span id="statCallsAdmin">0</span></div>
        <div class="stat-row">💬 واتساب: <span id="statWhatsappAdmin">0</span></div>
        <div class="stat-row">🛒 طلبات: <span id="statOrdersAdmin">0</span></div>
      </div>
      <div class="stat-card week">
        <h3>📆 آخر 7 أيام</h3>
        <div class="stat-row">👥 زوار: <span id="weekVisitors">0</span></div>
        <div class="stat-row">📞 اتصالات: <span id="weekCalls">0</span></div>
        <div class="stat-row">💬 واتساب: <span id="weekWhatsapp">0</span></div>
        <div class="stat-row">🛒 طلبات: <span id="weekOrders">0</span></div>
      </div>
    </div>
    <button id="resetStats" class="reset-btn">🔄 إعادة تعيين الإحصائيات</button>
  `;
  document.body.appendChild(adminPanel);
  
  document.getElementById("closeAdmin")?.addEventListener("click", hideAdminPanel);
  document.getElementById("resetStats")?.addEventListener("click", () => {
    if (confirm("هل أنت متأكد من إعادة تعيين كل الإحصائيات؟")) {
      localStorage.removeItem(STORAGE.ANALYTICS);
      sessionStorage.removeItem('visit_tracked');
      updateUI();
      alert("✓ تم إعادة تعيين الإحصائيات");
    }
  });
}

function showAdminPanel() {
  if (!adminPanel) createAdminPanel();
  updateUI();
  adminPanel.classList.remove("hidden");
  adminVisible = true;
}

function hideAdminPanel() {
  if (adminPanel) adminPanel.classList.add("hidden");
  adminVisible = false;
}

/* ====== SECRET CODE LISTENER ====== */
let typedCode = "";
function setupSecretCode() {
  document.addEventListener("keydown", (e) => {
    typedCode += e.key;
    if (typedCode.length > ADMIN_CODE.length) {
      typedCode = typedCode.slice(-ADMIN_CODE.length);
    }
    if (typedCode === ADMIN_CODE && !adminVisible) {
      showAdminPanel();
      typedCode = "";
    }
  });
}

/* ====== ANIMATIONS & EXCITEMENT ====== */
function addSpecialEffects() {
  // تأثير عرض اليوم (إذا وجد)
  const todayOffer = document.querySelector(".today-offer");
  if (todayOffer) {
    setInterval(() => {
      todayOffer.classList.add("pulse");
      setTimeout(() => todayOffer.classList.remove("pulse"), 1000);
    }, 3000);
  }
  
  // تأثير ظهور البطاقات عند التمرير
  const menuCards = document.querySelectorAll(".menu-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });
  
  menuCards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(card);
  });
}

/* ====== INITIALIZATION ====== */
document.addEventListener("DOMContentLoaded", () => {
  trackVisit();
  renderMenu();
  bindEvents();
  updateUI();
  setupSecretCode();
  addSpecialEffects();
  
  // إضافة الـ CSS الخاص بالتأثيرات
  const style = document.createElement("style");
  style.textContent = `
    .btn-click {
      transform: scale(0.95);
      transition: transform 0.1s ease;
    }
    .pulse {
      animation: pulseAnim 0.5s ease;
    }
    @keyframes pulseAnim {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); text-shadow: 0 0 10px gold; }
    }
    .admin-panel {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: white;
      padding: 25px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      z-index: 10000;
      min-width: 320px;
      max-width: 500px;
      border: 2px solid #ff6b35;
      animation: slideIn 0.3s ease;
    }
    .admin-panel.hidden {
      display: none;
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translate(-50%, -60%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #ff6b35;
      padding-bottom: 10px;
    }
    .admin-header h2 {
      margin: 0;
      font-size: 1.3rem;
    }
    .close-btn {
      background: #ff4444;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transition: 0.2s;
    }
    .close-btn:hover {
      background: #cc0000;
      transform: scale(1.1);
    }
    .stats-grid {
      display: grid;
      gap: 20px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: rgba(255,255,255,0.1);
      padding: 15px;
      border-radius: 15px;
    }
    .stat-card h3 {
      margin: 0 0 10px 0;
      color: #ff6b35;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 1.1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .stat-row span {
      font-weight: bold;
      color: #ffd93d;
    }
    .reset-btn {
      width: 100%;
      padding: 12px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: 0.2s;
    }
    .reset-btn:hover {
      background: #cc0000;
      transform: scale(1.02);
    }
    .fade-in {
      animation: fadeIn 0.5s ease forwards;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  console.log("🐉 كريب التنين - تم التحميل بنجاح ✓");
});