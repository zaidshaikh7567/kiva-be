import { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { addNotification, fetchNotifications } from '../store/slices/notificationsSlice';
import { setupForegroundMessageListener } from '../services/notificationService';

/**
 * Component to initialize FCM notifications when admin is logged in
 * Also sets up listener to add notifications to Redux store
 */
const NotificationInitializer = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const { initialize, isSupported, permission, isInitialized, token } = useNotifications(false);

  useEffect(() => {
    // Initialize if admin is authenticated and notifications are supported
    if (isAuthenticated && isSupported) {
      console.log('Admin authenticated, checking notification permission:', permission);
      
      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      if (isMobile) {
        console.log('Mobile device detected:', { isMobile, isIOS });
      }
      
      if (permission === 'default' || permission === 'granted') {
        console.log('Initializing FCM notifications for admin...');
        // Small delay on mobile to ensure page is fully loaded
        if (isMobile) {
          setTimeout(() => {
            initialize();
          }, 500);
        } else {
          initialize();
        }
      } else {
        console.log('Notification permission denied:', permission);
        if (isIOS && permission === 'default') {
          console.warn('iOS requires user interaction. Permission will be requested when user interacts with the page.');
        }
      }
    } else {
      console.log('Cannot initialize notifications:', { isAuthenticated, isSupported, permission });
    }
  }, [isAuthenticated, isSupported, permission, initialize]);

  // Fetch notifications on mount and set up polling
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // Fetch notifications immediately
  //     dispatch(fetchNotifications());
      
  //     // Set up polling to fetch notifications every 30 seconds
  //     const interval = setInterval(() => {
  //       dispatch(fetchNotifications());
  //     }, 30000);

  //     return () => clearInterval(interval);
  //   }
  // }, [isAuthenticated, dispatch]);

  // Set up foreground message listener to add notifications to Redux and show toast
  // This must be set up AFTER FCM is initialized and token is obtained
  useEffect(() => {
    if (isAuthenticated && isSupported && isInitialized && token) {
      console.log('Setting up foreground message listener for admin...', { isInitialized, hasToken: !!token });
      
      // Set up the listener with callback (async)
      let cleanup = () => {};
      setupForegroundMessageListener((payload) => {
        console.log('Foreground notification received:', payload);
        
        // Add notification to Redux store
        // const notification = {
        //   _id: payload.messageId || Date.now().toString(),
        //   id: payload.messageId || Date.now().toString(),
        //   title: payload.notification?.title || 'New Notification',
        //   body: payload.notification?.body || '',
        //   image: payload.notification?.image,
        //   data: payload.data || {},
        //   createdAt: new Date().toISOString(),
        //   timestamp: new Date().toISOString(),
        //   read: false,
        // };
        // console.log('Adding notification to Redux:', notification);
        // dispatch(addNotification(notification));
        
        // Show toast notification
        // if (payload.notification) {
        //   const title = payload.notification.title || 'New Notification';
        //   const body = payload.notification.body || '';
          
          // toast.success(
          //   <div>
          //     <div className="font-semibold">{title}</div>
          //     {body && <div className="text-sm mt-1">{body}</div>}
          //   </div>,
          //   {
          //     duration: 5000,
          //     position: 'top-right',
          //     icon: '🔔',
          //   }
          // );
        // }
        
        // Also refresh from API to get the saved notification
        setTimeout(() => {
          dispatch(fetchNotifications());
        }, 2000);
      }).then((cleanupFn) => {
        cleanup = cleanupFn || (() => {});
      }).catch((error) => {
        console.error('Error setting up foreground listener:', error);
      });
      
      return () => {
        if (cleanup) cleanup();
      };
    } else {
      console.log('Cannot set up foreground listener:', { 
        isAuthenticated, 
        isSupported, 
        isInitialized, 
        hasToken: !!token 
      });
    }
  }, [isAuthenticated, isSupported, isInitialized, token, dispatch]);

  // This component doesn't render anything
  return null;
};

export default NotificationInitializer;

