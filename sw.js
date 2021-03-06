const NAME = 'cache-v2'

const FILES = [
    './index.html',
    './style.css',
    './js/script.js',
    './js/assets.js',
    './js/create-game.js',
    './js/create-modal.js',
    './server.js',
    './icons/icon-64.png',
    './icons/icon-128.png',
    './icons/icon-256.png',
    './icons/icon-512.png'
]

self.addEventListener("install", ev => {
    ev.waitUntil(
        caches.open(NAME)
            .then(cache => cache.addAll(FILES))
    )
    self.skipWaiting()
})

self.addEventListener("activate", ev => {
    ev.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== NAME) {
                        return caches.delete(key)
                    }
                })
            )
        })
    )
    self.clients.claim()
})

self.addEventListener('fetch', ev => {
    ev.respondWith(
        fetch(ev.request)
            .then(res => {
                let cacheClone = res.clone()
                caches.open(NAME).then(cache => {
                    cache.put(ev.request, cacheClone)
                        .catch(er => er)
                })
                return res
            })
            .catch(() => caches.match(ev.request).then(res => res))
    )
})