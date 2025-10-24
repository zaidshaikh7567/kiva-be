import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchStones = createAsyncThunk(
  'stones/fetchStones',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_METHOD.stones}?page=${page}&limit=${limit}`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchStoneById = createAsyncThunk(
  'stones/fetchStoneById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_METHOD.stones}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  stones: [],
  currentStone: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  },
};

// Stones slice
const stonesSlice = createSlice({
  name: 'stones',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStone: (state, action) => {
      state.currentStone = action.payload;
    },
    clearCurrentStone: (state) => {
      state.currentStone = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stones
      .addCase(fetchStones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStones.fulfilled, (state, action) => {
        state.loading = false;
        const stones = Array.isArray(action.payload) ? action.payload : action.payload.stones || [];
        state.stones = stones;
        
        // Update pagination if available
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        
        state.error = null;
      })
      .addCase(fetchStones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Stone by ID
      .addCase(fetchStoneById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoneById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStone = action.payload;
        state.error = null;
      })
      .addCase(fetchStoneById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, setCurrentStone, clearCurrentStone } = stonesSlice.actions;

// Export selectors
export const selectStones = (state) => state.stones.stones;
export const selectCurrentStone = (state) => state.stones.currentStone;
export const selectStonesLoading = (state) => state.stones.loading;
export const selectStonesError = (state) => state.stones.error;
export const selectStonesPagination = (state) => state.stones.pagination;

export default stonesSlice.reducer;

