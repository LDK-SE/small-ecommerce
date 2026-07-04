export function resolveApiBaseUrl(envUrl, locationLike = window.location) {
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/$/, '');
  }

  const protocol = locationLike.protocol || 'http:';
  const hostname = locationLike.hostname || 'localhost';
  const port = locationLike.port || (protocol === 'https:' ? '443' : '80');

  // In development, Vite runs on 5173 while the backend is on 5000.
  const apiPort = port === '5173' || port === '4173' ? '5000' : port;

  return `${protocol}//${hostname}:${apiPort}/api`;
}

