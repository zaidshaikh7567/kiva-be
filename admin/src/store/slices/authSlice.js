import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for API calls
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        
        // Store tokens and user data in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('adminAuthenticated', 'true');
        
        return { accessToken, refreshToken, user };
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Login failed'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      
      if (response.data.success) {
        return response.data.message || 'Password reset email sent successfully';
      } else {
        return rejectWithValue(response.data.message || 'Failed to send reset email');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to send reset email'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/reset-password', resetData);
      
      if (response.data.success) {
        return response.data.message || 'Password reset successfully';
      } else {
        return rejectWithValue(response.data.message || 'Password reset failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Password reset failed'
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const refreshToken = getState().auth.refreshToken || localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const response = await api.post('/api/auth/refresh', {
        refreshToken,
      });
      
      if (response.data.success) {
        const { accessToken } = response.data.data;
        
        // Update access token in localStorage
        localStorage.setItem('accessToken', accessToken);
        
        return { accessToken };
      } else {
        return rejectWithValue(response.data.message || 'Token refresh failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Token refresh failed'
      );
    }
  }
);

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Load user data from localStorage on initialization
const loadAuthFromStorage = () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAuthenticated = !!accessToken && !!user;

    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
    };
  } catch (error) {
    console.error('Error loading auth from storage:', error);
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    };
  }
};

// Merge initial state with stored auth data
const storedAuth = loadAuthFromStorage();
const mergedInitialState = {
  ...initialState,
  ...storedAuth,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: mergedInitialState,
  reducers: {
    logout: (state) => {
      // Clear state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('adminAuthenticated');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Refresh Token
      .addCase(refreshToken.pending, () => {
        // Don't set loading to true for refresh to avoid UI flicker
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        // If refresh fails, logout the user
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('adminAuthenticated');
      });
  },
});

// Export actions
export const { logout, clearError, setUser, setAccessToken } = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Export reducer
export default authSlice.reducer;

