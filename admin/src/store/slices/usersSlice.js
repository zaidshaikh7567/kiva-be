import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, limit = 10, search = '', role = '', active = '' }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (search) queryParams.append('search', search);
      if (role) queryParams.append('role', role);
      if (active !== '') queryParams.append('active', active);
      
      const url = `${API_METHOD.users}?${queryParams.toString()}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_METHOD.users}/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_METHOD.users}/${userId}`, userData);
      toast.success('User updated successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update user';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_METHOD.users}/${userId}`);
      toast.success('User deleted successfully!');
      return { userId, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ userId, active }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_METHOD.users}/${userId}`, { active });
      const message = active ? 'User activated successfully!' : 'User deactivated successfully!';
      toast.success(message);
      return { userId, active, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update user status';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    currentUser: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      limit: 10
    },
    loading: false,
    error: null,
    success: null,
    filters: {
      search: '',
      role: '',
      active: '',
      sortBy: 'newest'
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        role: '',
        active: '',
        sortBy: 'newest'
      };
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.success = action.payload.message || 'Users fetched successfully!';
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      })
      
      // Fetch User by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data || action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user';
      })
      
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data || action.payload;
        const index = state.items.findIndex(item => item._id === updatedUser._id);
        if (index !== -1) {
          state.items[index] = updatedUser;
        }
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser = updatedUser;
        }
        state.success = action.payload.message || 'User updated successfully!';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update user';
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload.userId);
        state.success = action.payload.data?.message || 'User deleted successfully!';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete user';
      })
      
      // Toggle User Status
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, active } = action.payload;
        const index = state.items.findIndex(item => item._id === userId);
        if (index !== -1) {
          state.items[index].active = active;
        }
        if (state.currentUser && state.currentUser._id === userId) {
          state.currentUser.active = active;
        }
        state.success = action.payload.data?.message || 'User status updated successfully!';
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update user status';
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  setPagination, 
  setFilters, 
  clearFilters, 
  setCurrentUser, 
  clearCurrentUser 
} = usersSlice.actions;

// Selectors
export const selectUsers = (state) => state.users.items;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersSuccess = (state) => state.users.success;
export const selectUsersPagination = (state) => state.users.pagination;
export const selectUsersFilters = (state) => state.users.filters;

export default usersSlice.reducer;
