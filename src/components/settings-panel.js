import { setCurrency, getCurrency } from '../utils/formatters.js';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  { code: 'EUR', symbol: '€', name: 'Euro' }
];

function getAppName() {
  return localStorage.getItem('appName') || 'SalesDash';
}

function saveAppName(name) {
  localStorage.setItem('appName', name);
}

export function renderSettingsPanel(container) {
  const currentName = getAppName();
  const currentCurrency = getCurrency();

  container.innerHTML = `
    <div class="card max-w-2xl">
      <h2 class="text-lg font-semibold mb-6">Settings</h2>
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-2">Application Name</label>
          <input
            id="settings-app-name"
            type="text"
            value="${currentName}"
            class="input-field"
            placeholder="Enter application name"
          >
          <p class="text-xs text-text-muted mt-1">Displayed in the sidebar logo</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-2">Preferred Currency</label>
          <select id="settings-currency" class="select-field">
            ${CURRENCIES.map(c => `
              <option value="${c.code}" ${c.code === currentCurrency ? 'selected' : ''}>
                ${c.name} (${c.code})
              </option>
            `).join('')}
          </select>
          <p class="text-xs text-text-muted mt-1">Affects all currency displays in the dashboard</p>
        </div>
      </div>
    </div>
  `;

  const nameInput = container.querySelector('#settings-app-name');
  const currencySelect = container.querySelector('#settings-currency');

  nameInput.addEventListener('input', (e) => {
    const name = e.target.value.trim();
    saveAppName(name || 'SalesDash');
    updateSidebarAppName(name || 'SalesDash');
  });

  currencySelect.addEventListener('change', (e) => {
    setCurrency(e.target.value);
    window.dispatchEvent(new CustomEvent('currency-changed'));
  });
}

function updateSidebarAppName(name) {
  const logoText = document.getElementById('logo-text');
  if (logoText) logoText.textContent = name;
}

export function initAppName() {
  updateSidebarAppName(getAppName());
}
