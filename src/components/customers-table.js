import { getUsers } from '../services/store.js';

export function renderCustomersTable(container) {
  const users = getUsers();

  container.innerHTML = `
    <div class="card">
      <h2 class="text-lg font-semibold mb-4">Customers</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="table-header">
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Region</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr class="table-row">
                <td class="px-4 py-3 font-mono text-text-muted">${user.id}</td>
                <td class="px-4 py-3 font-medium">${user.name}</td>
                <td class="px-4 py-3 text-text-secondary">${user.email}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs bg-brand/10 text-brand">${user.region}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
