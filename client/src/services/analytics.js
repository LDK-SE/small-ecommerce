import { resolveApiBaseUrl } from './apiBase.js';

const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
const QUEUE_KEY = 'analyticsQueue';
const FLUSH_INTERVAL_MS = 30000;
const MAX_QUEUE_SIZE = 200;

function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

function setQueue(queue) {
  if (queue.length > MAX_QUEUE_SIZE) {
    console.warn('[analytics] Queue exceeded limit, oldest events dropped.');
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE_SIZE)));
}

export function trackEvent(name, payload = {}) {
  const event = {
    name,
    payload,
    at: new Date().toISOString()
  };

  const queue = getQueue();
  queue.push(event);
  setQueue(queue);
}

export async function flush() {
  const queue = getQueue();
  if (queue.length === 0) return;

  try {
    const response = await fetch(`${API_BASE_URL}/analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: queue })
    });

    if (response.ok) {
      localStorage.removeItem(QUEUE_KEY);
    }
  } catch {
    // Silently fail - analytics should never break the app
  }
}

// Auto-flush on interval
let flushTimer = null;

export function startAutoFlush() {
  if (flushTimer) return;
  flushTimer = window.setInterval(flush, FLUSH_INTERVAL_MS);
}

export function stopAutoFlush() {
  if (flushTimer) {
    window.clearInterval(flushTimer);
    flushTimer = null;
  }
}

// Flush on page unload
let beforeUnloadBound = false;

function bindUnload() {
  if (beforeUnloadBound || typeof window === 'undefined') return;
  beforeUnloadBound = true;
  window.addEventListener('beforeunload', () => {
    const queue = getQueue();
    if (queue.length === 0) return;
    navigator.sendBeacon(`${API_BASE_URL}/analytics/events`, JSON.stringify({ events: queue }));
    localStorage.removeItem(QUEUE_KEY);
  });
}

export function init() {
  bindUnload();
  startAutoFlush();
}
