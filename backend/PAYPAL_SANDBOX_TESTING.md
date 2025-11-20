# PayPal Sandbox Testing Guide

## ✅ Good News!
Your PayPal integration is working! The redirect to `https://www.sandbox.paypal.com/checkoutnow?token=...` means:
- ✅ PayPal order creation is successful
- ✅ Credentials are valid
- ✅ Redirect URL is correct

## ⚠️ Important: You CANNOT Use Real Accounts in Sandbox

**PayPal Sandbox is a testing environment. You MUST use:**
- ❌ **NOT** your real PayPal account
- ❌ **NOT** your real credit/debit card
- ✅ **YES** PayPal Sandbox test accounts
- ✅ **YES** PayPal Sandbox test cards

## How to Test PayPal Payments

### Option 1: Use PayPal Sandbox Test Account (Recommended)

#### Step 1: Get Sandbox Test Account
1. Go to **https://developer.paypal.com/**
2. Log in to your PayPal Developer account
3. Navigate to **Dashboard** → **Sandbox** → **Accounts**
4. You'll see default test accounts or create new ones

#### Step 2: Use Test Account Credentials
PayPal provides default test accounts:

**Personal Test Account (Buyer):**
- Email: `sb-xxxxx@personal.example.com` (check your PayPal dashboard)
- Password: (set when you create the account, or use default)
- Or create your own test account with any email

**Business Test Account (Seller):**
- Email: `sb-xxxxx@business.example.com`
- Password: (set when you create the account)

#### Step 3: Test the Payment Flow
1. When redirected to PayPal Sandbox checkout
2. Click **"Log in"** (NOT "Pay with Debit or Credit Card")
3. Use your **Sandbox test account** email and password
4. Complete the payment
5. You'll be redirected back to your app

### Option 2: Use Test Card (Without PayPal Account)

#### Step 1: Click "Pay with Debit or Credit Card"
On the PayPal checkout page, look for:
- "Pay with Debit or Credit Card" link
- Or "Don't have a PayPal account?" option

#### Step 2: Use Sandbox Test Card Numbers

**Valid Test Card Numbers (Sandbox):**

| Card Type | Card Number | Expiry | CVV | Name |
|-----------|-------------|--------|-----|------|
| Visa | `4032031085371234` | Any future date | Any 3 digits | Any name |
| Mastercard | `5424180279791732` | Any future date | Any 3 digits | Any name |
| Amex | `375956507351069` | Any future date | Any 4 digits | Any name |

**Example:**
- Card Number: `4032031085371234`
- Expiry: `12/25` (any future date)
- CVV: `123` (any 3 digits)
- Name: `Test User` (any name)
- Billing Address: Any valid address

#### Step 3: Complete Payment
- Fill in the test card details
- Use any billing address
- Click "Pay Now"
- Payment will be processed (it's fake money!)

## Common Issues & Solutions

### Issue: "Please check your entries and try again"
**Cause:** Trying to use real PayPal account in Sandbox

**Solution:**
1. Use a **Sandbox test account** (not your real PayPal account)
2. Or use **test card** option instead of logging in

### Issue: "Card not working"
**Cause:** Using real card in Sandbox

**Solution:**
- Use one of the test card numbers listed above
- Make sure you're on `sandbox.paypal.com` (not `paypal.com`)

### Issue: "Can't find test accounts"
**Solution:**
1. Go to https://developer.paypal.com/
2. Dashboard → Sandbox → Accounts
3. Click **"Create Account"** to create a new test account
4. Choose **Personal** or **Business** type
5. Set email and password (use any email, like `test@example.com`)

### Issue: "Redirect not working after payment"
**Check:**
1. Make sure `FRONTEND_URL` in `.env.development` is correct
2. Should be: `FRONTEND_URL=http://localhost:5174` (or your frontend URL)
3. Restart backend server after changing `.env`

## Testing Flow

### Complete Test Flow:
1. ✅ Add items to cart
2. ✅ Go to checkout
3. ✅ Select PayPal payment
4. ✅ Fill shipping info
5. ✅ Click "Place Order"
6. ✅ **Redirected to PayPal Sandbox** ← You're here!
7. ⏳ **Log in with Sandbox account OR use test card**
8. ✅ Complete payment
9. ✅ Redirected back to `/order/success?token=...`
10. ✅ Payment captured
11. ✅ Order confirmed
12. ✅ Cart cleared

## Quick Test Checklist

- [ ] Using Sandbox test account (not real PayPal)
- [ ] OR using test card number (not real card)
- [ ] On `sandbox.paypal.com` (check URL)
- [ ] `FRONTEND_URL` is correct in `.env.development`
- [ ] Backend server is running
- [ ] Frontend is running on correct port

## Test Card Quick Reference

```
Card Number: 4032031085371234
Expiry: 12/25
CVV: 123
Name: Test User
```

## Need Help?

- PayPal Sandbox Docs: https://developer.paypal.com/docs/api-basics/sandbox/
- PayPal Developer Support: https://developer.paypal.com/support/

