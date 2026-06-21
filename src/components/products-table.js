import { getProducts } from '../services/store.js';
import { formatCurrency } from '../utils/formatters.js';

export function renderProductsTable(container) {
  const products = getProducts();

  container.innerHTML = `
    <div class="card">
      <h2 class="text-lg font-semibold mb-4">Products</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="table-header">
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(product => `
              <tr class="table-row">
                <td class="px-4 py-3 font-mono text-text-muted">${product.id}</td>
                <td class="px-4 py-3 font-medium">${product.name}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500">${product.category}</span>
                </td>
                <td class="px-4 py-3 text-right font-mono">${formatCurrency(product.price)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
