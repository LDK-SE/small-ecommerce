const assert = require('node:assert/strict');
const { products } = require('./productCatalog');

assert.ok(products.length >= 18, 'catalog should include at least 18 products');

const categories = new Set(products.map((product) => product.category));
assert.ok(categories.size >= 6, 'catalog should cover at least 6 categories');

for (const product of products) {
  assert.ok(product.name && product.description, 'product should include name and description');
  assert.ok(product.price >= 19 && product.price <= 8999, `${product.name} price should be realistic`);
  assert.ok(product.stock >= 8 && product.stock <= 300, `${product.name} stock should be realistic`);
  assert.ok(/^https?:\/\//.test(product.imageUrl), `${product.name} should use a valid image URL`);
}

