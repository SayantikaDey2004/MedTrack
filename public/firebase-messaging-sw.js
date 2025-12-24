// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBiRPdlw7rxkF6RxrgKXVW9vnkyAi6T08o",
  authDomain: "medtrack-v1.firebaseapp.com",
  projectId: "medtrack-v1",
  storageBucket: "medtrack-v1.firebasestorage.app",
  messagingSenderId: "612758487816",
  appId: "1:612758487816:web:a6d7129bea286a1ecb62bd",
  measurementId: "G-NQCDPLZ7NS"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'MedTrack';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: 'medtrack-notification',
    requireInteraction: true,
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // If not, open a new window
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});
