/* ╔══════════════════════════════════════════════════════════════════╗
   ║  Service Worker — Čitamo Njemački!                                 ║
   ║                                                                    ║
   ║  Strategy: cache-first for app shell, network-first for APIs.      ║
   ║  This makes the app load instantly after first visit and work      ║
   ║  offline for the parts that can work offline                       ║
   ║  (OCR still needs network for Tesseract model; translation always  ║
   ║  needs network; TTS and recognition work offline in Chrome).       ║
   ╚══════════════════════════════════════════════════════════════════╝ */

const CACHE_NAME = 'citamo-njemacki-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
];

// Install: pre-cache app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: different strategies for different resource types
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Never cache translation API calls — always fresh
  if (url.hostname.includes('mymemory.translated.net')) {
    return; // let the browser handle normally
  }

  // Never cache Tesseract CDN files (too large; browser handles cache headers)
  if (url.hostname.includes('unpkg.com') || url.hostname.includes('tessdata')) {
    return;
  }

  // For Google Fonts — cache-first
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        }
        return resp;
      }))
    );
    return;
  }

  // For app shell (same origin) — cache-first, fall back to network
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(resp => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
          }
          return resp;
        }).catch(() => caches.match('./index.html'));
      })
    );
    return;
  }
});
