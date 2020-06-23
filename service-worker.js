/*console.log('Service worker registered !');
self.addEventListener('push', e => {
  const data = e.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    actions: [
      { action: 'like', title: 'Like' },
      { action: 'reply', title: 'Reply' }
    ]
  });
});*/

const cacheVersion = 'v6';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheVersion)
      .then(function(cache) {
        return cache.addAll([
          '/index.html',
          '/src/app.js',
          '/src/firebase.js',
          '/src/views/home.js',
          '/src/views/restaurant.js',
          '/src/views/settings.js',
          '/src/actions/restaurantCardAction.js',
          '/src/actions/searchAction.js',
          '/src/actions/network.js',
          '/src/actions/localStorageAction.js',
          '/src/views/favorites.js',
          '/src/views/signIn.js',
          '/assets/styles/main.css',
          '/manifest.json',
          '/assets/images/icon.ico',
          '/assets/images/logo.webp',
          '/assets/images/manifest/icon-192x192.png',
          '/assets/images/manifest/icon-512x512.png',
          '/config.js',
          '/node_modules/es-dev-server',
          '/node_modules/@firebase/firestore/dist/index.esm.js'
        ])
      })
  );
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  const link = `${url.origin}${url.pathname}`;

  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          return response || fetch(event.request)
            .then(function (response) {
              const responseClone = response.clone();
              caches.open(cacheVersion)
                .then(function (cache) {
                  if(!(event.request.url.indexOf('http') === 0)){
                    //skip request
                  }else{
                    cache.put(event.request, responseClone);
                  }
                });

              return response;
            })
        })
        .catch(function () {
          return caches.match('index.html');
        })
    )
  }
});