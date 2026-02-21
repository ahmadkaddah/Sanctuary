const CACHE_NAME = 'wswas-app-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './icon.svg',
    './audio/_وقل_رب_أعوذ_بك_من_همزات_الشياطين_ياسر_الدوسري_.mp3',
    './audio/وقل_رب_أعوذ_بك_من_همزات_الشياطين_اسلام_صبحب.mp3',
    './audio/وقل_رب_أعوذ_بك_من_همزات_الشياطين_فارس_عباد.mp3',
    './audio/وقل_رب_أعوذ_بك_من_همزات_الشياطين_منصور_السالمي.mp3',
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                });
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
