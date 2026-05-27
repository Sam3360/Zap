/* ⚡ Zap - Firebase Cloud Messaging Service Worker */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDeQip7FvQDyiSdiBjNlCJc9MT5fVQcnCc",
  authDomain: "login-21af0.firebaseapp.com",
  projectId: "login-21af0",
  storageBucket: "login-21af0.appspot.com",
  messagingSenderId: "121751642387",
  appId: "1:121751642387:web:6e83c8f559dfb51f0dbae6"
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || '⚡ Zap';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: 'zap-notification',
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Open Zap' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/dashboard.html') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/dashboard.html');
    })
  );
});

// Cache strategy for offline support
const CACHE_NAME = 'zap-cache-v2';
const urlsToCache = ['/', '/index.html', '/dashboard.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(urlsToCache.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
      } catch (err) {
        console.warn('[firebase-messaging-sw] Skipped cache asset:', url, err);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
    ))
  );
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { body: event.data.text() };
  }
  event.waitUntil(self.registration.showNotification(payload.title || 'Zap', {
    body: payload.body || 'You have a new message',
    icon: payload.icon || 'icon-192.png',
    badge: payload.badge || 'icon-192.png',
    tag: payload.tag || 'zap-message',
    data: payload.data || {}
  }));
});
