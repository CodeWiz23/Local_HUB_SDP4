/**
 * LocalHub Main Application Controller & Dynamic UI Engine
 * Modular JavaScript - Powered by Firebase Auth and Cloud Firestore
 */

import {
  signUpUser,
  signInUser,
  signOutUser,
  subscribeAuthState,
  getCurrentUser,
  getCustomerProfile,
  updateCustomerProfile,
  getProviderProfile,
  updateProviderProfile,
  getServices,
  getSupplyItems,
  createService,
  createSupply,
  createOrder,
  listenToActiveOrders,
  updateOrderStatus,
  submitReview,
  getAllReviews,
  getReviewsForProvider,
  markOrderDispatchedForDelivery,
  markCustomerReceivedPendingConfirmation,
  manualConfirmDeliveryByDeliveryman,
  getProviderManpowerRoster,
  updateCrewMemberStatus,
  simulateOperationsTick,
  getDeliveryRiders,
  updateDeliveryRiderStatus,
  INITIAL_DELIVERY_RIDERS,
  getDecorSchedule,
  saveDecorScheduleItem,
  deleteDecorScheduleItem,
  updateDecorScheduleStatus,
  getWebsiteReviews,
  submitWebsiteReview,
  listenToWebsiteReviews,
  INITIAL_WEBSITE_REVIEWS,
  INITIAL_FEATURED_REVIEWS
} from "./firebase-config.js";

/**
 * Global Store Bridge
 */
export const LocalHubStore = {
  getCurrentUser() {
    return getCurrentUser();
  },

  async registerUser(name, email, password, role) {
    return await signUpUser(email, password, name, role);
  },

  async loginUser(email, password) {
    return await signInUser(email, password);
  },

  logout() {
    signOutUser();
  },

  async getCustomerProfile(uid) {
    return await getCustomerProfile(uid);
  },

  async updateCustomerProfile(uid, data) {
    return await updateCustomerProfile(uid, data);
  },

  async getProviderProfile(uid) {
    return await getProviderProfile(uid);
  },

  async updateProviderProfile(uid, data) {
    return await updateProviderProfile(uid, data);
  },

  async getServices() {
    return await getServices();
  },

  async getSupplyItems() {
    return await getSupplyItems();
  },

  async createService(serviceData) {
    return await createService(serviceData);
  },

  async createSupply(supplyData) {
    return await createSupply(supplyData);
  },

  async createBooking(orderPayload) {
    return await createOrder(orderPayload);
  },

  listenToOrders(user, callback) {
    return listenToActiveOrders(user, callback);
  },

  async updateBookingStatus(orderId, status, providerUid) {
    return await updateOrderStatus(orderId, status, providerUid);
  },

  async submitReview(orderId, customerId, providerId, rating, reviewText, tags, authorName, serviceTitle) {
    return await submitReview(orderId, customerId, providerId, rating, reviewText, tags, authorName, serviceTitle);
  },

  async getAllReviews() {
    return await getAllReviews();
  },

  async getReviewsForProvider(providerId) {
    return await getReviewsForProvider(providerId);
  },

  async markOrderDispatched(orderId, deliverymanInfo) {
    return await markOrderDispatchedForDelivery(orderId, deliverymanInfo);
  },

  async markCustomerReceived(orderId) {
    return await markCustomerReceivedPendingConfirmation(orderId);
  },

  async manualConfirmDelivery(orderId, notes, deliverymanUid) {
    return await manualConfirmDeliveryByDeliveryman(orderId, notes, deliverymanUid);
  },

  getManpowerRoster() {
    return getProviderManpowerRoster();
  },

  getDeliveryRiders() {
    return getDeliveryRiders();
  },

  updateDeliveryRiderStatus(riderId, newStatus, currentOrderNumber) {
    return updateDeliveryRiderStatus(riderId, newStatus, currentOrderNumber);
  },

  getProviderManpower() {
    return getProviderManpowerRoster();
  },

  updateCrewMemberStatus(crewId, newStatus, currentJobId) {
    return updateCrewMemberStatus(crewId, newStatus, currentJobId);
  },

  updateCrewStatus(crewId, status, currentJobId) {
    return updateCrewMemberStatus(crewId, status, currentJobId);
  },

  simulateTick() {
    return simulateOperationsTick();
  },

  simulateOperationsTick() {
    return simulateOperationsTick();
  },

  getDecorSchedule() {
    return getDecorSchedule();
  },

  saveDecorScheduleItem(item) {
    return saveDecorScheduleItem(item);
  },

  deleteDecorScheduleItem(id) {
    return deleteDecorScheduleItem(id);
  },

  updateDecorScheduleStatus(id, newStatus) {
    return updateDecorScheduleStatus(id, newStatus);
  },

  getWebsiteReviews() {
    return getWebsiteReviews();
  },

  submitWebsiteReview(data) {
    return submitWebsiteReview(data);
  },

  listenToWebsiteReviews(callback) {
    return listenToWebsiteReviews(callback);
  },

  initialWebsiteReviews: INITIAL_WEBSITE_REVIEWS
};

