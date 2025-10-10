import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
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
          _id: product._id,
        };
        state.items.push(normalizedProduct);
      }
      
      // Update totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Auto-open cart when item is added
      state.isOpen = true;
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload._id || action.payload.id || action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      // Update totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemId = typeof id === 'object' ? (id._id || id.id) : id;
      const existingItem = state.items.find(item => item.id === itemId);
      
      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          existingItem.quantity = quantity;
        }
        
        // Update totals
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
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
} = cartSlice.actions;

export default cartSlice.reducer;
