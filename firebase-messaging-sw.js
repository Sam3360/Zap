// ⚡ Zap service worker — offline cache + notification click handling
try {
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
  firebase.messaging().onBackgroundMessage(p => {
    self.registration.showNotification(p.notification?.title || '⚡ Zap', {
      body: p.notification?.body || 'New message', icon: 'icon-192.png'
    });
  });
} catch (e) { /* offline install is fine */ }

const CACHE = 'zap-v4';
const ASSETS = ['./', './index.html', './dashboard.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); return res;
  }).catch(() => caches.match(r)));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(l =>
    l.length ? l[0].focus() : clients.openWindow('./dashboard.html')));
});
