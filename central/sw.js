// Service worker da Central do Cérebro: só recebe notificações e abre o app ao tocar nelas.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('push', (e) => {
  let d = {}
  try { d = e.data ? e.data.json() : {} } catch { d = { corpo: e.data ? e.data.text() : '' } }
  const tarefas = [self.registration.showNotification(d.titulo || 'Central do Cérebro', {
    body: d.corpo || '', icon: 'icone-192.png', badge: 'icone-192.png', tag: d.tag || 'cerebro', renotify: true,
    data: { url: d.url || './' },
  })]
  if (typeof d.badge === 'number' && self.navigator && self.navigator.setAppBadge) tarefas.push(self.navigator.setAppBadge(d.badge).catch(() => {}))
  e.waitUntil(Promise.all(tarefas))
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = (e.notification.data && e.notification.data.url) || './'
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((janelas) => {
    for (const j of janelas) if ('focus' in j) return j.focus()
    return self.clients.openWindow(url)
  }))
})
