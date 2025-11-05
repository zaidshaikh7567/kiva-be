import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // For now, fetch all products since backend doesn't support filtering
      // We'll apply filters on the client side
      const queryParams = new URLSearchParams();
      queryParams.append('limit', 1000); // Fetch more products to filter client-side
      
      const url = `${API_METHOD.products}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      
      // Add subDescription if provided
      if (productData.subDescription) {
        formData.append('subDescription', productData.subDescription);
      }
      
      formData.append('price', productData.price.toString());
      formData.append('quantity', productData.quantity.toString());
      formData.append('categoryId', productData.categoryId);
      
      // Add metalIds as JSON array string if provided
      if (productData.metals && productData.metals.length > 0) {
        formData.append('metalIds', JSON.stringify(productData.metals));
      }
      
      // Add stoneTypeId if provided and is a valid ObjectId (24 char hex string)
      if (productData.stoneTypeId && productData.stoneTypeId.length === 24 && /^[0-9a-fA-F]{24}$/.test(productData.stoneTypeId)) {
        formData.append('stoneTypeId', productData.stoneTypeId);
      }
      
      // Add careInstruction if provided
      if (productData.careInstruction) {
        formData.append('careInstruction', productData.careInstruction);
      }
      
      // Add images if provided
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      const response = await api.post(API_METHOD.products, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Product created successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create product';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      
      // Add subDescription if provided
      if (data.subDescription) {
        formData.append('subDescription', data.subDescription);
      }
      
      formData.append('price', data.price.toString());
      formData.append('quantity', data.quantity.toString());
      
      // Add categoryId if provided
      if (data.categoryId) {
        formData.append('categoryId', data.categoryId);
      }
      
      // Add metalIds as JSON array string if provided
     if (data.metals && data.metals.length > 0) {
        formData.append('metalIds', JSON.stringify(data.metals));
      }
      
      
      // Add stoneTypeId if provided and is a valid ObjectId (24 char hex string)
      if (data.stoneTypeId && data.stoneTypeId.length === 24 && /^[0-9a-fA-F]{24}$/.test(data.stoneTypeId)) {
        formData.append('stoneTypeId', data.stoneTypeId);
      }
      
      // Add careInstruction if provided
      if (data.careInstruction) {
        formData.append('careInstruction', data.careInstruction);
      }
      
      // Add images if provided
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      const response = await api.put(`${API_METHOD.products}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Product updated successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update product';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_METHOD.products}/${id}`);
      toast.success('Product deleted successfully!');
      return { id, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    allItems: [], // Store all products for filtering
    filteredItems: [], // Store filtered products
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    loading: false,
    error: null,
    success: null,
    filters: {
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      stockFilter: 'all',
      sortBy: 'newest'
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    applyFilters: (state) => {
      let filtered = [...state.allItems];

      // Apply search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(product => 
          product.title.toLowerCase().includes(searchTerm) ||
          product?.subDescription?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply category filter
      if (state.filters.category && state.filters.category !== 'all') {
        // Products have a category object with _id and name
        filtered = filtered.filter(product => {
          const categoryId = product.category?._id || product.categoryId;
          const matches = categoryId === state.filters.category;
          console.log('Product:', product.title, 'Category ID:', categoryId, 'Filter:', state.filters.category, 'Matches:', matches);
          return matches;
        });
      }

      // Apply price range filter
      if (state.filters.minPrice) {
        filtered = filtered.filter(product => 
          product.price >= parseFloat(state.filters.minPrice)
        );
      }
      if (state.filters.maxPrice) {
        filtered = filtered.filter(product => 
          product.price <= parseFloat(state.filters.maxPrice)
        );
      }

      // Apply stock filter
      if (state.filters.stockFilter && state.filters.stockFilter !== 'all') {
        if (state.filters.stockFilter === 'in-stock') {
          filtered = filtered.filter(product => product.quantity > 0);
        } else if (state.filters.stockFilter === 'out-of-stock') {
          filtered = filtered.filter(product => product.quantity === 0);
        } else if (state.filters.stockFilter === 'low-stock') {
          filtered = filtered.filter(product => product.quantity > 0 && product.quantity <= 10);
        }
      }

      // Apply sorting
      if (state.filters.sortBy) {
        switch (state.filters.sortBy) {
          case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
            break;
          case 'oldest':
            filtered.sort((a, b) => new Date(a.createdAt || a.updatedAt) - new Date(b.createdAt || b.updatedAt));
            break;
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'stock-asc':
            filtered.sort((a, b) => a.quantity - b.quantity);
            break;
          case 'stock-desc':
            filtered.sort((a, b) => b.quantity - a.quantity);
            break;
          default:
            break;
        }
      }

      state.filteredItems = filtered;
      
      // Calculate pagination based on filtered results
      const total = filtered.length;
      const totalPages = Math.ceil(total / state.pagination.limit) || 1;
      
      // Update pagination
      state.pagination = {
        ...state.pagination,
        total,
        totalPages
      };
      
      // Apply pagination to items
      const startIndex = (state.pagination.page - 1) * state.pagination.limit;
      const endIndex = startIndex + state.pagination.limit;
      state.items = filtered.slice(startIndex, endIndex);
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: 'all',
        minPrice: '',
        maxPrice: '',
        stockFilter: 'all',
        sortBy: 'newest'
      };
      state.filteredItems = [...state.allItems];
      
      // Calculate pagination for all items
      const total = state.allItems.length;
      const limit = state.pagination.limit || 10;
      const totalPages = Math.ceil(total / limit) || 1;
      
      state.pagination = {
        ...state.pagination,
        total,
        totalPages,
        page: 1
      };
      
      // Apply pagination to items
      const startIndex = 0;
      const endIndex = limit;
      state.items = state.allItems.slice(startIndex, endIndex);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allItems = action.payload.products || action.payload;
        state.success = 'Products fetched successfully!';
        
        // Apply current filters to the new data
        let filtered = [...state.allItems];

        // Apply search filter
        if (state.filters.search) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
          );
        }

        // Apply category filter
        if (state.filters.category && state.filters.category !== 'all') {
          filtered = filtered.filter(product => {
            const categoryId = product.category?._id || product.categoryId;
            return categoryId === state.filters.category;
          });
        }

        // Apply price range filter
        if (state.filters.minPrice) {
          filtered = filtered.filter(product => 
            product.price >= parseFloat(state.filters.minPrice)
          );
        }
        if (state.filters.maxPrice) {
          filtered = filtered.filter(product => 
            product.price <= parseFloat(state.filters.maxPrice)
          );
        }

        // Apply stock filter
        if (state.filters.stockFilter && state.filters.stockFilter !== 'all') {
          if (state.filters.stockFilter === 'in-stock') {
            filtered = filtered.filter(product => product.quantity > 0);
          } else if (state.filters.stockFilter === 'out-of-stock') {
            filtered = filtered.filter(product => product.quantity === 0);
          } else if (state.filters.stockFilter === 'low-stock') {
            filtered = filtered.filter(product => product.quantity > 0 && product.quantity <= 10);
          }
        }

        // Apply sorting
        if (state.filters.sortBy) {
          switch (state.filters.sortBy) {
            case 'newest':
              filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
              break;
            case 'oldest':
              filtered.sort((a, b) => new Date(a.createdAt || a.updatedAt) - new Date(b.createdAt || b.updatedAt));
              break;
            case 'price-asc':
              filtered.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filtered.sort((a, b) => b.price - a.price);
              break;
            case 'stock-asc':
              filtered.sort((a, b) => a.quantity - b.quantity);
              break;
            case 'stock-desc':
              filtered.sort((a, b) => b.quantity - a.quantity);
              break;
            default:
              break;
          }
        }

        state.filteredItems = filtered;
        
        // Calculate pagination based on filtered results
        const total = filtered.length;
        const limit = state.pagination.limit || 10;
        const totalPages = Math.ceil(total / limit) || 1;
        
        // Update pagination
        state.pagination = {
          ...state.pagination,
          total,
          totalPages,
          page: state.pagination.page || 1,
          limit
        };
        
        // Apply pagination to items
        const startIndex = (state.pagination.page - 1) * limit;
        const endIndex = startIndex + limit;
        state.items = filtered.slice(startIndex, endIndex);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.product || action.payload);
        state.success = action.payload.message || 'Product created successfully!';
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload.product || action.payload;
        }
        state.success = action.payload.message || 'Product updated successfully!';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload.id);
        state.success = action.payload.data?.message || 'Product deleted successfully!';
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product';
      });
  },
});

export const { clearError, clearSuccess, setPagination, setFilters, applyFilters, clearFilters } = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsSuccess = (state) => state.products.success;
export const selectProductsPagination = (state) => state.products.pagination;
export const selectProductsFilters = (state) => state.products.filters;
export const selectAllProducts = (state) => state.products.allItems;

export default productsSlice.reducer;
