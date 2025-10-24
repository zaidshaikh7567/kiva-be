import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_METHOD.categories);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_METHOD.categories}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      // Check if categoryData is FormData to set proper headers
      const isFormData = categoryData instanceof FormData;
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};

      const response = await api.post(API_METHOD.categories, categoryData, config);
      
      toast.success('Category created successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create category';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }, { rejectWithValue }) => { 
    try {
      // Check if data is FormData
      const isFormData = data instanceof FormData;
      
      let apiData;
      let config;
      
      if (isFormData) {
        // If FormData, use it directly with multipart headers
        apiData = data;
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        };
      } else {
        // Otherwise, transform to JSON
        apiData = {
          name: data.name,
          parentId: data.parentId
        };
        config = {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        };
      }
  
      const response = await api.put(`${API_METHOD.categories}/${id}`, apiData, config);
      
      toast.success('Category updated successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update category';
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_METHOD.categories}/${id}`);
      toast.success('Category deleted successfully!');
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete category';
      toast.error(errorMessage);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  success: null,
};

// Categories slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.success = 'Category created successfully';
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.success = 'Category updated successfully';
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        state.success = 'Category deleted successfully';
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});

// Export actions
export const { clearError, clearSuccess, setCurrentCategory, clearCurrentCategory } = categoriesSlice.actions;

// Export selectors
export const selectCategories = (state) => state.categories.categories;
export const selectCurrentCategory = (state) => state.categories.currentCategory;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoriesSuccess = (state) => state.categories.success;

export default categoriesSlice.reducer;
