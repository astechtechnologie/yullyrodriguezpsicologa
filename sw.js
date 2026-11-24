/* Serenity 7.1: only offline fallback is cached, never clinical or third-party data. */
const CACHE = 'yully-public-v71-1';
const OFFLINE = '/offline';
self.addEventListener('install', event => event.waitUntil((async()=>{
 const cache = await caches.open(CACHE);
 const response = await fetch(OFFLINE,{cache:'reload'});
 if(!response.ok) throw new Error('Offline page unavailable');
 await cache.put(OFFLINE,response);
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys()) if(key.startsWith('yully-public-') && key!==CACHE) await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const r=event.request;
 if(r.method!=='GET'||r.mode!=='navigate'||new URL(r.url).origin!==self.location.origin)return;
 event.respondWith(fetch(r).catch(async()=> (await caches.match(OFFLINE,{cacheName:CACHE})) || new Response('Sin conexión',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));
});
