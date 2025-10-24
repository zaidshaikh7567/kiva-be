
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import AuthInitializer from './components/AuthInitializer'
import CartInitializer from './components/CartInitializer'

function App() {
  return (
    <AuthProvider>
      <AuthInitializer>
        <CartInitializer>
          <AppRoutes />
        </CartInitializer>
      </AuthInitializer>
    </AuthProvider>
  )
}

export default App
