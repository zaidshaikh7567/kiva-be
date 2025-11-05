
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import AuthInitializer from './components/AuthInitializer'
import CartInitializer from './components/CartInitializer'
import FavoritesInitializer from './components/FavoritesInitializer'

function App() {
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
