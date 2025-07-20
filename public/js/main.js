import { AppState, initializeApp } from './common.js';

const pageContent = document.getElementById('page-content');
const headerTitle = document.getElementById('header-title');
const navLinksDesktop = document.querySelectorAll('.nav-item-desktop');
const navLinksMobile = document.querySelectorAll('.nav-item');

let currentPageName = 'home'; // Keep track of the current page
const pageInitializers = {};

const pageTitles = {
  home: 'Home',
  workout: 'Workout Dashboard',
  food: 'Nutrition Search',
  settings: 'Settings',
  profile: 'Your Profile'
};

// This function can be called from anywhere to re-render the current page's content
export function renderCurrentPage() {
    if (pageInitializers[currentPageName]) {
        console.log(`Re-rendering page: ${currentPageName}`);
        pageInitializers[currentPageName]();
    }
}

async function loadPageScript(pageName) {
  try {
    const pageModule = await import(`./pages/${pageName}.js`);
    if (pageModule.default && typeof pageModule.default === 'function') {
      pageInitializers[pageName] = pageModule.default;
      pageInitializers[pageName](); // Initial render
    }
  } catch (error) {
    console.error(`Error loading script for ${pageName}:`, error);
  }
}

async function showPage(pageName) {
  currentPageName = pageName || 'home'; // Update the current page name
  try {
    const htmlRes = await fetch(`/pages/${currentPageName}.html`);
    if (!htmlRes.ok) throw new Error(`Could not load page: ${currentPageName}`);
    const html = await htmlRes.text();
    pageContent.innerHTML = html;
    if (headerTitle && pageTitles[currentPageName]) headerTitle.textContent = pageTitles[currentPageName];
    
    updateActiveNav(currentPageName);
    await loadPageScript(currentPageName);
  } catch(e) {
    console.error('Failed to load page:', e);
    pageContent.innerHTML = `<div class="text-red-500 text-center py-10">Error: Could not load the page.</div>`;
    if (headerTitle) headerTitle.textContent = 'Error';
  }
}

function updateActiveNav(pageName) {
  const activePage = pageName === 'profile' ? '' : pageName;
  navLinksDesktop.forEach(link => link.classList.toggle('active', link.getAttribute('data-page') === activePage));
  navLinksMobile.forEach(link => link.classList.toggle('active', link.getAttribute('data-page') === activePage));
}

function handleNavClick(e) {
  e.preventDefault();
  const pageName = e.currentTarget.getAttribute('data-page') || 'home';
  window.history.pushState({page: pageName}, '', `#${pageName}`);
  showPage(pageName);
}

// --- INITIALIZATION ---
navLinksDesktop.forEach(link => link.addEventListener('click', handleNavClick));
navLinksMobile.forEach(link => link.addEventListener('click', handleNavClick));

document.addEventListener('app-initialized', () => {
  const headerAvatar = document.getElementById('header-avatar-img');
  if (AppState.profile && AppState.profile.avatar) {
      headerAvatar.src = AppState.profile.avatar;
  }
  document.getElementById('profile-avatar-btn').addEventListener('click', () => {
      showPage('profile');
  });
  
  const initialPage = window.location.hash.replace('#', '') || 'home';
  showPage(initialPage);
});

window.addEventListener('popstate', (event) => {
  const pageName = (event.state && event.state.page) ? event.state.page : 'home';
  showPage(pageName);
});

if (window.location.pathname !== '/login.html') {
  initializeApp();
}
