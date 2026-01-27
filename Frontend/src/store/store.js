import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import metalsReducer from './slices/metalsSlice';
import stonesReducer from './slices/stonesSlice';
import currencyReducer from './slices/currencySlice';
import favoritesReducer from './slices/favoritesSlice';
import authReducer from './slices/authSlice';
import reviewsReducer from './slices/reviewsSlice';
import socialHandlesReducer from './slices/socialHandlesSlice';
import collectionsReducer from './slices/collectionsSlice';
import ordersReducer from './slices/ordersSlice';
import loaderReducer from './slices/loader';
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    categories: categoriesReducer,
    metals: metalsReducer,
    stones: stonesReducer,
    currency: currencyReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    reviews: reviewsReducer,
    socialHandles: socialHandlesReducer,
    collections: collectionsReducer,
    orders: ordersReducer,
    loader: loaderReducer,
  },
});

export default store;
