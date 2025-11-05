import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Fetch all collections with pagination
export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(API_METHOD.collections, {
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

// Fetch active collections only (for public display)
export const fetchActiveCollections = createAsyncThunk(
  'collections/fetchActiveCollections',
  async ({ page = 1, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(API_METHOD.collections, {
        params: { page, limit }
      });
      // Filter only active collections on the frontend
      const activeCollections = (res.data.data || []).filter(collection => collection.isActive === true);
      return {
        data: activeCollections,
        pagination: res.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalRecords: activeCollections.length,
          limit
        }
      };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// Fetch single collection by ID
export const fetchSingleCollection = createAsyncThunk(
  'collections/fetchSingleCollection',
  async (collectionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_METHOD.collections}/${collectionId}`);
      return res.data.data || res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

const initialState = {
  items: [],
  activeItems: [], // Only active collections for public display
  currentCollection: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  },
  loading: false,
  error: null,
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    clearCollectionsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch active collections
      .addCase(fetchActiveCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.activeItems = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchActiveCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single collection
      .addCase(fetchSingleCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCollection = action.payload;
      })
      .addCase(fetchSingleCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCollectionsError } = collectionsSlice.actions;

export const selectCollections = (state) => state.collections.items;
export const selectActiveCollections = (state) => state.collections.activeItems;
export const selectCurrentCollection = (state) => state.collections.currentCollection;
export const selectCollectionsLoading = (state) => state.collections.loading;
export const selectCollectionsError = (state) => state.collections.error;
export const selectCollectionsPagination = (state) => state.collections.pagination;

export default collectionsSlice.reducer;
