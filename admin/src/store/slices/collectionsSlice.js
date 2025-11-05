import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Fetch collections with pagination
export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(API_METHOD.collections, {
        params: { page, limit }
      });
      return {
        collections: res.data.data || [],
        pagination: res.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalRecords: res.data.data?.length || 0,
          limit
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch collections');
    }
  }
);

export const fetchSingleCollection = createAsyncThunk(
  'collections/fetchSingleCollection',
  async (collectionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_METHOD.collections}/${collectionId}`);
      return res.data.data || res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch collection');
    }
  }
);

export const createCollection = createAsyncThunk(
  'collections/createCollection',
  async (collectionData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (collectionData.title) formData.append('title', collectionData.title);
      if (collectionData.category) formData.append('category', collectionData.category);
      if (collectionData.video && typeof collectionData.video === 'string') {
        formData.append('video', collectionData.video);
      }
      if (typeof collectionData.isNew === 'boolean') formData.append('isNew', String(collectionData.isNew));
      if (typeof collectionData.isActive === 'boolean') formData.append('isActive', String(collectionData.isActive));
      
      // Add images
      if (collectionData.images && Array.isArray(collectionData.images)) {
        collectionData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }
      
      // Add video file if present
      if (collectionData.videoFile && collectionData.videoFile instanceof File) {
        formData.append('video', collectionData.videoFile);
      }
      
      const res = await api.post(API_METHOD.collections, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Collection created successfully!');
      return res.data.data || res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create collection';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCollection = createAsyncThunk(
  'collections/updateCollection',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Add text fields only if they're provided
      if (data.title !== undefined) formData.append('title', data.title);
      if (data.category !== undefined) formData.append('category', data.category);
      if (data.video !== undefined && typeof data.video === 'string') {
        formData.append('video', data.video);
      }
      if (typeof data.isNew === 'boolean') formData.append('isNew', String(data.isNew));
      if (typeof data.isActive === 'boolean') formData.append('isActive', String(data.isActive));
      
      // Add new images (only File objects)
      if (data.images && Array.isArray(data.images)) {
        data.images.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }
      
      // Add video file if present
      if (data.videoFile && data.videoFile instanceof File) {
        formData.append('video', data.videoFile);
      }
      
      const res = await api.put(`${API_METHOD.collections}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Collection updated successfully!');
      return res.data.data || res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update collection';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCollection = createAsyncThunk(
  'collections/deleteCollection',
  async (collectionId, { rejectWithValue }) => {
    try {
      await api.delete(`${API_METHOD.collections}/${collectionId}`);
      toast.success('Collection deleted successfully!');
      return collectionId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete collection';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  items: [],
  allItems: [],
  currentCollection: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  }
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.collections;
        state.allItems = action.payload.collections;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
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
      })
      // Create collection
      .addCase(createCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.allItems.unshift(action.payload);
        state.pagination.totalRecords += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit);
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update collection
      .addCase(updateCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        const allIndex = state.allItems.findIndex(item => item._id === action.payload._id);
        if (allIndex !== -1) {
          state.allItems[allIndex] = action.payload;
        }
        if (state.currentCollection?._id === action.payload._id) {
          state.currentCollection = action.payload;
        }
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete collection
      .addCase(deleteCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.allItems = state.allItems.filter(item => item._id !== action.payload);
        state.pagination.totalRecords -= 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit);
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setPagination } = collectionsSlice.actions;

// Selectors
export const selectCollections = (state) => state.collections.items;
export const selectCollectionsLoading = (state) => state.collections.loading;
export const selectCollectionsError = (state) => state.collections.error;
export const selectCollectionsPagination = (state) => state.collections.pagination;
export const selectCurrentCollection = (state) => state.collections.currentCollection;

export default collectionsSlice.reducer;
