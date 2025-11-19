
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import AuthInitializer from './components/AuthInitializer'
import CartInitializer from './components/CartInitializer'
import FavoritesInitializer from './components/FavoritesInitializer'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchStones } from './store/slices/stonesSlice'
import { fetchMetals } from './store/slices/metalsSlice'

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStones({ page: 1, limit: 100 }));
    dispatch(fetchMetals());
  }, [dispatch]);
  return (
    <AuthProvider>
      <AuthInitializer>
        <CartInitializer>
          <FavoritesInitializer>
            <AppRoutes />
          </FavoritesInitializer>
        </CartInitializer>
      </AuthInitializer>
    </AuthProvider>
  )
}

export default App
