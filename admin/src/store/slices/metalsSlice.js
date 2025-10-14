import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchMetals = createAsyncThunk(
  'metals/fetchMetals',
  async (_, { rejectWithValue }) => {
    try {
      // For now, return mock data. Replace with actual API call
      const mockMetals = [
        {
          _id: '0001',
          carat: '14k',
          color: 'white',
          priceMultiplier: 1,
          gradient: 'from-gray-200 to-gray-300',
          backgroundColor: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
          isActive: false,
          createdAt: new Date().toISOString()
        },
        {
          _id: '0002',
          carat: '18k',
          color: 'yellow',
          priceMultiplier: 1.5,
          gradient: 'from-yellow-50 to-yellow-100',
          backgroundColor: 'linear-gradient(to right, #fffbeb, #fefce8)',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: '0003',
          carat: '14k',
          color: 'rose',
          priceMultiplier: 1.3,
          gradient: 'from-pink-50 to-pink-100',
          backgroundColor: 'linear-gradient(to right, #fdf2f8, #fdf2f8)',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      
      return mockMetals;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMetal = createAsyncThunk(
  'metals/createMetal',
  async (metalData, { rejectWithValue }) => {
    try {
      // Generate name from carat and color
      const colorLabels = {
        'white': 'White Gold',
        'yellow': 'Yellow Gold', 
        'rose': 'Rose Gold',
        'platinum': 'Platinum'
      };
      
      const name = `${metalData.carat.toUpperCase()} ${colorLabels[metalData.color] || metalData.color}`;
      
      // For now, return mock response. Replace with actual API call
      const newMetal = {
        _id: Date.now().toString(),
        ...metalData,
        name,
        createdAt: new Date().toISOString()
      };
      
      return newMetal;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMetal = createAsyncThunk(
  'metals/updateMetal',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Generate name from carat and color
      const colorLabels = {
        'white': 'White Gold',
        'yellow': 'Yellow Gold', 
        'rose': 'Rose Gold',
        'platinum': 'Platinum'
      };
      
      const name = `${data.carat.toUpperCase()} ${colorLabels[data.color] || data.color}`;
      
      // For now, return mock response. Replace with actual API call
      const updatedMetal = {
        _id: id,
        ...data,
        name,
        updatedAt: new Date().toISOString()
      };
      
      return updatedMetal;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMetal = createAsyncThunk(
  'metals/deleteMetal',
  async (metalId, { rejectWithValue }) => {
    try {
      // For now, return mock response. Replace with actual API call
      return metalId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  allItems: [],
  filteredItems: [],
  loading: false,
  error: null,
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
        state.allItems = action.payload;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMetals.rejected, (state, action) => {
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

export default metalsSlice.reducer;
