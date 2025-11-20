# PayPal Setup Guide

## Current Issue
Your PayPal credentials are invalid. The error "Client Authentication failed" means the CLIENT_ID or CLIENT_SECRET is incorrect, expired, or revoked.

## How to Get New PayPal Sandbox Credentials

### Step 1: Access PayPal Developer Dashboard
1. Go to **https://developer.paypal.com/**
2. Click **"Log In"** (use your PayPal business account or create a developer account)

### Step 2: Navigate to Sandbox Apps
1. Once logged in, go to **Dashboard**
2. Click on **"Apps & Credentials"** in the left sidebar
3. Make sure you're on the **"Sandbox"** tab (not "Live")

### Step 3: Create or Manage App
**Option A: Create New App**
1. Click **"Create App"** button
2. Enter an app name (e.g., "Kiva Jewelry Sandbox")
3. Select **Merchant** as the app type
4. Click **"Create App"**

**Option B: Use Existing App**
1. Find your existing app in the list
2. Click on it to view details

### Step 4: Get Credentials
1. You'll see **Client ID** and **Secret**
2. Click **"Show"** next to Secret to reveal it
3. **Copy both values** (you won't be able to see the secret again!)

### Step 5: Update Your .env File
Open `backend/.env.development` and update:

```env
PAYPAL_CLIENT_ID=your_new_client_id_here
PAYPAL_CLIENT_SECRET=your_new_secret_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

**Important:**
- No quotes around the values
- No extra spaces
- Copy the entire string (they're long!)
- Make sure there are no line breaks

### Step 6: Test Credentials
Run the test script:
```bash
cd backend
node test-paypal-credentials.js
```

You should see: `✅ SUCCESS! Credentials are valid!`

### Step 7: Restart Server
```bash
npm run dev
```

## Common Issues

### Issue: "Still getting authentication error"
**Solution:**
- Double-check you copied the ENTIRE credential (they're 80+ characters)
- Make sure there are no extra spaces or line breaks
- Verify you're using Sandbox credentials (not Live)
- Try regenerating the Secret (click "Regenerate" in PayPal dashboard)

### Issue: "Credentials work in test but not in app"
**Solution:**
- Make sure your server restarted after updating .env
- Check that NODE_ENV=development matches your Sandbox credentials
- Clear any cached environment variables

### Issue: "Can't see the Secret"
**Solution:**
- Click "Show" button next to Secret
- If you can't see it, click "Regenerate" to create a new one
- Copy it immediately (you can only see it once!)

## Testing PayPal Payments

### Sandbox Test Accounts
PayPal provides test accounts for testing:
1. Go to **Sandbox** → **Accounts**
2. Use the default **Personal** or **Business** test account
3. Or create your own test account

### Test Card Numbers (Sandbox)
- Card Number: `4032031085371234`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

## Production Setup

When ready for production:
1. Switch to **Live** tab in PayPal dashboard
2. Create a **Live App** (requires business verification)
3. Get **Live credentials**
4. Update `.env.production`:
   ```env
   NODE_ENV=production
   PAYPAL_CLIENT_ID=your_live_client_id
   PAYPAL_CLIENT_SECRET=your_live_secret
   ```

## Need Help?

- PayPal Developer Docs: https://developer.paypal.com/docs/
- PayPal Support: https://developer.paypal.com/support/

