/* global firebase, importScripts */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDo8CSm72wDwJPTWXneJ0-g3FdGw4w7O-s",
  authDomain: "kiva-diamond-f2c8a.firebaseapp.com",
  projectId: "kiva-diamond-f2c8a",
  messagingSenderId: "168324678431",
  appId: "1:168324678431:web:fcc96378cdfbf2c3bf262a",
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
