const CACHE_NAME = 'zap-pwa-v2';
const ASSETS = [
  './',
  'dashboard.html',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(ASSETS.map(async asset => {
      try {
        const response = await fetch(asset, { cache: 'reload' });
        if (response.ok) await cache.put(asset, response);
      } catch (err) {
        console.warn('[sw] Skipped cache asset:', asset, err);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;

    try {
      const networkResponse = await fetch(event.request);
      if (networkResponse && networkResponse.ok && event.request.url.startsWith(self.location.origin)) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResponse.clone()).catch(() => {});
      }
      return networkResponse;
    } catch (err) {
      return caches.match('dashboard.html');
    }
  })());
});

self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data?.text() };
  }

  const title = payload.title || 'Zap';
  const options = {
    body: payload.body || 'You have a new message',
    icon: payload.icon || 'icon-192.png',
    badge: payload.badge || 'icon-192.png',
    tag: payload.tag || 'zap-message',
    data: payload.data || { url: 'dashboard.html' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || 'dashboard.html', self.location.origin).href;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      if ('focus' in client) {
        await client.focus();
        if ('navigate' in client && client.url !== targetUrl) return client.navigate(targetUrl);
        return;
      }
    }
    return clients.openWindow(targetUrl);
  })());
});
