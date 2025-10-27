# Google OAuth Setup Guide

## Overview
This application uses Google OAuth 2.0 for authentication. The frontend uses the authorization code flow to securely authenticate users.

## Flow Diagram

1. **User clicks "Continue with Google"** → Opens Google OAuth popup
2. **User authenticates with Google** → Google redirects back with authorization code
3. **Frontend sends code to backend** → Exchange code for user info and JWT token
4. **Backend returns user data** → Save token and navigate to dashboard

## Frontend Implementation

### Files Modified

1. **`src/main.jsx`**
   - Added `GoogleOAuthProvider` wrapper
   - Set `GOOGLE_CLIENT_ID` (replace with your actual Client ID)

2. **`src/pages/SignIn.jsx`**
   - Integrated `useGoogleLogin` hook
   - Handles authorization code flow
   - Sends code to backend API
   - Manages authentication state

3. **`src/services/googleAuth.js`** (NEW)
   - `exchangeGoogleCode(code)` - Sends code to backend
   - `handleGoogleLogin(code)` - Main handler function

## Backend Requirements

### API Endpoint Needed

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

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Backend Implementation Steps

### 1. Exchange Authorization Code for Access Token

Use Google's token endpoint to exchange the authorization code:

```javascript
// Node.js example with axios
const response = await axios.post('https://oauth2.googleapis.com/token', {
  code: authorizationCode,
  client_id: GOOGLE_CLIENT_ID,
  client_secret: GOOGLE_CLIENT_SECRET,
  redirect_uri: 'http://localhost:5173', // Your frontend URL
  grant_type: 'authorization_code',
});

const { access_token } = response.data;
```

### 2. Get User Info from Google

```javascript
const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});

const { email, name, picture, given_name, family_name } = userResponse.data;
```

### 3. Create or Update User in Database

```javascript
// Find or create user in database
let user = await User.findOne({ email });

if (!user) {
  user = await User.create({
    email,
    firstName: given_name,
    lastName: family_name,
    name: name,
    profileImage: picture,
    authProvider: 'google',
  });
} else {
  // Update user info if needed
  user.name = name;
  user.profileImage = picture;
  await user.save();
}
```

### 4. Generate JWT Token

```javascript
const token = jwt.sign(
  { 
    userId: user._id, 
    email: user.email 
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

### 5. Return Response

```javascript
res.json({
  success: true,
  token,
  user: {
    id: user._id,
    email: user.email,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.profileImage,
  },
});
```

## Complete Backend Route Example (Node.js/Express)

```javascript
// routes/auth.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/google', async (req, res) => {
  try {
    const { code } = req.body;

    // 1. Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    // 2. Get user info
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, picture, given_name, family_name } = userResponse.data;

    // 3. Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        firstName: given_name,
        lastName: family_name,
        name,
        profileImage: picture,
        authProvider: 'google',
      });
    } else {
      user.name = name;
      user.profileImage = picture;
      await user.save();
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Return response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error_description || 'Authentication failed',
    });
  }
});

module.exports = router;
```

## Environment Variables

Add these to your backend `.env` file:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173
JWT_SECRET=your_jwt_secret
```

## Update Frontend Endpoint

Update the endpoint in `src/services/googleAuth.js`:

```javascript
const GOOGLE_AUTH_ENDPOINT = '/api/auth/google'; // Change to your actual endpoint
```

## Testing

1. Configure Google OAuth credentials
2. Update `GOOGLE_CLIENT_ID` in `src/main.jsx`
3. Implement backend endpoint
4. Test the flow:
   - Click "Continue with Google"
   - Complete Google authentication
   - Verify user is logged in

## Security Notes

- Never expose `GOOGLE_CLIENT_SECRET` in frontend code
- Always validate the authorization code on the backend
- Use HTTPS in production
- Set proper CORS headers
- Validate user data before saving to database
- Use secure JWT signing with appropriate expiration
