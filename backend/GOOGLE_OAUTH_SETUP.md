# Google OAuth Setup Guide for Backend

## Overview
This backend supports Google OAuth 2.0 authentication for both **login** and **signup**. The same endpoint handles both scenarios by detecting if a user already exists.

## API Endpoint

**Endpoint:** `POST /api/auth/google`

**Request Body:**
```json
{
  "code": "authorization_code_from_google"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Google login successful" // or "Google signup successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "profileImage": "https://profile-image-url.jpg" // or null
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "isNewUser": false // true for signup, false for login
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## How It Works

1. **Frontend** sends Google authorization code to backend
2. **Backend** exchanges code for access token with Google
3. **Backend** fetches user info from Google
4. **Backend** checks if user exists:
   - **If user exists** → Login (updates user info if needed)
   - **If user doesn't exist** → Signup (creates new user)
5. **Backend** generates JWT tokens and returns user data

## Setup Instructions

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: **Web application**
   - Name: Your application name
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `http://localhost:3000` (if different)
     - Your production domain
   - Authorized redirect URIs:
     - `http://localhost:5173` (development - frontend URL)
     - Your production domain
   - Click "Create"
5. Copy **Client ID** and **Client Secret**

### Step 2: Configure Environment Variables

Add these to your `.env.development` or `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URL=http://localhost:5173

# JWT Configuration (if not already set)
JWT_ACCESS_SECRET=your_jwt_access_secret_min_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_min_32_characters
```

**Important Notes:**
- `GOOGLE_REDIRECT_URL` should match your **frontend URL** (where Google redirects after authentication)
- This is NOT the backend URL
- For production, use your production frontend URL

### Step 3: Verify Frontend Configuration

Ensure your frontend has:

1. **Google OAuth Provider** set up in `main.jsx`:
```javascript
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = 'your_google_client_id_here';

<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  {/* Your app */}
</GoogleOAuthProvider>
```

2. **API endpoint** configured:
```javascript
// Should point to: /api/auth/google
const API_BASE_URL = 'http://localhost:5000'; // or your backend URL
```

### Step 4: Test the Setup

1. Start your backend server:
```bash
cd backend
npm start
```

2. Start your frontend:
```bash
cd Frontend
npm run dev
```

3. Test Google login/signup:
   - Click "Continue with Google" on sign-in or sign-up page
   - Complete Google authentication
   - Verify user is created/logged in correctly

## Troubleshooting

### Error: "Google OAuth credentials are not configured"
- **Solution:** Check that all environment variables are set in your `.env` file
- Verify the variables are loaded correctly

### Error: "redirect_uri_mismatch"
- **Solution:** 
  - Ensure `GOOGLE_REDIRECT_URL` in backend matches the frontend URL
  - Verify the redirect URI in Google Cloud Console matches exactly
  - Check for trailing slashes or protocol differences (http vs https)

### Error: "invalid_grant"
- **Solution:**
  - Authorization codes expire quickly (usually within 1 minute)
  - Make sure the frontend sends the code immediately after receiving it
  - Check that the code is being sent correctly

### Error: "access_denied"
- **Solution:**
  - User canceled the Google authentication
  - Check that the Google OAuth consent screen is configured
  - Verify the required scopes are requested

### User not found/created issues
- **Check:** Database connection is working
- **Verify:** User model schema includes `googleId` field
- **Ensure:** MongoDB is running and accessible

## Security Notes

1. **Never commit** `.env` files to version control
2. **Use different** Client IDs for development and production
3. **Keep** Client Secret secure and never expose it in frontend code
4. **Validate** redirect URIs in production
5. **Use HTTPS** in production

## Features

✅ **Automatic Login/Signup Detection**
- Automatically detects if user exists
- Creates new user for signup
- Logs in existing user

✅ **Profile Image Sync**
- Automatically saves Google profile picture
- Updates profile image if user doesn't have one

✅ **Account Linking**
- Links Google account to existing email-based account
- Updates user information from Google

✅ **JWT Token Generation**
- Generates access and refresh tokens
- Returns user data with authentication tokens

## Testing

You can test the endpoint using Postman or curl:

```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "code": "authorization_code_from_google"
  }'
```

Replace `authorization_code_from_google` with an actual authorization code obtained from Google OAuth flow.

## Support

For issues or questions:
1. Check the error message in the API response
2. Verify all environment variables are set correctly
3. Ensure Google Cloud Console credentials are configured properly
4. Check server logs for detailed error information
