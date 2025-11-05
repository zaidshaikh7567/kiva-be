import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';
import toast from 'react-hot-toast';

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};
console.log('isAuthen ticated :', isAuthenticated());


// Helper function to safely convert to number
const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Async thunks for API operations
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        // Return empty cart if not authenticated
        return { data: [] };
      }
      const response = await api.get(API_METHOD.cart);
      console.log('response :', response);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch cart items';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async (cartData, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log('isAuthenticated :', isAuthenticated);
      if (!isAuthenticated()) {
        // Redirect to login page if not authenticated
        toast.error('Please login to add items to cart', {
          duration: 3000,
          icon: '🔒',
        });
        // Store the current URL to redirect back after login
        // const currentPath = window.location.pathname;
        // window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`;
        return rejectWithValue('Authentication required');
      }
      
      // Check if product already exists in cart
      const currentState = getState();
      const existingItem = currentState.cart.items.find(item => {
        const itemProductId = item.product?._id || item.product?.id || item._id?.product || item.productId;
        return itemProductId === cartData.productId;
      });
      
      if (existingItem) {
        toast.error('This product is already in your cart', {
          duration: 3000,
          position: 'top-right',
        });
        return rejectWithValue('Product already exists in cart');
      }
      
      const response = await api.post(API_METHOD.cart, cartData);
      console.log('response********* :', response.data);
      // toast.success('Item added to cart!');
      await dispatch(fetchCartItems()); // Refresh cart after adding
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add item to cart';
      // Only show error toast if it's not the duplicate product error we already handled
      if (errorMessage !== 'Product already exists in cart') {
        toast.error(errorMessage);
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartId, cartData }, { rejectWithValue, dispatch }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Authentication required');
      }
      // Include cartId in URL path: /api/cart/:id
      const response = await api.put(`${API_METHOD.cart}/${cartId}`, cartData);
      console.log('response********* :', response.data);
      await dispatch(fetchCartItems()); // Refresh cart after updating
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update cart item';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (cartId, { rejectWithValue, dispatch }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Authentication required');
      }
      const response = await api.delete(`${API_METHOD.cart}/${cartId}`);
      toast.success('Item removed from cart');
      await dispatch(fetchCartItems()); // Refresh cart after deleting
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete cart item';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const clearCartItems = createAsyncThunk(
  'cart/clearCartItems',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Authentication required');
      }
      const response = await api.delete(API_METHOD.cart);
      toast.success('Cart cleared');
      await dispatch(fetchCartItems()); // Refresh cart after clearing
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to clear cart';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isOpen: false,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Require authentication for adding to cart
      if (!isAuthenticated()) {
        toast.error('Please login to add items to cart', {
          duration: 3000,
          icon: '🔒',
        });
        // Store the current URL to redirect back after login
        // const currentPath = window.location.pathname;
        // window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`;
        return; // Don't add the item
      }
      
      const product = action.payload;
      const productId = product._id || product.id;
      const existingItem = state.items.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        // Normalize product data structure
        const normalizedProduct = {
          id: productId,
          name: product.title || product.name,
          title: product.title || product.name,
          price: product.price,
          image: product.images?.[0]?.url || product.images?.[0] || product.image,
          images: product.images,
          description: product.description,
          quantity: 1,
          selectedMetal: product.selectedMetal,
          ringSize: product.ringSize,
          _id: product._id,
        };
        state.items.push(normalizedProduct);
      }
      
      // Update totals
      state.totalQuantity = state.items.reduce((total, item) => total + toNumber(item.quantity), 0);
      state.totalPrice = state.items.reduce((total, item) => total + (toNumber(item.price) * toNumber(item.quantity)), 0);
      
      // Auto-open cart when item is added
      state.isOpen = true;
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload._id || action.payload.id || action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      // Update totals
      state.totalQuantity = state.items.reduce((total, item) => total + toNumber(item.quantity), 0);
      state.totalPrice = state.items.reduce((total, item) => total + (toNumber(item.price) * toNumber(item.quantity)), 0);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemId = typeof id === 'object' ? (id._id || id.id) : id;
      
      // Try to find item by both _id and id
      const existingItem = state.items.find(item => 
        item._id === itemId || item.id === itemId || item.cartId === itemId
      );
      
      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => 
            item._id !== itemId && item.id !== itemId && item.cartId !== itemId
          );
        } else {
          // Store original quantity and calculatedPrice before updating
          const originalQuantity = existingItem.quantity || 1;
          const originalCalculatedPrice = existingItem.calculatedPrice;
          
          // Update quantity
          existingItem.quantity = quantity;
          
          // Optimistically update calculatedPrice when quantity changes
          // If calculatedPrice exists, recalculate it based on per-unit price
          if (originalCalculatedPrice !== undefined && originalCalculatedPrice !== null && originalQuantity > 0) {
            // Calculate per-unit price: original calculatedPrice / original quantity
            const perUnitPrice = originalCalculatedPrice / originalQuantity;
            existingItem.calculatedPrice = perUnitPrice * quantity;
          } else {
            // Fallback: calculate using backend formula if calculatedPrice doesn't exist
            const productPrice = toNumber(existingItem.product?.price || existingItem.price || 0);
            const metalMultiplier = toNumber(existingItem.purityLevel?.priceMultiplier || 1);
            const stonePrice = toNumber(existingItem.stoneType?.price || 0);
            existingItem.calculatedPrice = ((productPrice * metalMultiplier) + stonePrice) * quantity;
          }
        }
        
        // Update totals - use calculatedPrice if available, otherwise calculate
        state.totalQuantity = state.items.reduce((total, item) => total + toNumber(item.quantity), 0);
        state.totalPrice = state.items.reduce((total, item) => {
          // Use calculatedPrice if available (from backend), otherwise calculate
          if (item.calculatedPrice !== undefined && item.calculatedPrice !== null) {
            return total + toNumber(item.calculatedPrice);
          }
          // Fallback calculation
          const productPrice = toNumber(item.product?.price || item.price || 0);
          const metalMultiplier = toNumber(item.purityLevel?.priceMultiplier || 1);
          const stonePrice = toNumber(item.stoneType?.price || 0);
          const itemPrice = ((productPrice * metalMultiplier) + stonePrice) * toNumber(item.quantity || 1);
          return total + itemPrice;
        }, 0);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
    
    initializeCart: () => {
      // Cart will be loaded via fetchCartItems when authenticated
      // No localStorage initialization needed
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload.data || [];
        
        // Normalize cart items from API
        state.items = cartData.map(item => {
          // If item has nested product structure (from API)
          // if (item.product) {
          //   return {
          //     id: item._id || item.id,
          //     _id: item._id,
          //     name: item.product.title || item.product.name,
          //     title: item.product.title || item.product.name,
          //     price: toNumber(item.price || item.product.price),
          //     image: item.product.images?.[0]?.url || item.product.images?.[0] || item.product.image,
          //     images: item.product.images,
          //     description: item.product.description,
          //     quantity: toNumber(item.quantity || 1),
          //     selectedMetal: item.metal ? {
          //       metalId: item.metal._id,
          //       karat: item.purityLevel?.karat,
          //       color: item.metal.color,
          //       priceMultiplier: item.purityLevel?.priceMultiplier,
          //     } : null,
          //     stoneTypeId: item.stoneType?._id,
          //   };
          // }
          // If item is already in the correct format (from localStorage)
          return item;
        });
        
        // Update totals - use calculatedPrice if available (from backend), otherwise calculate
        state.totalQuantity = state.items.reduce((total, item) => total + toNumber(item.quantity), 0);
        state.totalPrice = state.items.reduce((total, item) => {
          // Use calculatedPrice if available (from backend)
          if (item.calculatedPrice !== undefined && item.calculatedPrice !== null) {
            return total + toNumber(item.calculatedPrice);
          }
          // Fallback calculation using backend formula
          const productPrice = toNumber(item.product?.price || item.price || 0);
          const metalMultiplier = toNumber(item.purityLevel?.priceMultiplier || 1);
          const stonePrice = toNumber(item.stoneType?.price || 0);
          const itemPrice = ((productPrice * metalMultiplier) + stonePrice) * toNumber(item.quantity || 1);
          return total + itemPrice;
        }, 0);
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add cart item
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state) => {
        state.loading = false;
        state.isOpen = true;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete cart item
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear cart items
      .addCase(clearCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
      })
      .addCase(clearCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  initializeCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;
