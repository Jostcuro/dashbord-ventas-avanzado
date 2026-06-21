export function initFilterBar(container, { users, products, onFilterChange }) {
  const regions = [...new Set(users.map(u => u.region))].sort();
  const categories = [...new Set(products.map(p => p.category))].sort();

  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label class="block text-xs font-medium text-text-muted mb-1">Region</label>
        <select id="filter-region" class="select-field text-sm">
          <option value="">All Regions</option>
          ${regions.map(r => `<option value="${r}">${r}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-text-muted mb-1">Category</label>
        <select id="filter-category" class="select-field text-sm">
          <option value="">All Categories</option>
          ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-text-muted mb-1">Date From</label>
        <input id="filter-date-from" type="date" class="input-field text-sm">
      </div>
      <div>
        <label class="block text-xs font-medium text-text-muted mb-1">Date To</label>
        <input id="filter-date-to" type="date" class="input-field text-sm">
      </div>
      <div class="flex items-end">
        <button id="filter-reset" class="btn-secondary text-sm w-full">Reset Filters</button>
      </div>
    </div>
  `;

  const getFilters = () => ({
    region: container.querySelector('#filter-region').value,
    category: container.querySelector('#filter-category').value,
    dateFrom: container.querySelector('#filter-date-from').value,
    dateTo: container.querySelector('#filter-date-to').value
  });

  const handleChange = () => {
    onFilterChange(getFilters());
  };

  container.querySelector('#filter-region').addEventListener('change', handleChange);
  container.querySelector('#filter-category').addEventListener('change', handleChange);
  container.querySelector('#filter-date-from').addEventListener('change', handleChange);
  container.querySelector('#filter-date-to').addEventListener('change', handleChange);

  container.querySelector('#filter-reset').addEventListener('click', () => {
    container.querySelector('#filter-region').value = '';
    container.querySelector('#filter-category').value = '';
    container.querySelector('#filter-date-from').value = '';
    container.querySelector('#filter-date-to').value = '';
    handleChange();
  });

  return { getFilters };
}

export function getActiveFilters(container) {
  return {
    region: container.querySelector('#filter-region')?.value || '',
    category: container.querySelector('#filter-category')?.value || '',
    dateFrom: container.querySelector('#filter-date-from')?.value || '',
    dateTo: container.querySelector('#filter-date-to')?.value || ''
  };
}
