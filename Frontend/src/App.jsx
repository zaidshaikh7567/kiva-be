
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
import { fetchCartItems } from './store/slices/cartSlice'
import { fetchMedia } from './store/slices/mediaSlice'
import "react-phone-input-2/lib/style.css";

// PORT=5000
// NODE_ENV=production
// CORS_ORIGIN=https://kiva-be.onrender.com

// MONGO_URI=mongodb+srv://shaikhzaidszs1035_db_user:QkK7NbYhHB2VOqse@cluster0.cgdvgnu.mongodb.net/kiva-db?retryWrites=true&w=majority&appName=Cluster0

// CLOUDINARY_CLOUD_NAME=dtrrg09h4
// CLOUDINARY_API_KEY=796819654563737
// CLOUDINARY_API_SECRET=a-3EvlDchBTr-tR7gN8CaNnqUgQ

// JWT_ACCESS_SECRET=your-production-super-secret-jwt-key-here-make-it-long-and-random
// JWT_REFRESH_SECRET=your-production-super-secret-refresh-jwt-key-here-make-it-different-and-long

// GMAIL_USER=your-production-email@gmail.com
// GMAIL_APP_PASSWORD=your-production-app-password

// PAYPAL_CLIENT_ID=AVymn9PU4Momgb0mSfg4DVJbEtyR8b8YuKiLh1HTKPU6h_lw3IZR1aC8bmOV6MlMhD-CkfO2DATtM2r5
// PAYPAL_CLIENT_SECRET=EMT6PIhbLL4g71P5G87RoeWAsUu5EBumh0Bw1PF-t-9ALx9DwR3l1lkFENcUzJL90eBODin0ROLTxmEL

// FRONTEND_URL= http://localhost:5174



function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStones({ page: 1, limit: 100 }));
    dispatch(fetchMetals());
    dispatch(fetchCartItems());
    // Fetch all active media assets (page is a string enum like 'home', 'contact', etc., not a number)
    dispatch(fetchMedia({ isActive: true }));
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
