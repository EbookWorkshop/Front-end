const CACHE_NAME = `ebookworkshop-cache-v3.9.0-α`; // 替换为版本号
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.ts',
  // 添加需要缓存的静态资源路径
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('写入新缓存：', CACHE_NAME);
        cache.addAll(ASSETS)
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
// 激活阶段，清理旧缓存
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});