
import { requestNotificationPermission, getMessagingInstance } from '../firebase';
import { onMessage } from 'firebase/messaging';
import api from './api';

/**
 * Save FCM token to backend
 * @param {string} token - FCM device token
 * @returns {Promise<Object>}
 */
export const saveFCMToken = async (token) => {
  try {
    const response = await api.post('/api/notifications/token', { token });
    return response.data;
  } catch (error) {
    console.error('Error saving FCM token:', error);
    throw error;
  }
};

/**
 * Remove FCM token from backend
 * @param {string} token - FCM device token
 * @returns {Promise<Object>}
 */
export const removeFCMToken = async (token) => {
  try {
    const response = await api.delete('/api/notifications/token', { data: { token } });
    return response.data;
  } catch (error) {
    console.error('Error removing FCM token:', error);
    throw error;
  }
};

/**
 * Get user's FCM tokens
 * @returns {Promise<Object>}
 */
export const getFCMTokens = async () => {
  try {
    const response = await api.get('/api/notifications/tokens');
    return response.data;
  } catch (error) {
    console.error('Error getting FCM tokens:', error);
    throw error;
  }
};

/**
 * Initialize FCM and request permission
 * @returns {Promise<string|null>} - FCM token or null
 */
export const initializeFCM = async () => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported');
      return null;
    }

    // Register service worker if not already registered
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service worker registered:', registration);
    } catch (swError) {
      console.error('Service worker registration failed:', swError);
      // Continue anyway, might already be registered
    }

    // Request permission and get token
    const token = await requestNotificationPermission();
    
    if (token) {
      console.log('FCM Token obtained:', token.substring(0, 20) + '...');
      // Save token to backend
      try {
        const result = await saveFCMToken(token);
        console.log('FCM token saved to backend successfully:', result);
      } catch (error) {
        console.error('Failed to save FCM token to backend:', error);
        console.error('Error details:', error.response?.data || error.message);
      }
      return token;
    } else {
      console.warn('No FCM token obtained - permission might be denied');
    }
    
    return null;
  } catch (error) {
    console.error('Error initializing FCM:', error);
    return null;
  }
};

/**
 * Set up foreground message listener
 * This handles notifications when the app is in the foreground
 * @param {Function} callback - Callback function to handle notification
 * @returns {Function} - Cleanup function to remove listener
 */
export const setupForegroundMessageListener = async (callback) => {
  try {
    // Get messaging instance (lazy initialization)
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.error('Firebase messaging not available or not supported');
      return () => {};
    }

    console.log('Registering onMessage listener...');
    
    // Set up the listener
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Call the callback if provided (this will handle Redux updates and toast)
      if (callback) {
        try {
          callback(payload);
        } catch (callbackError) {
          console.error('Error in notification callback:', callbackError);
        }
      }
      
      // Also show browser notification if permission is granted
      if (payload.notification && Notification.permission === 'granted') {
        try {
          const notificationTitle = payload.notification.title || 'New Notification';
          const notificationOptions = {
            body: payload.notification.body || '',
            icon: payload.notification.image || '/kiva-diamond-logo.png',
            badge: '/kiva-diamond-logo.png',
            data: payload.data || {},
            tag: payload.messageId || Date.now().toString(), // Prevent duplicate notifications
            requireInteraction: false,
          };
          
          const browserNotification = new Notification(notificationTitle, notificationOptions);
          
          // Handle notification click
          browserNotification.onclick = () => {
            window.focus();
            browserNotification.close();
            
            // Navigate based on notification data if callback provided
            if (callback && payload.data?.type === 'custom_request') {
              // This will be handled by the callback/component
            }
          };
        } catch (notifError) {
          console.error('Error showing browser notification:', notifError);
        }
      }
    });
    
    console.log('Foreground message listener set up successfully');
    
    // Return cleanup function
    return () => {
      console.log('Cleaning up foreground message listener');
      // Note: onMessage doesn't return an unsubscribe function in Firebase v9+
      // The listener will be automatically cleaned up when the component unmounts
    };
  } catch (error) {
    console.error('Error setting up foreground message listener:', error);
    return () => {};
  }
};

/**
 * Check if notifications are supported and enabled
 * @returns {boolean}
 */
export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

/**
 * Get current notification permission status
 * @returns {string} - 'default', 'granted', or 'denied'
 */
export const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

