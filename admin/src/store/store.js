import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import productsReducer from './slices/productsSlice';
import metalsReducer from './slices/metalsSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    metals: metalsReducer,
    // Add other reducers here as needed
    // orders: ordersReducer,
    // etc.
  }

});

// TypeScript types (remove these if not using TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
