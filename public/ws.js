/* global caches, fetch, self */

const cacheName = 'flex-v24'
const contentToCache = [
  '/',
  '/index.html',
  '/assets/style.css?v=20260917',
  '/assets/images/512.png?v=20260917',
  '/assets/app.js?v=20260917',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css'
]

self.addEventListener('install', function (e) {
  console.log('[Service Worker] Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[Service Worker] Caching all: app shell and content')
      return cache.addAll(contentToCache)
    })
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList
          .filter((key) => cacheName.indexOf(key) === -1)
          .map((key) => caches.delete(key))
      )
    })
  )
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      console.log('[Service Worker] Fetching resource: ' + e.request.url)
      return r || fetch(e.request).then(function (response) {
        return caches.open(cacheName).then(function (cache) {
          console.log('[Service Worker] Caching new resource: ' + e.request.url)
          cache.put(e.request, response.clone())
          return response
        })
      })
    })
  )
})
