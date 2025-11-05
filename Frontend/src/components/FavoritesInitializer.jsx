import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, syncFavoritesToAPI } from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const FavoritesInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      // Sync localStorage favorites to API when user logs in
      dispatch(syncFavoritesToAPI()).then(() => {
        // After sync, fetch favorites from API
        dispatch(fetchFavorites({ page: 1, limit: 100 }));
      });
    }
  }, [isAuthenticated, dispatch]);

  return children;
};

export default FavoritesInitializer;
