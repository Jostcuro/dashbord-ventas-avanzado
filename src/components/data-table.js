import { formatCurrency, formatDate } from '../utils/formatters.js';

const PAGE_SIZE = 10;

let currentPage = 1;
let searchText = '';
let currentData = [];

function filterBySearch(data, text) {
  if (!text) return data;
  const lower = text.toLowerCase();
  return data.filter(sale =>
    sale.user?.name?.toLowerCase().includes(lower) ||
    sale.product?.name?.toLowerCase().includes(lower)
  );
}

function renderTable(data) {
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageData = data.slice(start, start + PAGE_SIZE);

  if (pageData.length === 0) {
    return `
      <div class="text-center py-12 text-text-muted">
        <p class="text-lg">No sales found</p>
      </div>
    `;
  }

  return `
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="table-header">
            <th class="px-4 py-3">Customer</th>
            <th class="px-4 py-3">Product</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3">Region</th>
            <th class="px-4 py-3 text-right">Qty</th>
            <th class="px-4 py-3 text-right">Price</th>
            <th class="px-4 py-3 text-right">Total</th>
            <th class="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          ${pageData.map(sale => `
            <tr class="table-row">
              <td class="px-4 py-3 font-medium">${sale.user?.name || 'N/A'}</td>
              <td class="px-4 py-3">${sale.product?.name || 'N/A'}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800">${sale.product?.category || 'N/A'}</span>
              </td>
              <td class="px-4 py-3">${sale.user?.region || 'N/A'}</td>
              <td class="px-4 py-3 text-right">${sale.quantity}</td>
              <td class="px-4 py-3 text-right font-mono text-text-muted">${formatCurrency(sale.product?.price || 0)}</td>
              <td class="px-4 py-3 text-right font-mono font-semibold">${formatCurrency(sale.totalValue)}</td>
              <td class="px-4 py-3 text-text-muted">${formatDate(sale.date)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderPagination(data) {
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  if (totalPages <= 1) return '';

  return `
    <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
      <p class="text-sm text-text-muted">
        Showing ${Math.min((currentPage - 1) * PAGE_SIZE + 1, data.length)} to ${Math.min(currentPage * PAGE_SIZE, data.length)} of ${data.length} entries
      </p>
      <div class="flex gap-2">
        <button id="page-prev" class="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50" ${currentPage === 1 ? 'disabled' : ''}>
          Previous
        </button>
        ${Array.from({ length: totalPages }, (_, i) => `
          <button data-page="${i + 1}" class="px-3 py-1 text-sm rounded-lg border ${currentPage === i + 1 ? 'bg-brand text-white border-brand' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'} transition-colors">
            ${i + 1}
          </button>
        `).join('')}
        <button id="page-next" class="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50" ${currentPage === totalPages ? 'disabled' : ''}>
          Next
        </button>
      </div>
    </div>
  `;
}

export function initDataTable(container, data) {
  currentData = data;
  currentPage = 1;

  container.innerHTML = `
    <div class="p-4 border-b border-gray-100 dark:border-gray-800">
      <input id="table-search" type="text" placeholder="Search by customer or product..." class="input-field text-sm max-w-sm">
    </div>
    <div id="table-body"></div>
    <div id="table-pagination"></div>
  `;

  container.querySelector('#table-search').addEventListener('input', (e) => {
    searchText = e.target.value;
    currentPage = 1;
    render(container);
  });

  render(container);

  return { update: (newData) => updateDataTable(container, newData) };
}

function render(container) {
  const filtered = filterBySearch(currentData, searchText);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  const tableBody = container.querySelector('#table-body');
  const paginationEl = container.querySelector('#table-pagination');

  if (tableBody) tableBody.innerHTML = renderTable(filtered);
  if (paginationEl) paginationEl.innerHTML = renderPagination(filtered);

  const prevBtn = container.querySelector('#page-prev');
  const nextBtn = container.querySelector('#page-next');

  if (prevBtn) prevBtn.addEventListener('click', () => { currentPage--; render(container); });
  if (nextBtn) nextBtn.addEventListener('click', () => { currentPage++; render(container); });

  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      render(container);
    });
  });
}

export function updateDataTable(container, data) {
  currentData = data;
  if (currentPage > Math.ceil(data.length / PAGE_SIZE)) {
    currentPage = 1;
  }
  render(container);
}
