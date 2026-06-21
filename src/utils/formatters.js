let currentCurrency = localStorage.getItem('currency') || 'USD';

const CURRENCY_LOCALES = {
  USD: 'en-US',
  COP: 'es-CO',
  EUR: 'de-DE'
};

export function setCurrency(code) {
  currentCurrency = code;
  localStorage.setItem('currency', code);
}

export function getCurrency() {
  return currentCurrency;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currentCurrency] || 'en-US', {
    style: 'currency',
    currency: currentCurrency,
    minimumFractionDigits: 2
  }).format(value);
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatDateShort(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function getMonthKey(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: '2-digit'
  }).format(date);
}
