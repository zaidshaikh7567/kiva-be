import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 9, reset = true } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_METHOD.products}?page=${page}&limit=${limit}`);
      // Return the data along with pagination info
      return {
        data: response.data.data || response.data,
        page,
        limit,
        total: response.data.total || response.data.count || 0,
        reset
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_METHOD.products}/${id}`);
      // Return only the data, not the entire response object
      // Handle both response.data.data and response.data structures
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_METHOD.products}?category=${categoryId}`);
      // Return only the data, not the entire response object
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_METHOD.products}?search=${query}`);
      // Return only the data, not the entire response object
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  filteredProducts: [],
  searchResults: [],
  loading: false,
  loadingMore: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
  pagination: {
    currentPage: 1,
    limit: 9,
    total: 0,
    hasMore: false
  }
};

// Products slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    filterProductsByCategory: (state, action) => {
      const categoryId = action.payload;
      if (categoryId) {
        state.filteredProducts = state.products.filter(
          product => product.category?._id === categoryId || product.categoryId === categoryId
        );
      } else {
        state.filteredProducts = state.products;
      }
      state.selectedCategory = categoryId;
    },
    clearFilters: (state) => {
      state.filteredProducts = state.products;
      state.selectedCategory = null;
      state.searchQuery = '';
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state, action) => {
        // If reset is true or undefined (default), set loading to true
        // Only set loadingMore if explicitly reset is false
        const shouldReset = action.meta.arg?.reset !== false;
        if (shouldReset) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        
        const products = Array.isArray(action.payload.data) ? action.payload.data : [];
        const { page, total, reset } = action.payload;
        
        if (reset) {
          // First load or reset
          state.products = products;
          state.filteredProducts = products;
        } else {
          // Load more - append products
          state.products = [...state.products, ...products];
          state.filteredProducts = [...state.filteredProducts, ...products];
        }
        
        // Update pagination
        state.pagination.currentPage = page;
        state.pagination.total = total;
        state.pagination.hasMore = state.products.length < total;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      })
      
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        // Data is already extracted in the async thunk
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Data is already extracted in the async thunk
        state.filteredProducts = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Data is already extracted in the async thunk
        state.searchResults = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { 
  clearError, 
  setCurrentProduct, 
  clearCurrentProduct, 
  setSearchQuery, 
  setSelectedCategory, 
  clearSearchResults,
  filterProductsByCategory,
  clearFilters
} = productsSlice.actions;

// Export selectors
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectFilteredProducts = (state) => state.products.filteredProducts;
export const selectSearchResults = (state) => state.products.searchResults;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsLoadingMore = (state) => state.products.loadingMore;
export const selectProductsError = (state) => state.products.error;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectPagination = (state) => state.products.pagination;

export default productsSlice.reducer;
