import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Mail, Check, CheckCheck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectNotifications, 
  selectUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  fetchNotifications
} from '../store/slices/notificationsSlice';
import { useNavigate } from 'react-router-dom';
const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const totalCount = notifications.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications());
    }
  }, [isOpen, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      await dispatch(markNotificationAsRead(notification._id || notification.id));
    }

    // Navigate based on notification type
    if (notification.data?.type === 'custom_request' && notification.data?.contactId) {
      navigate(`/contacts`);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  const handleRemoveNotification = async (e, notificationId) => {
    e.stopPropagation();
    await dispatch(deleteNotification(notificationId));
  };


  const getNotificationIcon = (type) => {
    switch (type) {
      case 'custom_request':
        return <Mail className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTime = (timestamp) => {
    try {
      const now = new Date();
      const time = new Date(timestamp);
      const diffInSeconds = Math.floor((now - time) / 1000);

      if (diffInSeconds < 60) {
        return 'Just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
        title={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-primary' : 'text-black-light'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-montserrat-semibold-600 px-1.5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-montserrat-semibold-600 text-black">
                Notifications
              </h3>
              {totalCount > 0 && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-montserrat-semibold-600 rounded-full">
                  {totalCount}
                </span>
              )}
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-montserrat-semibold-600 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors text-[12px]"
                  title="Mark all as read"
                >
                  {/* <CheckCheck className="w-4 h-4 text-primary" /> */}
                  Mark All as Read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="font-montserrat-semibold-600 text-black mb-1">No notifications</p>
                <p className="font-montserrat-regular-400 text-xs text-black-light">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id || notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3  cursor-pointer transition-colors border-l-4 ${
                      !notification.read 
                        ? 'bg-white border-l-primary ' 
                        : ' bg-primary-light/20 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.data?.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`font-montserrat-semibold-600 text-sm ${
                              !notification.read ? 'text-black' : 'text-black-light'
                            }`}>
                              {notification.title}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0 animate-pulse"></div>
                          )}
                        </div>
                        <p className="font-montserrat-regular-400 text-xs text-black-light mt-1.5 leading-relaxed">
                          {notification.body}
                        </p>
                        
                        {/* Additional Details */}
                        {notification.data && (
                          <div className="mt-2 space-y-1">
                            {notification.data.userName && (
                              <p className="font-montserrat-medium-500 text-xs text-black">
                                From: <span className="text-primary">{notification.data.userName}</span>
                              </p>
                            )}
                            {notification.data.userEmail && (
                              <p className="font-montserrat-regular-400 text-xs text-black-light">
                                Email: {notification.data.userEmail}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                        <p className="font-montserrat-regular-400 text-xs text-black-light">
                          {formatTime(notification.createdAt || notification.timestamp)}
                        </p>
                          {notification.read && (
                            <Check className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(markNotificationAsRead(notification._id || notification.id));
                            }}
                            className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5 text-primary" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleRemoveNotification(e, notification._id || notification.id)}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Remove notification"
                        >
                          <X className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <p className="text-xs font-montserrat-regular-400 text-black-light text-center">
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

