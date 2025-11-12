import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../store/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    // Check if we have tokens in localStorage
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (accessToken && user && !isAuthenticated) {
      // Initialize auth state from localStorage
      dispatch(initializeAuth());
    }
    
    // Give a small delay to allow Redux state to update
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch, isAuthenticated]);

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-black-light font-montserrat-regular-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Check both Redux state and localStorage as fallback
  const hasToken = localStorage.getItem('accessToken');
  const hasUser = localStorage.getItem('user');
  const isAuth = isAuthenticated || (hasToken && hasUser);

  if (!isAuth) {
    // Redirect to sign-in page if not authenticated
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;

