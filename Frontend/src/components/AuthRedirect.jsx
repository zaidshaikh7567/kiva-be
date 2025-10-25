import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const AuthRedirect = ({ children, redirectTo = '/dashboard' }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // If user is already authenticated, redirect them away from auth pages
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If not authenticated, show the auth page
  return children;
};

export default AuthRedirect;
