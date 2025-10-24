import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeCart, fetchCartItems } from '../store/slices/cartSlice';

const CartInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize cart from localStorage
    dispatch(initializeCart());
    
    // Fetch cart from API if user is authenticated
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(fetchCartItems());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return children;
};

export default CartInitializer;

