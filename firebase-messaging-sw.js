// ⚡ Zap — Firebase Cloud Messaging Service Worker
// Place this file at the ROOT of your project (same level as index.html)

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

// Handle background push messages
messaging.onBackgroundMessage((payload) => {
  console.log('[⚡ Zap SW] Background message received:', payload);

  const notificationTitle = payload.notification?.title || '⚡ Zap';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: 'https://sam3360.github.io/Zap/icon-192.png',
    badge: 'https://sam3360.github.io/Zap/icon-192.png',
    tag: 'zap-message',
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || '/Zap/dashboard.html',
      ...payload.data
    },
    actions: [
      { action: 'open', title: '💬 Open Zap' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/Zap/dashboard.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a Zap tab is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('/Zap/') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Cache strategy for offline support
const CACHE_NAME = 'zap-v1';
const ASSETS_TO_CACHE = [
  '/Zap/',
  '/Zap/index.html',
  '/Zap/dashboard.html',
  '/Zap/manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('[⚡ Zap SW] Installing service worker…');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[⚡ Zap SW] Activating service worker…');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy for Firebase, cache-first for static assets
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) {
    return; // Let Firebase handle its own requests
  }

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
