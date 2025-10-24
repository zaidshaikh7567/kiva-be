import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchMetals = createAsyncThunk(
  'metals/fetchMetals',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/metals', {
        params: { page, limit }
      });
      
      if (response.data.success) {
        return {
          metals: response.data.data,
          pagination: response.data.pagination
        };
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch metals');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSingleMetal = createAsyncThunk(
  'metals/fetchSingleMetal',
  async (metalId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/metals/${metalId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch metal');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createMetal = createAsyncThunk(
  'metals/createMetal',
  async (metalData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/metals', metalData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to create metal');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateMetal = createAsyncThunk(
  'metals/updateMetal',
  async ({ metalId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/metals/${metalId}`, data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to update metal');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteMetal = createAsyncThunk(
  'metals/deleteMetal',
  async (metalId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/metals/${metalId}`);
      
      if (response.data.success) {
        return metalId;
      } else {
        return rejectWithValue(response.data.message || 'Failed to delete metal');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  allItems: [],
  filteredItems: [],
  currentMetal: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  },
  filters: {
    search: '',
    carat: 'all',
    color: 'all',
    status: 'all',
    sort: 'created-desc'
  }
};

const metalsSlice = createSlice({
  name: 'metals',
  initialState,
  reducers: {
    setMetalsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearMetalsFilters: (state) => {
      state.filters = {
        search: '',
        carat: 'all',
        color: 'all',
        status: 'all',
        sort: 'created-desc'
      };
      state.items = state.allItems;
    },
    applyMetalsFilters: (state) => {
      let filtered = [...state.allItems];

      // Apply search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(metal =>
          metal.name.toLowerCase().includes(searchTerm) ||
          metal.color.toLowerCase().includes(searchTerm) ||
          metal.carat.toLowerCase().includes(searchTerm)
        );
      }

      // Apply karat filter
      if (state.filters.carat && state.filters.carat !== 'all') {
        filtered = filtered.filter(metal => metal.carat === state.filters.carat);
      }

      // Apply color filter
      if (state.filters.color && state.filters.color !== 'all') {
        filtered = filtered.filter(metal => metal.color === state.filters.color);
      }

      // Apply status filter
      if (state.filters.status && state.filters.status !== 'all') {
        if (state.filters.status === 'active') {
          filtered = filtered.filter(metal => metal.isActive === true);
        } else if (state.filters.status === 'inactive') {
          filtered = filtered.filter(metal => metal.isActive === false);
        }
      }

      // Apply sorting
      if (state.filters.sort) {
        switch (state.filters.sort) {
          case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'carat-asc':
            filtered.sort((a, b) => a.carat.localeCompare(b.carat));
            break;
          case 'carat-desc':
            filtered.sort((a, b) => b.carat.localeCompare(a.carat));
            break;
          case 'price-asc':
            filtered.sort((a, b) => a.priceMultiplier - b.priceMultiplier);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.priceMultiplier - a.priceMultiplier);
            break;
          case 'created-asc':
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'created-desc':
          default:
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        }
      }

      state.items = filtered;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch metals
    builder
      .addCase(fetchMetals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetals.fulfilled, (state, action) => {
        state.loading = false;
        state.allItems = action.payload.metals;
        state.items = action.payload.metals;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchMetals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single metal
    builder
      .addCase(fetchSingleMetal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleMetal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMetal = action.payload;
        state.error = null;
      })
      .addCase(fetchSingleMetal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create metal
    builder
      .addCase(createMetal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMetal.fulfilled, (state, action) => {
        state.loading = false;
        state.allItems.unshift(action.payload);
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createMetal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update metal
    builder
      .addCase(updateMetal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMetal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.allItems.findIndex(metal => metal._id === action.payload._id);
        if (index !== -1) {
          state.allItems[index] = action.payload;
        }
        const filteredIndex = state.items.findIndex(metal => metal._id === action.payload._id);
        if (filteredIndex !== -1) {
          state.items[filteredIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMetal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete metal
    builder
      .addCase(deleteMetal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMetal.fulfilled, (state, action) => {
        state.loading = false;
        state.allItems = state.allItems.filter(metal => metal._id !== action.payload);
        state.items = state.items.filter(metal => metal._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteMetal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setMetalsFilters, clearMetalsFilters, applyMetalsFilters, clearError } = metalsSlice.actions;

// Selectors
export const selectMetals = (state) => state.metals.items;
export const selectMetalsLoading = (state) => state.metals.loading;
export const selectMetalsError = (state) => state.metals.error;
export const selectMetalsFilters = (state) => state.metals.filters;
export const selectCurrentMetal = (state) => state.metals.currentMetal;
export const selectMetalsPagination = (state) => state.metals.pagination;

export default metalsSlice.reducer;
