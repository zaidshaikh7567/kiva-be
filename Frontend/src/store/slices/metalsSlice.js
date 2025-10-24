import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchMetals = createAsyncThunk(
  'metals/fetchMetals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_METHOD.metals);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  metals: [],
  loading: false,
  error: null,
};

// Metals slice
const metalsSlice = createSlice({
  name: 'metals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Metals
      .addCase(fetchMetals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetals.fulfilled, (state, action) => {
        state.loading = false;
        const metals = Array.isArray(action.payload) ? action.payload : [];
        state.metals = metals;
        state.error = null;
      })
      .addCase(fetchMetals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError } = metalsSlice.actions;

// Export selectors
export const selectMetals = (state) => state.metals.metals;
export const selectMetalsLoading = (state) => state.metals.loading;
export const selectMetalsError = (state) => state.metals.error;

export default metalsSlice.reducer;

