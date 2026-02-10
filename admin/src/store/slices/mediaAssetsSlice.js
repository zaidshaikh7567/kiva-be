import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

export const fetchMediaAssets = createAsyncThunk(
  'mediaAssets/fetchMediaAssets',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.section) params.append('section', filters.section);
      if (filters.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters.isActive !== undefined && filters.isActive !== 'all') {
        params.append('isActive', filters.isActive);
      }

      const url = `${API_METHOD.mediaAssets}${
        params.toString() ? `?${params.toString()}` : ''
      }`;
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createMediaAsset = createAsyncThunk(
  'mediaAssets/createMediaAsset',
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('type', data.type);
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.page) formData.append('page', data.page);
      if (data.section) formData.append('section', data.section);
      if (data.key) formData.append('key', data.key);
      if (data.isActive !== undefined) {
        formData.append('isActive', String(data.isActive));
      }
      if (data.sortOrder !== undefined && data.sortOrder !== '') {
        formData.append('sortOrder', String(data.sortOrder));
      }
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await api.post(API_METHOD.mediaAssets, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Media uploaded successfully!');
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to upload media';
      toast.error(message);
      return rejectWithValue({
        message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const updateMediaAsset = createAsyncThunk(
  'mediaAssets/updateMediaAsset',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (data.type) formData.append('type', data.type);
      if (data.title !== undefined) formData.append('title', data.title || '');
      if (data.description !== undefined) {
        formData.append('description', data.description || '');
      }
      if (data.page) formData.append('page', data.page);
      if (data.section !== undefined) formData.append('section', data.section || '');
      if (data.key !== undefined) formData.append('key', data.key || '');
      if (data.isActive !== undefined) {
        formData.append('isActive', String(data.isActive));
      }
      if (data.sortOrder !== undefined && data.sortOrder !== '') {
        formData.append('sortOrder', String(data.sortOrder));
      }
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await api.put(`${API_METHOD.mediaAssets}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Media updated successfully!');
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update media';
      toast.error(message);
      return rejectWithValue({
        message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const deleteMediaAsset = createAsyncThunk(
  'mediaAssets/deleteMediaAsset',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_METHOD.mediaAssets}/${id}`);
      toast.success('Media deleted successfully!');
      return { id, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to delete media';
      toast.error(message);
      return rejectWithValue({
        message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

const mediaAssetsSlice = createSlice({
  name: 'mediaAssets',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      page: 'home',
      section: '',
      type: 'all',
      isActive: 'all',
      search: '',
    },
  },
  reducers: {
    setMediaFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearMediaFilters: (state) => {
      state.filters = {
        page: 'home',
        section: '',
        type: 'all',
        isActive: 'all',
        search: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMediaAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchMediaAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch media';
      })
      .addCase(createMediaAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMediaAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createMediaAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create media';
      })
      .addCase(updateMediaAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMediaAsset.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.items = state.items.map((item) =>
          item._id === updated._id ? { ...item, ...updated } : item
        );
      })
      .addCase(updateMediaAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update media';
      })
      .addCase(deleteMediaAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMediaAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload.id);
      })
      .addCase(deleteMediaAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete media';
      });
  },
});

export const { setMediaFilters, clearMediaFilters } = mediaAssetsSlice.actions;

export const selectMediaAssets = (state) => state.mediaAssets.items;
export const selectMediaAssetsLoading = (state) => state.mediaAssets.loading;
export const selectMediaAssetsError = (state) => state.mediaAssets.error;
export const selectMediaAssetsFilters = (state) => state.mediaAssets.filters;

export default mediaAssetsSlice.reducer;


