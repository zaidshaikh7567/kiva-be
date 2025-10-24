import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth, getUserProfile } from '../store/slices/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
    
    // Try to fetch fresh profile if tokens exist
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(getUserProfile());
    }
  }, [dispatch]);

  return children;
};

export default AuthInitializer;