/**
 * Toast Notification Utility
 */
export function showToastNotification(message, type = "success") {
  const existing = document.querySelector(".lh-toast-banner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.className = `lh-toast-banner alert alert-${type === "success" ? "success" : "info"} pulse-glow`;
  banner.style.position = "fixed";
  banner.style.bottom = "20px";
  banner.style.right = "20px";
  banner.style.zIndex = "9999";
  banner.style.maxWidth = "380px";
  banner.style.boxShadow = "var(--shadow-xl)";
  banner.style.marginBottom = "0";

  banner.innerHTML = `
    <span style="font-size: 1.25rem">${type === 'success' ? '✔' : 'ℹ'}</span>
    <div>
      <strong style="display: block; font-size: 0.85rem">${type === 'success' ? 'Success' : 'Notice'}</strong>
      <span style="font-size: 0.8rem">${message}</span>
    </div>
  `;

  document.body.appendChild(banner);
  setTimeout(() => {
    banner.style.opacity = "0";
    banner.style.transition = "opacity 0.5s ease";
    setTimeout(() => banner.remove(), 500);
  }, 4000);
}

/**
 * Navigation Bar UI Handler
 */
export function setupNavbarUI() {
  const user = getCurrentUser();
  const navAuthActions = document.getElementById("navAuthActions");

  if (navAuthActions) {
    if (user) {
      let dashboardUrl = "./customer.html";
      let roleLabel = "Customer Portal";
      let roleBadgeColor = "#10b981";
      let extraRoleNav = "";

      if (user.role === "provider") {
        dashboardUrl = "./provider.html";
        roleLabel = "Provider Hub";
        roleBadgeColor = "#6366f1";
      } else if (user.role === "delivery") {
        dashboardUrl = "./delivery.html";
        roleLabel = "Delivery Fleet";
        roleBadgeColor = "#f59e0b";
        extraRoleNav = `<a href="./delivery.html" class="nav-item ${window.location.pathname.includes('delivery') ? 'active-nav' : ''}">Fleet Queue</a>`;
      }

      navAuthActions.innerHTML = `
        <a href="./customer.html" class="nav-item ${window.location.pathname.includes('customer') ? 'active-nav' : ''}">Shop Catalog</a>
        ${extraRoleNav}
        <a href="${dashboardUrl}" class="nav-item ${window.location.pathname.includes(dashboardUrl.replace('./','')) ? 'active-nav' : ''}" style="font-weight: 700; color: ${roleBadgeColor};">${roleLabel}</a>
        <div class="user-badge" title="Role: ${user.role}">
          <div class="user-dot" style="background-color: ${roleBadgeColor}"></div>
          <span>${user.name || user.email}</span>
        </div>
        <button id="logoutBtn" class="btn btn-sm btn-outline">Logout</button>
      `;

      document.getElementById("logoutBtn")?.addEventListener("click", () => {
        signOutUser();
      });
    } else {
      navAuthActions.innerHTML = `
        <a href="./customer.html" class="nav-item">Explore Services</a>
        <a href="./auth.html?tab=login" class="nav-item">Sign In</a>
        <a href="./auth.html?tab=register" class="btn btn-sm btn-primary">Join Marketplace</a>
      `;
    }
  }
}

/**
 * Search & Recent Query Storage Manager
 */
export function saveRecentSearch(query) {
  if (!query || !query.trim()) return;
  const clean = query.trim();
  let searches = getRecentSearches();
  searches = searches.filter(s => s.toLowerCase() !== clean.toLowerCase());
  searches.unshift(clean);
  searches = searches.slice(0, 5);
  localStorage.setItem("lh_recent_searches", JSON.stringify(searches));
}

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem("lh_recent_searches") || "[]");
  } catch (e) {
    return [];
  }
}

