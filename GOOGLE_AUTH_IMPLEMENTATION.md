# Google Authentication Implementation

## Overview
This document outlines the complete Google OAuth 2.0 authentication implementation for both the Frontend (user) and Admin applications.

## Features Implemented

### Frontend (User Application)
- ✅ Google Sign In for existing users
- ✅ Google Sign Up for new users
- ✅ Integration with existing authentication flow
- ✅ Proper error handling and user feedback

### Admin Application
- ✅ Google Sign In for admin users
- ✅ Integration with admin authentication system
- ✅ Proper error handling and admin feedback

## Implementation Details

### 1. Frontend Implementation

#### Files Modified/Created:
- `src/main.jsx` - Added GoogleOAuthProvider wrapper
- `src/pages/SignIn.jsx` - Added Google login functionality
- `src/pages/SignUp.jsx` - Added Google signup functionality
- `src/services/googleAuth.js` - Google authentication service
- `src/services/apiMethod.js` - Added Google auth endpoint

#### Key Features:
- Uses authorization code flow for security
- Handles both login and signup scenarios
- Integrates with existing Redux authentication state
- Proper token management and storage
- User-friendly error messages

#### Google Login Flow:
1. User clicks "Continue with Google"
2. Google OAuth popup opens
3. User authenticates with Google
4. Google returns authorization code
5. Frontend sends code to backend
6. Backend exchanges code for user info and JWT token
7. User is logged in and redirected to dashboard

### 2. Admin Implementation

#### Files Modified/Created:
- `src/main.jsx` - Added GoogleOAuthProvider wrapper
- `src/components/LoginPage.jsx` - Added Google login functionality
- `src/services/googleAuth.js` - Admin Google authentication service
- `src/services/apiMethod.js` - Added admin auth endpoints

#### Key Features:
- Uses authorization code flow for security
- Handles admin-specific authentication
- Integrates with admin authentication system
- Proper admin token management
- Admin-specific error handling

#### Admin Google Login Flow:
1. Admin clicks "Continue with Google"
2. Google OAuth popup opens
3. Admin authenticates with Google
4. Google returns authorization code
5. Frontend sends code to admin backend
6. Backend exchanges code for admin info and JWT token
7. Admin is logged in and redirected to admin dashboard

## API Endpoints Required

### Frontend Endpoints
- `POST /api/auth/google` - Exchange Google authorization code for user token

### Admin Endpoints
- `POST /api/admin/auth/google` - Exchange Google authorization code for admin token

## Backend Implementation Requirements

### User Authentication Endpoint (`/api/auth/google`)

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
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "firstName": "First",
    "lastName": "Last",
    "image": "https://profile-image-url.jpg"
  }
}
```

### Admin Authentication Endpoint (`/api/admin/auth/google`)

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
  "token": "admin_jwt_token_here",
  "admin": {
    "id": "admin_id",
    "email": "admin@example.com",
    "name": "Admin Name",
    "firstName": "First",
    "lastName": "Last",
    "image": "https://profile-image-url.jpg",
    "role": "admin"
  }
}
```

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=your_backend_url
```

### Admin (.env)
```
VITE_API_BASE_URL=your_backend_url
```

### Backend (.env)
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
```

## Google OAuth Configuration

### Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Configure authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)

### Client ID Configuration
The Google Client ID is currently set in both applications:
- Frontend: `742224364199-7lsqlarog8klqcn4a0ed6q74nbp1omk6.apps.googleusercontent.com`
- Admin: `742224364199-7lsqlarog8klqcn4a0ed6q74nbp1omk6.apps.googleusercontent.com`

**Note:** Replace with your actual Google OAuth Client ID in production.

## Security Considerations

1. **Authorization Code Flow**: Uses secure authorization code flow instead of implicit flow
2. **Token Storage**: Tokens are stored securely in localStorage
3. **HTTPS**: Ensure HTTPS is used in production
4. **CORS**: Configure proper CORS headers on backend
5. **Token Validation**: Backend validates Google tokens before issuing JWT
6. **User Verification**: Backend verifies user/admin permissions

## Testing

### Frontend Testing
1. Navigate to `/sign-in` or `/sign-up`
2. Click "Continue with Google"
3. Complete Google authentication
4. Verify user is logged in and redirected to dashboard

### Admin Testing
1. Navigate to admin login page
2. Click "Continue with Google"
3. Complete Google authentication
4. Verify admin is logged in and redirected to admin dashboard

## Error Handling

### Frontend Error Handling
- Network errors are caught and displayed to user
- Invalid Google responses are handled gracefully
- User-friendly error messages via toast notifications

### Admin Error Handling
- Network errors are caught and displayed to admin
- Invalid Google responses are handled gracefully
- Admin-specific error messages via toast notifications

## Dependencies Added

### Frontend
- `@react-oauth/google` - Already installed

### Admin
- `@react-oauth/google` - Installed during implementation

## Future Enhancements

1. **Social Login Options**: Add Facebook, Twitter, etc.
2. **Account Linking**: Link Google accounts with existing accounts
3. **Profile Sync**: Sync Google profile data with user profiles
4. **Two-Factor Authentication**: Add 2FA for enhanced security
5. **Session Management**: Implement proper session management

## Troubleshooting

### Common Issues
1. **Invalid Client ID**: Ensure Google Client ID is correct
2. **CORS Errors**: Configure backend CORS properly
3. **Redirect URI Mismatch**: Ensure redirect URIs match in Google Console
4. **Token Expiry**: Implement proper token refresh logic

### Debug Steps
1. Check browser console for errors
2. Verify Google OAuth configuration
3. Test backend endpoints independently
4. Check network requests in browser dev tools

## Support

For issues or questions regarding Google authentication implementation, refer to:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)
