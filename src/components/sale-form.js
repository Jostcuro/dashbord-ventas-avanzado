import { getUsers, getProducts, addSale } from '../services/store.js';
import { formatCurrency } from '../utils/formatters.js';

function populateDropdowns() {
  const userSelect = document.getElementById('form-user');
  const productSelect = document.getElementById('form-product');

  const users = getUsers();
  const products = getProducts();

  userSelect.innerHTML = `
    <option value="">Select customer</option>
    ${users.map(u => `<option value="${u.id}">${u.name} (${u.region})</option>`).join('')}
  `;

  productSelect.innerHTML = `
    <option value="">Select product</option>
    ${products.map(p => `<option value="${p.id}">${p.name} - ${formatCurrency(p.price)}</option>`).join('')}
  `;
}

export function initSaleForm() {
  const overlay = document.getElementById('modal-overlay');
  const form = document.getElementById('sale-form');
  const btnAdd = document.getElementById('btn-add-sale');
  const btnClose = document.getElementById('btn-close-modal');
  const btnCancel = document.getElementById('btn-cancel');

  function openModal() {
    populateDropdowns();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('form-date').value = today;
    document.getElementById('form-quantity').value = 1;
    overlay.classList.remove('hidden');
  }

  function closeModal() {
    overlay.classList.add('hidden');
    form.reset();
  }

  btnAdd.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const saleData = {
      userId: document.getElementById('form-user').value,
      productId: document.getElementById('form-product').value,
      quantity: document.getElementById('form-quantity').value,
      date: document.getElementById('form-date').value
    };

    if (!saleData.userId || !saleData.productId || !saleData.quantity || !saleData.date) {
      return;
    }

    addSale(saleData);
    closeModal();
  });

  window.addEventListener('currency-changed', () => {
    if (!overlay.classList.contains('hidden')) {
      populateDropdowns();
    }
  });

  return { open: openModal, close: closeModal };
}
