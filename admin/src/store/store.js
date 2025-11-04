import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import productsReducer from './slices/productsSlice';
import metalsReducer from './slices/metalsSlice';
import centerStonesReducer from './slices/centerStonesSlice';
import usersReducer from './slices/usersSlice';
import socialHandlesReducer from './slices/socialHandlesSlice';
import reviewsReducer from './slices/reviewsSlice';
import collectionsReducer from './slices/collectionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    products: productsReducer,
    metals: metalsReducer,
    centerStones: centerStonesReducer,
    users: usersReducer,
    socials: socialHandlesReducer,
    reviews: reviewsReducer,
    collections: collectionsReducer,
    // Add other reducers here as needed
    // orders: ordersReducer,
    // etc.
  }

});

// TypeScript types (remove these if not using TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
