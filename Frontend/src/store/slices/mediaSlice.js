import { createSlice } from '@reduxjs/toolkit';
import { API_METHOD } from '../../services/apiMethod';
import api from '../../services/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMedia = createAsyncThunk(
  'media/fetchMedia',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_METHOD.mediaAssets, {
        params: filters,
      });
      console.log('response :', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    media: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setMedia: (state, action) => {
      state.media = action.payload;
    },
    clearMedia: (state) => {
      state.media = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMedia.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchMedia.fulfilled, (state, action) => {
    console.log('action.payload :', action.payload);
      state.loading = false;
      state.media = action.payload.data;
    }).addCase(fetchMedia.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setMedia, clearMedia, clearError } = mediaSlice.actions;

export const selectMedia = (state) => state.media.media;
export const selectMediaLoading = (state) => state.media.loading;
export const selectMediaError = (state) => state.media.error;

export default mediaSlice.reducer;