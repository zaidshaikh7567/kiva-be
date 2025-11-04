import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { store } from './store/store.js'
import './index.css'
import App from './App.jsx'

// Google OAuth Client ID - Replace with your actual Google OAuth Client ID
const GOOGLE_CLIENT_ID = '742224364199-7lsqlarog8klqcn4a0ed6q74nbp1omk6.apps.googleusercontent.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
