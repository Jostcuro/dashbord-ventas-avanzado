import { init, getDenormalizedSales, getUsers, getProducts } from './services/store.js';
import { initStatsCards, updateStatsCards } from './components/stats-cards.js';
import { initFilterBar, getActiveFilters } from './components/filter-bar.js';
import { initDataTable, updateDataTable } from './components/data-table.js';
import { initChartManager, updateChartManager } from './components/chart-manager.js';
import { initSaleForm } from './components/sale-form.js';
import { renderCustomersTable } from './components/customers-table.js';
import { renderProductsTable } from './components/products-table.js';
import { renderSettingsPanel, initAppName } from './components/settings-panel.js';

const VIEWS = {
  dashboard: { title: 'Dashboard', showAddSale: true },
  customers: { title: 'Customers', showAddSale: false },
  products: { title: 'Products', showAddSale: false },
  settings: { title: 'Settings', showAddSale: false }
};

let currentView = 'dashboard';
let filterContainer = null;
let tableContainer = null;
let statsContainer = null;
let dashboardInitialized = false;

function applyFilters(data) {
  const filters = getActiveFilters(filterContainer);
  return data.filter(sale => {
    if (filters.region && sale.user?.region !== filters.region) return false;
    if (filters.category && sale.product?.category !== filters.category) return false;
    if (filters.dateFrom && sale.date < filters.dateFrom) return false;
    if (filters.dateTo && sale.date > filters.dateTo) return false;
    return true;
  });
}

function refreshDashboard() {
  const allData = getDenormalizedSales();
  const filteredData = applyFilters(allData);
  if (dashboardInitialized) {
    updateStatsCards(statsContainer, filteredData);
    updateDataTable(tableContainer, filteredData);
    updateChartManager(filteredData);
  } else {
    initStatsCards(statsContainer, filteredData);
    initDataTable(tableContainer, filteredData);
    initChartManager(filteredData);
    dashboardInitialized = true;
  }
}

function hideAllViews() {
  document.querySelectorAll('[id^="view-"]').forEach(el => el.classList.add('hidden'));
}

function updateSidebarActive(viewName) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const isActive = link.dataset.view === viewName;
    link.classList.toggle('bg-gray-900', isActive);
    link.classList.toggle('dark:bg-gray-700/50', isActive);
    link.classList.toggle('text-white', isActive);
    link.classList.toggle('font-medium', isActive);
    link.classList.toggle('text-gray-400', !isActive);
    link.classList.toggle('dark:text-gray-400', !isActive);
  });
}

function navigateTo(viewName) {
  if (!VIEWS[viewName]) return;
  currentView = viewName;

  hideAllViews();
  updateSidebarActive(viewName);

  const section = document.getElementById(`view-${viewName}`);
  if (section) section.classList.remove('hidden');

  document.getElementById('page-title').textContent = VIEWS[viewName].title;
  document.getElementById('btn-add-sale').classList.toggle('hidden', !VIEWS[viewName].showAddSale);

  if (viewName === 'dashboard') {
    refreshDashboard();
  } else if (viewName === 'customers') {
    renderCustomersTable(document.getElementById('view-customers'));
  } else if (viewName === 'products') {
    renderProductsTable(document.getElementById('view-products'));
  } else if (viewName === 'settings') {
    renderSettingsPanel(document.getElementById('view-settings'));
  }
}

function initDarkMode() {
  const toggle = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  const saved = localStorage.getItem('theme');

  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    iconSun.classList.remove('hidden');
    iconMoon.classList.add('hidden');
  }

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    iconSun.classList.toggle('hidden', !isDark);
    iconMoon.classList.toggle('hidden', isDark);
    if (currentView === 'dashboard') refreshDashboard();
  });
}

function initNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.view);
    });
  });
}

async function main() {
  const initResult = await init();

  filterContainer = document.getElementById('filter-container');
  tableContainer = document.getElementById('table-container');
  statsContainer = document.getElementById('stats-container');

  initDarkMode();
  initNavigation();
  initAppName();
  initSaleForm();

  const users = getUsers();
  const products = getProducts();

  initFilterBar(filterContainer, {
    users,
    products,
    onFilterChange: () => refreshDashboard()
  });

  navigateTo('dashboard');

  window.addEventListener('store-updated', () => {
    if (currentView === 'dashboard') refreshDashboard();
  });

  window.addEventListener('currency-changed', () => {
    if (currentView === 'dashboard') refreshDashboard();
    if (currentView === 'products') renderProductsTable(document.getElementById('view-products'));
  });

  window.addEventListener('store-error', (e) => {
    console.error('Store error:', e.detail);
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.innerHTML = `
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <svg class="w-12 h-12 mx-auto text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" x2="12" y1="8" y2="12"/>
              <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load data</h2>
            <p class="text-gray-500 dark:text-gray-400">${e.detail}</p>
          </div>
        </div>
      `;
    }
  });
}

document.addEventListener('DOMContentLoaded', main);
