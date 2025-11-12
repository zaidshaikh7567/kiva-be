import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';
import toast from 'react-hot-toast';

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

// Async thunks for API operations
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Authentication required');
      }
      const response = await api.post(API_METHOD.orders, orderData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create order';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Authentication required');
      }
      const {
        page = 1,
        limit = 10,
        status = '',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (status) {
        queryParams.append('status', status);
      }

      const response = await api.get(`${API_METHOD.orders}/my-orders?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Authentication required');
      }
      const response = await api.get(`${API_METHOD.orders}/${orderId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch order';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Authentication required');
      }
      const response = await api.get(`${API_METHOD.orders}/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch order';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Authentication required');
      }
      const {
        page = 1,
        limit = 10,
        status = '',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (status) {
        queryParams.append('status', status);
      }

      const response = await api.get(`${API_METHOD.orders}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Authentication required');
      }
      const response = await api.put(`${API_METHOD.orders}/${orderId}/status`, { status });
      toast.success('Order status updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  loading: false,
  creating: false,
  error: null,
  createError: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      };
    },
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false;
        state.currentOrder = action.payload.data || action.payload;
        toast.success('Order placed successfully!');
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
        toast.error(action.payload || 'Failed to place order');
      })
      // Get my orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.data || action.payload;
        state.orders = responseData.orders || responseData || [];
        if (responseData.pagination) {
          state.pagination = {
            ...state.pagination,
            ...responseData.pagination
          };
        }
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      })
      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data || action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentOrder = null;
      })
      // Get order by number
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data || action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentOrder = null;
      })
      // Get all orders (Admin)
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.data || action.payload;
        state.orders = responseData.orders || responseData || [];
        if (responseData.pagination) {
          state.pagination = {
            ...state.pagination,
            ...responseData.pagination
          };
        }
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.data || action.payload;
        if (updatedOrder && updatedOrder._id) {
          // Update order in list if it exists
          const index = state.orders.findIndex(order => order._id === updatedOrder._id);
          if (index > -1) {
            state.orders[index] = updatedOrder;
          }
          // Update current order if it matches
          if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
            state.currentOrder = updatedOrder;
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentOrder,
  clearOrders,
  clearErrors
} = ordersSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersCreating = (state) => state.orders.creating;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersCreateError = (state) => state.orders.createError;
export const selectOrdersPagination = (state) => state.orders.pagination;

export default ordersSlice.reducer;

