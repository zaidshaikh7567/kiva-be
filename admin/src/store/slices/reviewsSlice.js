import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_METHOD.reviews, {
        params: { page, limit },
      });

      const payload = response.data || {};
      const reviews = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.reviews)
        ? payload.reviews
        : [];

      const pagination = payload.pagination || {
        currentPage: page,
        totalPages: 1,
        totalRecords: reviews.length,
        limit,
      };

      return { reviews, pagination };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_METHOD.reviews}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateReviewStatus = createAsyncThunk(
  'reviews/updateReviewStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_METHOD.reviews}/${id}`, { status });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  reviews: [],
  loading: false,
  deleting: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  },
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || [];
        state.pagination = {
          ...state.pagination,
          ...(action.payload.pagination || {}),
        };
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch reviews';
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message || 'Failed to delete review';
      })
      // Update Review Status
      .addCase(updateReviewStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update review status';
      });
  },
});

export const { clearError } = reviewsSlice.actions;

// Selectors
export const selectReviews = (state) => state.reviews.reviews;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsDeleting = (state) => state.reviews.deleting;
export const selectReviewsError = (state) => state.reviews.error;
export const selectReviewsPagination = (state) => state.reviews.pagination;

export default reviewsSlice.reducer;

