import { createSlice } from '@reduxjs/toolkit';

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

const initialState = {
  favorites: loadFavoritesFromStorage(),
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      const existingFavorite = state.favorites.find(item => (item._id || item.id) === productId);
      
      if (!existingFavorite) {
        state.favorites.push(product);
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter(item => (item._id || item.id) !== productId);
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      const existingIndex = state.favorites.findIndex(item => (item._id || item.id) === productId);
      
      if (existingIndex !== -1) {
        // Remove from favorites
        state.favorites.splice(existingIndex, 1);
      } else {
        // Add to favorites
        state.favorites.push(product);
      }
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      // Clear from localStorage
      localStorage.removeItem('favorites');
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  setFavorites,
  setLoading,
  setError,
} = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.favorites;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;
export const selectIsFavorite = (state, productId) => 
  state.favorites.favorites.some(item => (item._id || item.id) === productId);
export const selectFavoritesCount = (state) => state.favorites.favorites.length;

export default favoritesSlice.reducer;
