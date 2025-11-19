import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';
import toast from 'react-hot-toast';

const buildQueryString = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search = '',
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  });

  if (status) {
    queryParams.append('status', status);
  }

  if (search) {
    queryParams.append('search', search.trim());
  }

  return queryParams.toString();
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString(params);
      const response = await api.get(`${API_METHOD.orders}?${queryString}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch orders';
      return rejectWithValue(message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_METHOD.orders}/${orderId}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch order details';
      return rejectWithValue(message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_METHOD.orders}/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update order status';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  currentOrder: null,
  loading: false,
  updating: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload?.data || action.payload;
        const orders = responseData?.orders || responseData?.data || [];
        const pagination = responseData?.pagination || {};

        state.items = Array.isArray(orders) ? orders : [];
        state.pagination = {
          page: pagination.page || state.pagination.page,
          limit: pagination.limit || state.pagination.limit,
          total: pagination.total || state.items.length,
          totalPages: pagination.totalPages || pagination.total_pages || 1,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload || 'Failed to fetch orders';
        toast.error(state.error);
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        const order = action.payload?.data || action.payload;
        state.currentOrder = order || null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order details';
        toast.error(state.error);
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updatedOrder = action.payload?.data || action.payload;
        if (updatedOrder && updatedOrder._id) {
          const idx = state.items.findIndex((order) => order._id === updatedOrder._id);
          if (idx !== -1) {
            state.items[idx] = updatedOrder;
          }
          if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
            state.currentOrder = updatedOrder;
          }
        }
        toast.success('Order status updated successfully');
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to update order status';
        toast.error(state.error);
      });
  },
});

export const { clearOrdersError, clearCurrentOrder } = ordersSlice.actions;

export const selectAdminOrders = (state) => state.orders.items;
export const selectAdminOrdersLoading = (state) => state.orders.loading;
export const selectAdminOrdersUpdating = (state) => state.orders.updating;
export const selectAdminOrdersPagination = (state) => state.orders.pagination;
export const selectAdminCurrentOrder = (state) => state.orders.currentOrder;
export const selectAdminOrdersError = (state) => state.orders.error;

export default ordersSlice.reducer;

