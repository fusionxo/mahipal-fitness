// public/js/common.js

// Import the function that will re-render the current page
import { renderCurrentPage } from './main.js';

// The base URL for your deployed backend. Replace this with your actual Render URL.
export const API_BASE_URL = 'https://auraflex-app.onrender.com';

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

// This function is now the single source of truth for updating and re-rendering.
export async function updateGlobalState() {
    if (!AppState.token) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/app-data`, {
            headers: { 'Authorization': `Bearer ${AppState.token}` }
        });
        if (!response.ok) throw new Error('Failed to refresh app data.');
        
        const data = await response.json();
        AppState.profile = data.profile;
        AppState.workouts = data.workouts;
        AppState.dailyStats = data.dailyStats;
        AppState.foodLogs = data.foodLogs;
        
        console.log('Global AppState has been refreshed.');

        // Directly call the function to re-render the currently visible page
        if (AppState.isInitialized) {
            renderCurrentPage();
        }

    } catch (error) {
        console.error("Update Global State Error:", error);
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
    await updateGlobalState(); // Use the new function for initialization
    AppState.isInitialized = true;
    document.dispatchEvent(new CustomEvent('app-initialized'));
  } catch (error) {
    console.error("Initialization Error:", error);
    logout();
  }
}
