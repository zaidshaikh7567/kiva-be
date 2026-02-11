# Firebase Cloud Messaging (FCM) Setup Guide

This guide explains how to set up Firebase Cloud Messaging for the backend to send push notifications.

## Prerequisites

1. Firebase project created (already done - `kiva-diamond-f2c8a`)
2. Firebase Admin SDK installed (already in package.json)

## Setup Steps

### 1. Get Firebase Service Account Credentials

You have two options for providing Firebase Admin credentials:

#### Option A: Using Environment Variables (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `kiva-diamond-f2c8a`
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Extract the following values from the JSON:
   - `project_id`
   - `client_email`
   - `private_key`

7. Add these to your `.env.development` and `.env.production` files:

```env
FIREBASE_PROJECT_ID=kiva-diamond-f2c8a
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@kiva-diamond-f2c8a.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- The `FIREBASE_PRIVATE_KEY` must include the `\n` characters as they appear in the JSON file
- Wrap the entire private key in quotes
- Keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines

#### Option B: Using Service Account JSON File

1. Download the service account JSON file from Firebase Console
2. Save it securely in your backend directory (e.g., `backend/config/firebase-service-account.json`)
3. Add to your `.env` file:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
```

**Note:** Make sure to add `firebase-service-account.json` to `.gitignore` to avoid committing credentials.

### 2. Verify Installation

The Firebase Admin SDK is already installed. If you need to reinstall:

```bash
npm install firebase-admin
```

## API Endpoints

### User Endpoints (Authenticated)

#### Save FCM Token
```http
POST /api/notifications/token
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "fcm-device-token-here"
}
```

#### Remove FCM Token
```http
DELETE /api/notifications/token
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "fcm-device-token-here"
}
```

#### Get User's FCM Tokens
```http
GET /api/notifications/tokens
Authorization: Bearer <token>
```

#### Send Notification to Self
```http
POST /api/notifications/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Notification Title",
  "body": "Notification body text",
  "image": "https://example.com/image.jpg", // optional
  "data": { // optional
    "key1": "value1",
    "key2": "value2"
  }
}
```

### Admin Endpoints (Super Admin Only)

#### Send Notification to Specific User
```http
POST /api/notifications/send-to-user/:userId
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Notification Title",
  "body": "Notification body text",
  "image": "https://example.com/image.jpg", // optional
  "data": { // optional
    "key1": "value1"
  }
}
```

#### Send Notification to All Users
```http
POST /api/notifications/send-to-all
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Notification Title",
  "body": "Notification body text",
  "image": "https://example.com/image.jpg", // optional
  "data": { // optional
    "key1": "value1"
  },
  "filters": { // optional - filter users
    "role": "user"
  }
}
```

#### Send Notification to Specific Device
```http
POST /api/notifications/send-to-device
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "token": "fcm-device-token-here",
  "title": "Notification Title",
  "body": "Notification body text",
  "image": "https://example.com/image.jpg", // optional
  "data": { // optional
    "key1": "value1"
  }
}
```

## Usage Examples

### Frontend: Save FCM Token

```javascript
import { requestNotificationPermission } from './firebase';

// Get FCM token from frontend
const token = await requestNotificationPermission();

// Save token to backend
await fetch('/api/notifications/token', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ token }),
});
```

### Backend: Send Notification Programmatically

```javascript
const notificationService = require('./utils/notificationService');

// Send to a specific user
await notificationService.sendToUser(
  userId,
  {
    title: 'New Order',
    body: 'You have a new order!',
  },
  {
    orderId: '123',
    type: 'order',
  }
);

// Send to all users
await notificationService.sendToAllUsers(
  {
    title: 'New Collection',
    body: 'Check out our new jewelry collection!',
  },
  {
    collectionId: '456',
    type: 'collection',
  },
  { role: 'user' } // optional filters
);
```

## Features

- ✅ Automatic token management (saves/removes tokens)
- ✅ Invalid token cleanup (automatically removes invalid tokens)
- ✅ Support for multiple devices per user
- ✅ Send to single user, multiple users, or all users
- ✅ Support for notification images
- ✅ Custom data payload support
- ✅ Admin-only endpoints for sending notifications
- ✅ User filtering support

## File Structure

```
backend/
├── config/
│   └── firebase.js              # Firebase Admin initialization
├── utils/
│   └── notificationService.js   # Notification service utilities
├── routes/
│   └── notification.js          # Notification API routes
└── models/
    └── User.js                  # Updated with fcmTokens field
```

## Troubleshooting

### Error: "Firebase Admin not initialized"
- Check that environment variables are set correctly
- Verify the private key format (must include `\n` characters)
- Ensure the service account has proper permissions

### Error: "Invalid registration token"
- The token may have expired or been invalidated
- The system automatically removes invalid tokens
- User needs to get a new token from the frontend

### Notifications not received
- Verify the device token is saved in the database
- Check Firebase Console for delivery status
- Ensure the frontend service worker is properly configured
- Verify notification permissions are granted on the device

## Security Notes

- Never commit service account credentials to version control
- Use environment variables for production
- Keep service account JSON files secure
- Regularly rotate service account keys
- Use HTTPS for all API calls

