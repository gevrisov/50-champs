// 50 Champs service worker: shows war notifications and opens the dashboard on tap.
// No offline caching, so the site never serves a stale version.
const UA = self.navigator.userAgent || "";
// Apple requires every push to show a visible notification, otherwise it may revoke push for the site.
const MUST_SHOW = /iPhone|iPad|iPod/.test(UA) || (/Safari/.test(UA) && !/Chrome|Chromium|CriOS|Edg|Firefox|FxiOS/.test(UA));

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { title: "50 Champs", body: event.data ? event.data.text() : "" }; }
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    windows.forEach((client) => client.postMessage({ type: "war-push", data }));
    // The site is open and in front: the page updates itself instead of a pop-up.
    if (!MUST_SHOW && windows.some((client) => client.focused)) return;
    await self.registration.showNotification(data.title || "50 Champs", {
      body: data.body || "",
      tag: data.tag || "50champs",
      icon: "/icon-192.png",
      badge: "/badge-96.png",
      data: { url: data.url || "/dashboard.html" },
    });
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || "/dashboard.html", self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const open = windows.find((client) => client.url.includes("/dashboard.html"));
    if (open) {
      await open.focus();
      open.postMessage({ type: "open-url", url });
      return;
    }
    await self.clients.openWindow(url);
  })());
});
