import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Fetch social handles with pagination
export const fetchSocialHandles = createAsyncThunk(
  'socialHandles/fetchSocialHandles',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(API_METHOD.socialHandles, {
        params: { page, limit }
      });
      return {
        data: res.data.data || [],
        pagination: res.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalRecords: res.data.data?.length || 0,
          limit
        }
      };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// Fetch active social handles only (for public display)
export const fetchActiveSocialHandles = createAsyncThunk(
  'socialHandles/fetchActiveSocialHandles',
  async ({ page = 1, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(API_METHOD.socialHandles, {
        params: { page, limit }
      });
      // Filter only active social handles on the frontend
      const activeHandles = (res.data.data || []).filter(handle => handle.isActive === true);
      return {
        data: activeHandles,
        pagination: res.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalRecords: activeHandles.length,
          limit
        }
      };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

const initialState = {
  items: [],
  activeItems: [], // Only active social handles for public display
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  },
  loading: false,
  error: null,
};

const socialHandlesSlice = createSlice({
  name: 'socialHandles',
  initialState,
  reducers: {
    clearSocialHandlesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all social handles
      .addCase(fetchSocialHandles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialHandles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchSocialHandles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch active social handles
      .addCase(fetchActiveSocialHandles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSocialHandles.fulfilled, (state, action) => {
        state.loading = false;
        state.activeItems = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchActiveSocialHandles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSocialHandlesError } = socialHandlesSlice.actions;

export const selectSocialHandles = (state) => state.socialHandles.items;
export const selectActiveSocialHandles = (state) => state.socialHandles.activeItems;
export const selectSocialHandlesLoading = (state) => state.socialHandles.loading;
export const selectSocialHandlesError = (state) => state.socialHandles.error;
export const selectSocialHandlesPagination = (state) => state.socialHandles.pagination;

export default socialHandlesSlice.reducer;
