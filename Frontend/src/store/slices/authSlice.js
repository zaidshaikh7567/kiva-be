import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';
import { TOKEN_KEYS } from '../../constants/tokenKeys';

// Async thunks for auth API calls
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(API_METHOD.auth.login, credentials);
      
      // Store tokens if they exist
      if (response.data.data?.accessToken) {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.data.data.accessToken);
      }
      if (response.data.data?.refreshToken) {
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, response.data.data.refreshToken);
      }
      
      // Fetch user profile after successful login
      if (response.data.data?.accessToken) {
        try {
          const profileResponse = await api.get(API_METHOD.auth.profile);
          return {
            ...response.data.data,
            user: profileResponse.data.data || profileResponse.data
          };
        } catch (profileError) {
          // If profile fetch fails, return login response without profile
          console.error('Failed to fetch profile:', profileError);
          return response.data.data || response.data;
        }
      }
      
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Register User Api Call
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_METHOD.auth.register, {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Forgot Password Api Call
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post(API_METHOD.auth.forgotPassword, { email });
      console.log('response :', response);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Reset Password Api Call
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_METHOD.auth.resetPassword, {
        token,
        password
      });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Change Password Api Call
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_METHOD.auth.changePassword, {
        currentPassword,
        newPassword
      });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Refresh Token Api Call
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshTokenValue = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
      if (!refreshTokenValue) {
        return rejectWithValue('No refresh token available');
      }
      
      const response = await api.post(API_METHOD.auth.refreshToken, {
        refreshToken: refreshTokenValue
      });
      
      const data = response.data.data || response.data;
      
      // Update tokens in localStorage
      if (data.accessToken) {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, data.refreshToken);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Get User Profile Api Call
export const getUserProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_METHOD.auth.profile);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update User Profile Api Call
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Check if profileImage is a File object (for upload) or a string (existing URL)
      const formData = new FormData();
      
      if (profileData.name) {
        formData.append('name', profileData.name);
      }
      
      // Only append profileImage if it's a File object (new upload)
      if (profileData.profileImage instanceof File) {
        formData.append('profileImage', profileData.profileImage);
      }
      
      // Determine if we should use FormData or JSON
      const hasFile = profileData.profileImage instanceof File;
      const requestData = hasFile ? formData : profileData;
      
      const response = await api.put(API_METHOD.auth.updateProfile, requestData, {
        headers: hasFile ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        }
      });
      
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Logout User - Remove stored tokens
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    // Clear tokens from localStorage
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER);
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    success: null,
    successType: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
      state.successType = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    initializeAuth: (state) => {
      // Load tokens and user from localStorage
      const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
      const user = localStorage.getItem(TOKEN_KEYS.USER);
      
      if (accessToken && user) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.successType = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.success = 'Login successful!';
        state.successType = 'login';
        
        // Store in localStorage
        if (action.payload.accessToken) {
          localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
        }
        if (state.user) {
          localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(state.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.successType = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Registration successful!';
        state.successType = 'register';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.successType = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Password reset email sent successfully!';
        state.successType = 'forgotPassword';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send reset email';
      })
      
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.successType = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Password reset successfully!';
        state.successType = 'resetPassword';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to reset password';
      })
      
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.successType = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Password changed successfully!';
        state.successType = 'changePassword';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || (typeof action.payload === 'string' ? action.payload : 'Failed to change password');
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
        if (action.payload.accessToken) {
          localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to refresh token';
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.successType = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.success = 'Logged out successfully!';
        state.successType = 'logout';
      })
      .addCase(logoutUser.rejected, (state) => {
        // Fallback: clear state even if something goes wrong
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      })
      
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.successType = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = 'Profile updated successfully!';
        state.successType = 'updateProfile';
        localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      });
  },
});

export const { clearError, clearSuccess, setUser, updateTokens, initializeAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthSuccess = (state) => state.auth.success;
export const selectAuthSuccessType = (state) => state.auth.successType;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;

