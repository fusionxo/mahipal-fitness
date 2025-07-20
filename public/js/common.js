// public/js/common.js

export const AppState = {
  profile: null,
  workouts: [],
  dailyStats: null,
  foodLogs: [],
  token: null,
  isInitialized: false,
};

export function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast show';
  if (isError) toast.classList.add('error');
  setTimeout(() => toast.classList.remove('show', 'error'), 3000);
}

export function logout() {
  localStorage.removeItem('authToken');
  window.location.href = '/login.html';
}

export async function refreshAppState() {
    if (!AppState.token) return;
    try {
        const response = await fetch('/api/app-data', {
            headers: { 'Authorization': `Bearer ${AppState.token}` }
        });
        if (!response.ok) throw new Error('Failed to refresh app data.');
        
        const data = await response.json();
        AppState.profile = data.profile;
        AppState.workouts = data.workouts;
        AppState.dailyStats = data.dailyStats;
        AppState.foodLogs = data.foodLogs;
        
        // Dispatch a global event to notify all pages that the state has changed.
        document.dispatchEvent(new CustomEvent('app-state-updated'));
        console.log('Global AppState has been refreshed and event dispatched.');

    } catch (error) {
        console.error("Refresh App State Error:", error);
        showToast(error.message, true);
    }
}

export async function initializeApp() {
  AppState.token = localStorage.getItem('authToken');
  if (!AppState.token) {
    if (window.location.pathname !== '/login.html') logout();
    return;
  }
  try {
    await refreshAppState();
    AppState.isInitialized = true;
    document.dispatchEvent(new CustomEvent('app-initialized'));
  } catch (error) {
    console.error("Initialization Error:", error);
    logout();
  }
}

export function setupModal(modalId, openBtnIds = [], closeBtnId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  openBtnIds.forEach(openId => {
    const openBtn = document.getElementById(openId);
    if (openBtn) openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  });
  const closeBtn = document.getElementById(closeBtnId);
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
}
