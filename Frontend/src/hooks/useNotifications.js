import { useEffect, useState, useCallback } from 'react';
import {
  initializeFCM,
  saveFCMToken,
  removeFCMToken,
  getFCMTokens,
  isNotificationSupported,
  getNotificationPermission,
} from '../services/notificationService';

/**
 * Custom hook for managing FCM notifications
 * @param {boolean} autoInitialize - Automatically initialize on mount
 * @returns {Object} - Notification state and methods
 */
export const useNotifications = (autoInitialize = true) => {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState([]);

  // Check support and permission on mount
  useEffect(() => {
    const supported = isNotificationSupported();
    setIsSupported(supported);
    
    if (supported) {
      setPermission(getNotificationPermission());
    }
  }, []);

  // Initialize FCM
  const initialize = useCallback(async () => {
    if (!isSupported) {
      setError('Notifications are not supported in this browser');
      return null;
    }

    try {
      setError(null);
      const fcmToken = await initializeFCM();
      setToken(fcmToken);
      setIsInitialized(true);
      return fcmToken;
    } catch (err) {
      setError(err.message);
      setIsInitialized(false);
      return null;
    }
  }, [isSupported]);

  // Auto-initialize on mount if enabled
  useEffect(() => {
    if (autoInitialize && isSupported && permission === 'default') {
      initialize();
    }
  }, [autoInitialize, isSupported, permission, initialize]);

  // Note: Foreground message listener is now set up in NotificationInitializer component
  // to have access to toast and other app-level features

  // Load user's tokens
  const loadTokens = useCallback(async () => {
    try {
      const response = await getFCMTokens();
      setTokens(response.tokens || []);
      return response.tokens || [];
    } catch (err) {
      console.error('Error loading tokens:', err);
      return [];
    }
  }, []);

  // Remove a token
  const removeToken = useCallback(async (tokenToRemove) => {
    try {
      await removeFCMToken(tokenToRemove);
      setTokens((prev) => prev.filter((t) => t !== tokenToRemove));
      if (tokenToRemove === token) {
        setToken(null);
      }
      return true;
    } catch (err) {
      console.error('Error removing token:', err);
      return false;
    }
  }, [token]);

  return {
    // State
    token,
    tokens,
    permission,
    isSupported,
    isInitialized,
    error,
    
    // Methods
    initialize,
    loadTokens,
    removeToken,
    
    // Helpers
    isNotificationSupported: isSupported,
    getPermission: () => getNotificationPermission(),
  };
};

