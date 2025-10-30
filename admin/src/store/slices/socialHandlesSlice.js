import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

export const fetchSocialHandles = createAsyncThunk(
  'socials/fetchAll',
  async (_,{ rejectWithValue }) => {
    try {
      const res = await api.get(API_METHOD.socials);
      return res.data.data || res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const createSocialHandle = createAsyncThunk(
  'socials/create',
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (data.image) formData.append('image', data.image);
      if (data.url) formData.append('url', data.url);
      if (data.platform) formData.append('platform', data.platform);
      if (typeof data.isActive === 'boolean') formData.append('isActive', String(data.isActive));
      const res = await api.post(API_METHOD.socials, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data.data || res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const updateSocialHandle = createAsyncThunk(
  'socials/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (data.image) formData.append('image', data.image);
      if (data.url) formData.append('url', data.url);
      if (data.platform) formData.append('platform', data.platform);
      if (typeof data.isActive === 'boolean') formData.append('isActive', String(data.isActive));
      const res = await api.put(`${API_METHOD.socials}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data.data || res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const deleteSocialHandle = createAsyncThunk(
  'socials/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_METHOD.socials}/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const socialHandlesSlice = createSlice({
  name: 'socials',
  initialState,
  reducers: {
    clearSocialsError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialHandles.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSocialHandles.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchSocialHandles.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createSocialHandle.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createSocialHandle.fulfilled, (state, action) => { state.loading = false; state.items.unshift(action.payload); })
      .addCase(createSocialHandle.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateSocialHandle.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateSocialHandle.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(s => (s._id || s.id) === (action.payload._id || action.payload.id));
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateSocialHandle.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(deleteSocialHandle.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteSocialHandle.fulfilled, (state, action) => {
        state.loading = false; state.items = state.items.filter(s => (s._id || s.id) !== action.payload);
      })
      .addCase(deleteSocialHandle.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { clearSocialsError } = socialHandlesSlice.actions;

export const selectSocialHandles = (state) => state.socials.items;
export const selectSocialHandlesLoading = (state) => state.socials.loading;
export const selectSocialHandlesError = (state) => state.socials.error;

export default socialHandlesSlice.reducer;


