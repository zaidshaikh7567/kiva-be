import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { openCart } from '../store/slices/cartSlice';

const StickyCartButton = () => {
  const dispatch = useDispatch();
  const { totalQuantity, isOpen } = useSelector(state => state.cart);

  // Hide the button when cart is open
  if (isOpen) {
    return null;
  }

  return (
    <button 
      onClick={() => dispatch(openCart())}
      className="fixed top-24 right-4 z-40 bg-primary text-white p-2 sm:p-4 rounded-full shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-300 group"
    >
      <ShoppingBag className="sm:w-6 sm:h-6 w-4 h-4" />
      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 bg-white text-primary text-xs sm:w-6 sm:h-6 w-4 h-4 flex items-center justify-center rounded-full font-montserrat-medium-500 animate-pulse">
          {totalQuantity}
        </span>
      )}
    </button>
  );
};

export default StickyCartButton;
