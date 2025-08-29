const CACHE_NAME = 'rb-taxi-cache-v13_hardfix_20250821103429_btn20250828211916\_v9_20250828212343_v10_20250828213802_topui20250828213809_topui_v11_20250828214131_topui_v11_20250828214132_liquid_v13_20250828214541_liquid_v13_20250828214653_lightfix_v14_20250828220015_lightform_v15_20250828221053_lightform_v15_20250828221054_themefix_v16_20250828221404_lighttext_v17_20250828221752_lighttext_v17_20250828221800_v22_20250829050533";
const ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
