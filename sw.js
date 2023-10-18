//console.log('service worker');
const STATIC = 'staticv1';
const STATIC_LIMIT = 15;
const INMUTABLE = 'inmutablev1';
const DYNAMIC = 'dynamicv1';
const DYNAMIC_LIMIT = 30;
//Todos aquellos recursos propios de la aplicacion
const APP_SHELL = [
    '/',
    '/index.html',
    'css/style.css',
    'img/f1.jpg',
    'pages/offline.html',
    'js/app.js'
]

//TODOS AQUELLOS RECURSOS QUE NUNCA CAMBIAN
const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css'
]
self.addEventListener('install', (e) => {
    //console.log('Instalado');
    const staticCache = caches.open(STATIC).then((cache) => {
        cache.addAll(APP_SHELL);
    });
    const inmutableCache = caches.open(INMUTABLE).then((cache)=>{
        cache.addAll(APP_SHELL_INMUTABLE);
    });
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', (e)=>{
    console.log('Activado');
})

// self.addEventListener('fetch', (e) =>{
//     console.log(e.request);
//     if (e.request.url.includes('f1.jpg'))
//     e.respondWith(fetch('img/sakir.jpg'));
//     else e.respondWith(fetch(e.request));
// })

//metodos
//self.addEventListener('fetch', (e) =>{
    //1. Cache only -- solo hace un fetch al inicio y lo demas desde el cache
    //e.respondWith(caches.match(e.request));
    //2. cache with network fallback  -- si el recurso no esta en el cache va a la red
    // const source = caches.match(e.request).then((res)=>{
    //     if (res) return res;
    //     return fetch(e.request).then(resFetch => {
    //         caches.open(DYNAMIC).then(cache =>{
    //             cache.put(e.request,resFetch);
    //         });
    //         return resFetch.clone();
    //     }); 
    // });
    // e.respondWith(source);
    
    //3. network with cache fallback  -- siempre va a estar actualizada y si no hay va al cache
    // const source = fetch(e.request).then(res=>{
    //     if(!res) throw Error('NotFound');
    //     //checar si el recurso ya existe en algun cache
    //     caches.open(DYNAMIC).then(cache =>{
    //         cache.put(e.request, res);
    //     });
    //     return res.clone();
    // })
    // .catch((err)=>{
    //     return caches.match(e.request);
    // });
    // e.respondWith(source);
    //4.cache with network update
    //rendimiento critico, si el rendimiento es bajo utilizar pero si no toda nuestra aplicacion esta un paso atras
    // if(e.request.url.includes('bootstrap'))
    //     return e.respondWith(caches.match(e.request));
    // const source = caches.open(STATIC).then(cache =>{
    //     fetch(e.request).then(res => {
    //         cache.put(e.request, res);
    //     });
    //     return cache.match(e.request);
    // });
    // e.respondWith(source);
    // if(e.request.url.includes('page2.html')){
    //     e.respondWith(
    //         fetch(e.request).catch(()=>{
    //             return caches.match('/pages/offline.html');
    //         })
    //     );
    //     return;
    // }
    // e.respondWith(
    //     fetch(e.request).then(res => {
    //         if (!res || !res.ok) throw ('No encontrado');
    //         const resClone = res.clone();
    //         caches.open(DYNAMIC).then(cache => {
    //             cache.put(e.request, resClone);
    //         });
    //         return res;
    //     }).catch(err => {
    //         console.warn('error:', err);
    //         return caches.match(e.request);
    //     })
    // )
    //5. cache and network race
//     const source = new Promise((resolve, reject)=>{
//         let rejected = false;
//         const failsOnce = () => {
//             if(rejected){
//                 if(/\.(png|jpg))/i.test(e.request.url)){
//                     resolve(caches.match('./img/not-found.png'));
//                 }if(e.request.url.includes)
//             }else{
//                 rejected = true;
//             }
//         };
//         fetch(e.request)
//             .then((res) => {
//                 res.ok ? resolve(res) : fallback();
//             })
//             .catch(failsOnce);
//             caches.match(e.request).then()
//     })
// });

// self.addEventListener('push', e => {
//     console.log('notificacion push');
// });

// self.addEventListener('sync', e => {
//     console.log('SYNC EVENT');
// });



self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match('/pages/offline.html');
        })
    );
});




  