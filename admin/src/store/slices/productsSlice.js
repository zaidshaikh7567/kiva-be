import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = { page: 1, limit: 10, category: '' }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      
      const url = `${API_METHOD.products}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await api.get(url);
      return response.data;
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
      formData.append('price', productData.price.toString());
      formData.append('quantity', productData.quantity.toString());
      formData.append('categoryId', productData.categoryId);
      
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
      formData.append('price', data.price.toString());
      formData.append('quantity', data.quantity.toString());
      
      // Add categoryId if provided
      if (data.categoryId) {
        formData.append('categoryId', data.categoryId);
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
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    loading: false,
    error: null,
    success: null,
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
        state.items = action.payload.products || action.payload;
        state.success = 'Products fetched successfully!';
        
        // Update pagination if provided
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
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

export const { clearError, clearSuccess, setPagination } = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsSuccess = (state) => state.products.success;
export const selectProductsPagination = (state) => state.products.pagination;

export default productsSlice.reducer;
