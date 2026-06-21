import { formatCurrency } from '../utils/formatters.js';

const ICONS = {
  revenue: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  transactions: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
  average: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  customers: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
};

function createCard(icon, title, value, color) {
  return `
    <div class="card flex items-start justify-between">
      <div>
        <p class="text-sm text-text-muted font-medium">${title}</p>
        <p class="text-2xl font-bold mt-1">${value}</p>
      </div>
      <div class="p-3 rounded-xl ${color}">
        ${icon}
      </div>
    </div>
  `;
}

function calculateStats(data) {
  const totalRevenue = data.reduce((sum, sale) => sum + sale.totalValue, 0);
  const totalTransactions = data.length;
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const uniqueCustomers = new Set(data.map(sale => sale.user?.id).filter(Boolean)).size;

  return { totalRevenue, totalTransactions, averageTicket, uniqueCustomers };
}

function render(container, data) {
  const stats = calculateStats(data);

  container.innerHTML = [
    createCard(ICONS.revenue, 'Total Revenue', formatCurrency(stats.totalRevenue), 'bg-brand/10 text-brand'),
    createCard(ICONS.transactions, 'Transactions', stats.totalTransactions.toString(), 'bg-emerald-500/10 text-emerald-500'),
    createCard(ICONS.average, 'Average Ticket', formatCurrency(stats.averageTicket), 'bg-amber-500/10 text-amber-500'),
    createCard(ICONS.customers, 'Unique Customers', stats.uniqueCustomers.toString(), 'bg-violet-500/10 text-violet-500')
  ].join('');
}

export function initStatsCards(container, data) {
  render(container, data);
}

export function updateStatsCards(container, data) {
  render(container, data);
}
