import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

// Async thunks for API calls
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_METHOD.reviews);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_METHOD.reviews, reviewData);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_METHOD.reviews}/${id}`, reviewData);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_METHOD.reviews}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  reviews: [],
  loading: false,
  submitting: false,
  error: null,
  success: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
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
        state.reviews = action.payload || [];
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch reviews';
      })
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.reviews.unshift(action.payload);
        state.success = 'Review submitted successfully!';
      })
      .addCase(addReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to submit review';
      })
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.submitting = false;
        const index = state.reviews.findIndex(review => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        state.success = 'Review updated successfully!';
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to update review';
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
        state.success = 'Review deleted successfully!';
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete review';
      });
  },
});

export const { clearError, clearSuccess } = reviewsSlice.actions;

// Selectors
export const selectReviews = (state) => state.reviews.reviews;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsSubmitting = (state) => state.reviews.submitting;
export const selectReviewsError = (state) => state.reviews.error;
export const selectReviewsSuccess = (state) => state.reviews.success;
export const selectReviewsCount = (state) => state.reviews.reviews.length;
export const selectAverageRating = (state) => {
  const reviews = state.reviews.reviews;
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

export default reviewsSlice.reducer;
