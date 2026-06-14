const CACHE_NAME = 'devtools-v1'

const STATIC_ASSETS = [
  '/',
  '/json-formatter',
  '/jwt-debugger',
  '/cron-builder',
  '/base64',
  '/color-palette',
  '/sql-formatter',
  '/uuid-generator',
  '/url-encoder',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone())
          return response
        })
      })
    })
  )
})
