const store = {
  sales: [],
  users: [],
  products: [],
  _userMap: new Map(),
  _productMap: new Map(),
  _nextId: 1
};

async function init() {
  try {
    const [salesRes, usersRes, productsRes] = await Promise.all([
      fetch('/data/sales.json'),
      fetch('/data/users.json'),
      fetch('/data/products.json')
    ]);

    if (!salesRes.ok || !usersRes.ok || !productsRes.ok) {
      throw new Error('Failed to fetch data');
    }

    store.sales = await salesRes.json();
    store.users = await usersRes.json();
    store.products = await productsRes.json();

    store._userMap = new Map(store.users.map(u => [u.id, u]));
    store._productMap = new Map(store.products.map(p => [p.id, p]));
    store._nextId = store.sales.length + 1;

    dispatchUpdate();
  } catch (error) {
    console.error('Store initialization failed:', error);
    window.dispatchEvent(new CustomEvent('store-error', { detail: error.message }));
  }
}

function dispatchUpdate() {
  window.dispatchEvent(new CustomEvent('store-updated'));
}

function getDenormalizedSales() {
  return store.sales.map(sale => {
    const user = store._userMap.get(sale.userId);
    const product = store._productMap.get(sale.productId);
    return {
      ...sale,
      user,
      product,
      totalValue: sale.quantity * (product?.price || 0)
    };
  });
}

function addSale(saleData) {
  const newId = `s${store._nextId++}`;
  store.sales.push({
    id: newId,
    userId: saleData.userId,
    productId: saleData.productId,
    date: saleData.date,
    quantity: Number(saleData.quantity)
  });
  dispatchUpdate();
}

function getUsers() {
  return store.users;
}

function getProducts() {
  return store.products;
}

function getState() {
  return {
    sales: store.sales,
    users: store.users,
    products: store.products
  };
}

export { init, getDenormalizedSales, addSale, getUsers, getProducts };
