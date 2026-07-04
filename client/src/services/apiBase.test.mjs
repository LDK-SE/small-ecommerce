import assert from 'node:assert/strict';
import { resolveApiBaseUrl } from './apiBase.js';

assert.equal(
  resolveApiBaseUrl('', { protocol: 'http:', hostname: '192.168.1.20' }),
  'http://192.168.1.20:5000/api'
);

assert.equal(
  resolveApiBaseUrl('https://api.example.com/api', { protocol: 'http:', hostname: 'localhost' }),
  'https://api.example.com/api'
);