export function clearRecentSearches() {
  localStorage.removeItem("lh_recent_searches");
  document.querySelectorAll(".recent-searches-dropdown").forEach(d => d.style.display = "none");
}

export function attachRecentSearchesDropdown(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const parent = input.parentElement;
  if (!parent) return;

  parent.style.position = "relative";

  let dropdown = parent.querySelector(".recent-searches-dropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.className = "recent-searches-dropdown";
    parent.appendChild(dropdown);
  }

  const renderDropdownContent = () => {
    const searches = getRecentSearches();
    if (searches.length === 0) {
      dropdown.style.display = "none";
      return;
    }

    dropdown.innerHTML = `
      <div class="recent-searches-title">
        <span>🕒 Recent Searches</span>
        <button type="button" onclick="window.clearRecentSearches()" style="background: none; border: none; color: var(--emerald-400); font-size: 0.65rem; cursor: pointer;">Clear All</button>
      </div>
      ${searches.map(term => `
        <div class="recent-search-item" data-term="${term}">
          <span>🔍 ${term}</span>
          <small style="color: var(--slate-400); font-size: 0.7rem;">Click to search</small>
        </div>
      `).join("")}
    `;

    dropdown.querySelectorAll(".recent-search-item").forEach(item => {
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const term = item.getAttribute("data-term");
        input.value = term;
        dropdown.style.display = "none";
        saveRecentSearch(term);
        window.location.href = `./customer.html?search=${encodeURIComponent(term)}`;
      });
    });

    dropdown.style.display = "block";
  };

  input.addEventListener("focus", () => {
    renderDropdownContent();
  });

  input.addEventListener("blur", () => {
    setTimeout(() => {
      dropdown.style.display = "none";
    }, 200);
  });
}

/**
 * Theme Manager (Dark Mode / Light Mode)
 */
export function initTheme() {
  const savedTheme = localStorage.getItem("lh_theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  updateThemeToggleButtons();
}

export function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("lh_theme", isDark ? "dark" : "light");
  updateThemeToggleButtons();
  showToastNotification(`Theme switched to ${isDark ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`);
}

function updateThemeToggleButtons() {
  const isDark = document.body.classList.contains("dark-mode");
  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    btn.innerHTML = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
}

/**
 * Search Handler Utilities for Homepage & Navbar
 */
window.handleHeroSearch = function () {
  const query = document.getElementById("heroSearchQuery")?.value.trim() || "";
  const category = document.getElementById("heroSearchCategory")?.value || "all";
  if (query) {
    saveRecentSearch(query);
  }
  window.location.href = `./customer.html?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
};

window.handleNavbarSearch = function (event) {
  event?.preventDefault();
  const query = document.getElementById("navbarSearchInput")?.value.trim() || "";
  if (query) {
    saveRecentSearch(query);
  }
  window.location.href = `./customer.html?search=${encodeURIComponent(query)}`;
};

// Global Initialization
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupNavbarUI();
  subscribeAuthState((user) => {
    setupNavbarUI();
  });

  attachRecentSearchesDropdown("navbarSearchInput");
  attachRecentSearchesDropdown("heroSearchQuery");
});

window.addEventListener("storage", () => {
  setupNavbarUI();
  initTheme();
});

// Attach to window object
window.LocalHubStore = LocalHubStore;
window.showToastNotification = showToastNotification;
window.setupNavbarUI = setupNavbarUI;
window.saveRecentSearch = saveRecentSearch;
window.getRecentSearches = getRecentSearches;
window.clearRecentSearches = clearRecentSearches;
window.initTheme = initTheme;
window.toggleTheme = toggleTheme;
