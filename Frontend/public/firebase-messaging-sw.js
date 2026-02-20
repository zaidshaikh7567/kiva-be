/* global firebase, importScripts */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Background message received in service worker:', payload);
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
    badge: "/logo.png",
    data: payload.data || {},
    tag: payload.messageId || Date.now().toString(),
    requireInteraction: false,
    // Mobile-specific options
    vibrate: [200, 100, 200],
    silent: false,
  };
  return self.registration.showNotification(payload.notification.title, notificationOptions);
});
