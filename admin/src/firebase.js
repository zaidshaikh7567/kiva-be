// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported as isMessagingSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDo8CSm72wDwJPTWXneJ0-g3FdGw4w7O-s",
  authDomain: "kiva-diamond-f2c8a.firebaseapp.com",
  projectId: "kiva-diamond-f2c8a",
  messagingSenderId: "168324678431",
  appId: "1:168324678431:web:fcc96378cdfbf2c3bf262a",
};

const app = initializeApp(firebaseConfig);

// Lazy initialization of messaging to avoid errors in unsupported browsers
let messagingInstance = null;

/**
 * Get messaging instance (lazy initialization)
 * @returns {Promise<Object|null>} - Firebase messaging instance or null if not supported
 */
export const getMessagingInstance = async () => {
  // Check if already initialized
  if (messagingInstance) {
    return messagingInstance;
  }

  // Check if browser supports messaging
  try {
    // Check if required APIs are available
    if (typeof window === 'undefined') {
      console.warn('Window object is not available');
      return null;
    }

    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported');
      return null;
    }

    // Check Firebase messaging support
    const supported = await isMessagingSupported();
    if (!supported) {
      console.warn('Firebase Cloud Messaging is not supported in this browser');
      return null;
    }

    // Initialize messaging only if supported
    try {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    } catch (error) {
      console.error('Error initializing Firebase messaging:', error);
      return null;
    }
  } catch (error) {
    console.error('Error checking messaging support:', error);
    return null;
  }
};

// Export null for backward compatibility (will be set when getMessagingInstance is called)
export const messaging = null;

export const requestNotificationPermission = async () => {
  // Check current permission status
  let permission = Notification.permission;
  console.log('Current notification permission:', permission);

  // Check if we're on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  console.log('Device info:', { isMobile, isIOS, userAgent: navigator.userAgent });

  // Only request if permission is default
  if (permission === "default") {
    console.log('Requesting notification permission...');
    try {
      permission = await Notification.requestPermission();
      console.log('Permission result:', permission);
    } catch (permError) {
      console.error('Error requesting permission:', permError);
      // On iOS, permission might need user interaction
      if (isIOS) {
        console.warn('iOS requires user interaction for notification permission');
      }
      return null;
    }
  }

  if (permission === "granted") {
    try {
      // Get service worker registration
      let registration;
      try {
        // Try to get existing registration first
        registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
        
        if (!registration) {
          console.log('Service worker not found, registering...');
          // Register service worker - use root path for better mobile compatibility
          registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
          });
          console.log('Service worker registered:', registration);
          
          // Wait for service worker to be ready (important for mobile)
          await registration.update();
          await navigator.serviceWorker.ready;
        } else {
          console.log('Service worker already registered:', registration);
          // Ensure service worker is active
          if (registration.active) {
            console.log('Service worker is active');
          } else if (registration.installing) {
            console.log('Service worker is installing, waiting...');
            await new Promise((resolve) => {
              registration.installing.addEventListener('statechange', (e) => {
                if (e.target.state === 'activated') {
                  resolve();
                }
              });
            });
          }
        }
      } catch (swError) {
        console.error('Service worker error:', swError);
        // Try to get any active service worker as fallback
        try {
          registration = await navigator.serviceWorker.ready;
          console.log('Using ready service worker:', registration);
        } catch (readyError) {
          console.error('No service worker ready:', readyError);
          if (isIOS) {
            console.warn('iOS Safari has limited service worker support. Notifications may not work in background.');
          }
          return null;
        }
      }

      // Get messaging instance
      const messaging = await getMessagingInstance();
      if (!messaging) {
        console.error('Messaging is not available');
        return null;
      }

      // Get FCM token with service worker registration
      const token = await getToken(messaging, {
        vapidKey: "BFDcyI3R9cZo3gtkjXCTCsyk0Qa_2Vg6UTfy9fDKdAkEyFT43U5C8LZsrO0korORfpOw3F-yph5RZW4KCqZ0yM4",
        serviceWorkerRegistration: registration,
      });
      console.log('FCM token obtained successfully');
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      console.error('Error details:', error.code, error.message);
      
      // Provide helpful error messages for mobile
      if (isIOS && error.code === 'messaging/unsupported-browser') {
        console.warn('iOS Safari has limited FCM support. Consider using Chrome on iOS for better notification support.');
      }
      
      return null;
    }
  } else {
    console.log("Notification permission denied or not granted:", permission);
    if (isIOS && permission === "default") {
      console.warn('iOS requires user interaction to grant notification permission. User must click a button.');
    }
    return null;
  }
};

