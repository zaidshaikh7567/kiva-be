import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Fetch all notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_METHOD.notifications);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_METHOD.notifications}/${notificationId}/read`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_METHOD.notifications}/read-all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.delete(`${API_METHOD.notifications}/${notificationId}`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // Check if notification already exists (by _id or id)
      const existingIndex = state.notifications.findIndex(
        (n) => n._id === action.payload._id || n.id === action.payload._id || n.id === action.payload.id
      );
      
      if (existingIndex === -1) {
        const notification = {
          ...action.payload,
          _id: action.payload._id || action.payload.id,
          id: action.payload._id || action.payload.id || Date.now().toString(),
          read: action.payload.read || false,
          timestamp: action.payload.createdAt || action.payload.timestamp || new Date().toISOString(),
        };
        state.notifications.unshift(notification);
        if (!notification.read) {
          state.unreadCount += 1;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Mark as read
    builder
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload._id || n.id === action.payload._id
        );
        if (notification && !notification.read) {
          notification.read = true;
          notification.readAt = action.payload.readAt;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });

    // Mark all as read
    builder
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.read = true;
        });
        state.unreadCount = 0;
      });

    // Delete notification
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload || n.id === action.payload
        );
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload && n.id !== action.payload
        );
      });
  },
});

export const {
  addNotification,
  clearError,
} = notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

export default notificationsSlice.reducer;

