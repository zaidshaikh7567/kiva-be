import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchCenterStones = createAsyncThunk(
  'centerStones/fetchCenterStones',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = `${API_METHOD.stones}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCenterStone = createAsyncThunk(
  'centerStones/createCenterStone',
  async (centerStoneData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_METHOD.stones, centerStoneData);
      toast.success('Stone created successfully!');
      return response.data.data || response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create stone';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const updateCenterStone = createAsyncThunk(
  'centerStones/updateCenterStone',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_METHOD.stones}/${id}`, data);
      toast.success('Stone updated successfully!');
      return response.data.data || response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update stone';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const deleteCenterStone = createAsyncThunk(
  'centerStones/deleteCenterStone',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_METHOD.stones}/${id}`);
      toast.success('Stone deleted successfully!');
      return { id, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete stone';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

// Update center stone status
export const updateCenterStoneStatus = createAsyncThunk(
  'centerStones/updateCenterStoneStatus',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_METHOD.stones}/${id}`, { active });
      toast.success('Stone status updated successfully!');
      return response.data.data || response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update stone status';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

const centerStonesSlice = createSlice({
  name: 'centerStones',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch center stones
      .addCase(fetchCenterStones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterStones.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchCenterStones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Failed to fetch stones';
      })
      
      // Create center stone
      .addCase(createCenterStone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCenterStone.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createCenterStone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Failed to create stone';
      })
      
      // Update center stone
      .addCase(updateCenterStone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCenterStone.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCenterStone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Failed to update stone';
      })
      
      // Delete center stone
      .addCase(deleteCenterStone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCenterStone.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id || action.payload;
        state.items = state.items.filter(item => item._id !== deletedId);
        state.error = null;
      })
      .addCase(deleteCenterStone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Failed to delete stone';
      })
      
      // Update center stone status
      .addCase(updateCenterStoneStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCenterStoneStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStone = action.payload;
        const index = state.items.findIndex(item => item._id === updatedStone._id);
        if (index !== -1) {
          state.items[index] = updatedStone;
        }
        state.error = null;
      })
      .addCase(updateCenterStoneStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Failed to update stone status';
      });
  }
});

export const { clearError } = centerStonesSlice.actions;

// Selectors
export const selectCenterStones = (state) => state.centerStones.items;
export const selectCenterStonesLoading = (state) => state.centerStones.loading;
export const selectCenterStonesError = (state) => state.centerStones.error;

export default centerStonesSlice.reducer;
