import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';
import toast from 'react-hot-toast';
import { TOKEN_KEYS } from '../../constants/tokenKeys';

// Load favorites from localStorage on initialization
const loadFavoritesFromStorage = () => {
  try {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

// Async thunks for API calls
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(API_METHOD.favorites, {
        params: { page, limit }
      });
      // Extract products from favorite objects
      const products = (res.data.data || []).map(fav => fav.product).filter(Boolean);
      return {
        favorites: products,
        pagination: res.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalRecords: products.length,
          limit
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch favorites');
    }
  }
);

export const checkProductInFavorites = createAsyncThunk(
  'favorites/checkProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_METHOD.favorites}/check/${productId}`);
      return res.data.data?.isFavorite || false;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToFavoritesAPI = createAsyncThunk(
  'favorites/addToFavoritesAPI',
  async (productId, { rejectWithValue }) => {
    try {
      // First verify product exists
      try {
        await api.get(`${API_METHOD.products}/${productId}`);
      } catch {
        throw new Error('Product not found or unavailable');
      }

      const res = await api.post(API_METHOD.favorites, { productId });
      // Return the product from the favorite object
      return res.data.data?.product || null;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add to favorites';
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeFromFavoritesAPI = createAsyncThunk(
  'favorites/removeFromFavoritesAPI',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`${API_METHOD.favorites}/product/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to remove from favorites');
    }
  }
);

export const deleteAllFavoritesAPI = createAsyncThunk(
  'favorites/deleteAllFavoritesAPI',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete(API_METHOD.favorites);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to clear favorites');
    }
  }
);

// Sync localStorage favorites to API
export const syncFavoritesToAPI = createAsyncThunk(
  'favorites/syncFavoritesToAPI',
  async (_, { rejectWithValue }) => {
    try {
      const localFavorites = loadFavoritesFromStorage();
      if (!localFavorites || localFavorites.length === 0) {
        return { synced: 0, failed: 0 };
      }

      let synced = 0;
      let failed = 0;

      // Sync each favorite to API
      for (const product of localFavorites) {
        const productId = product._id || product.id;
        if (!productId) continue;

        try {
          // Check if product still exists
          try {
            await api.get(`${API_METHOD.products}/${productId}`);
          } catch (productError) {
            // Product doesn't exist, skip it
            console.warn(`Product ${productId} not found during sync, skipping:`, productError);
            continue;
          }

          // Check if already in favorites
          const checkRes = await api.get(`${API_METHOD.favorites}/check/${productId}`);
          if (!checkRes.data.data?.isFavorite) {
            // Add to API favorites
            await api.post(API_METHOD.favorites, { productId });
            synced++;
          }
        } catch (error) {
          console.error(`Failed to sync favorite ${productId}:`, error);
          failed++;
        }
      }

      // Clear localStorage after successful sync
      if (synced > 0) {
        localStorage.removeItem('favorites');
      }

      return { synced, failed };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to sync favorites');
    }
  }
);

const initialState = {
  favorites: loadFavoritesFromStorage(),
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Local storage operations (for non-authenticated users)
    addToFavoritesLocal: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      
      // Check if product exists and has required fields
      if (!productId || !product) {
        return;
      }

      const existingFavorite = state.favorites.find(item => (item._id || item.id) === productId);
      
      if (!existingFavorite) {
        state.favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFromFavoritesLocal: (state, action) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter(item => (item._id || item.id) !== productId);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    toggleFavoriteLocal: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      
      if (!productId || !product) {
        return;
      }

      const existingIndex = state.favorites.findIndex(item => (item._id || item.id) === productId);
      
      if (existingIndex !== -1) {
        state.favorites.splice(existingIndex, 1);
      } else {
        state.favorites.push(product);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.removeItem('favorites');
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      if (!isAuthenticated()) {
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Combined toggle that works with both API and localStorage
    toggleFavorite: (state, action) => {
      // This is handled by thunks now, but kept for backward compatibility
      const product = action.payload;
      const productId = product._id || product.id;
      
      if (!productId || !product) {
        return;
      }

      if (isAuthenticated()) {
        // For authenticated users, API thunks handle this
        return;
      }

      // For non-authenticated users, use local storage
      const existingIndex = state.favorites.findIndex(item => (item._id || item.id) === productId);
      
      if (existingIndex !== -1) {
        state.favorites.splice(existingIndex, 1);
      } else {
        state.favorites.push(product);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    addToFavorites: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      
      if (!productId || !product) {
        return;
      }

      if (isAuthenticated()) {
        // For authenticated users, API thunks handle this
        return;
      }

      const existingFavorite = state.favorites.find(item => (item._id || item.id) === productId);
      
      if (!existingFavorite) {
        state.favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      
      if (isAuthenticated()) {
        // For authenticated users, API thunks handle this
        return;
      }

      state.favorites = state.favorites.filter(item => (item._id || item.id) !== productId);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload.favorites || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Favorites API
      .addCase(addToFavoritesAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavoritesAPI.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const productId = action.payload._id || action.payload.id;
          const existingIndex = state.favorites.findIndex(item => (item._id || item.id) === productId);
          if (existingIndex === -1) {
            state.favorites.push(action.payload);
          }
        }
      })
      .addCase(addToFavoritesAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to add to favorites');
      })
      // Remove from Favorites API
      .addCase(removeFromFavoritesAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavoritesAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = state.favorites.filter(item => (item._id || item.id) !== action.payload);
      })
      .addCase(removeFromFavoritesAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to remove from favorites');
      })
      // Delete all favorites API
      .addCase(deleteAllFavoritesAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllFavoritesAPI.fulfilled, (state) => {
        state.loading = false;
        state.favorites = [];
      })
      .addCase(deleteAllFavoritesAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to clear favorites');
      })
      // Sync Favorites
      .addCase(syncFavoritesToAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncFavoritesToAPI.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.synced > 0) {
          // Clear local favorites after sync
          state.favorites = [];
        }
      })
      .addCase(syncFavoritesToAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToFavoritesLocal,
  removeFromFavoritesLocal,
  toggleFavoriteLocal,
  clearFavorites,
  setFavorites,
  setLoading,
  setError,
  toggleFavorite,
  addToFavorites,
  removeFromFavorites,
} = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.favorites;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;
export const selectFavoritesPagination = (state) => state.favorites.pagination;
export const selectIsFavorite = (state, productId) => 
  state.favorites.favorites.some(item => (item._id || item.id) === productId);
export const selectFavoritesCount = (state) => state.favorites.favorites.length;

export default favoritesSlice.reducer;
