import assert from 'node:assert/strict';
import { formatPrice } from './formatPrice.js';

assert.equal(formatPrice(1299), '¥1,299.00');
assert.equal(formatPrice(89.9), '¥89.90');
assert.equal(formatPrice(''), '¥0.00');

