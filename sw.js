/* 云朵抽盒社 · offline shell */
const CACHE_NAME = "cloudbox-gift-v11";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/favicon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/og-cover.png",
  "./robots.txt",
  "./assets/dimoo/packed-spring.webp",
  "./assets/dimoo/blossom.webp",
  "./assets/dimoo/flying-spring.webp",
  "./assets/dimoo/spring-overhead.webp",
  "./assets/dimoo/hugging-spring.webp",
  "./assets/dimoo/spring-recoil.webp",
  "./assets/dimoo/caught-by-spring.webp",
  "./assets/dimoo/boot.webp",
  "./assets/dimoo/catching-spring.webp",
  "./assets/dimoo/take-me-to-spring.webp",
  "./assets/dimoo/spring-trumpet.webp",
  "./assets/dimoo/falling-into-flowers.webp",
  "./assets/dimoo/sleepy-bunny.webp",
  "./assets/dimoo/duck-leader.webp",
  "./assets/dimoo/light-up.webp",
  "./assets/dimoo/candy-for-you.webp",
  "./assets/dimoo/spring-lights-up.webp",
  "./assets/dimoo/between-dreams.webp",
  "./assets/dimoo/riding-wind.webp",
  "./assets/dimoo/wishwood.webp",
  "./assets/other/molly-classic.webp",
  "./assets/other/molly-little-moon.webp",
  "./assets/other/skullpanda-warmth.webp",
  "./assets/other/skullpanda-day-off.webp",
  "./assets/other/crybaby-bunny.webp",
  "./assets/other/crybaby-bear.webp",
  "./assets/other/crybaby-stolen-heart.webp",
  "./assets/other/crybaby-rose.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html").then((cached) => cached || caches.match("./")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
