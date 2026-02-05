# Customer Email Documentation
**Last Updated:** February 4, 2026

This document outlines all emails sent to customers throughout their journey on REVE Clothing x NOBODY.

---

## 📧 Email Overview

All emails are sent via **Resend API** from:
- **From Address:** `REVE <shop@reveclothingxnobody.com>` (all customer emails)
- **Service:** Resend API
- **Edge Function:** `send-order-email` and `send-otp`

---

## 1. 🔐 Account Creation Email

### **Status:** ⚠️ **NOT CURRENTLY IMPLEMENTED**

### **Current Behavior:**
- When users sign up via `supabase.auth.signUp()`, Supabase handles the email verification
- **No custom welcome email** is sent from the application
- Users receive Supabase's default email verification email (if email confirmation is enabled)
- After signup, users see: *"Your account is pending admin approval. You will be notified once approved."*

### **What Should Be Sent:**
```
Subject: Welcome to REVE Clothing x NOBODY!
Content: Welcome email with account details, approval status, and next steps
```

### **Recommendation:**
Create a welcome email that:
- Welcomes the user
- Explains the approval process
- Provides account information
- Links to shop and support

---

## 2. 📦 Order Confirmation Email

### **When Sent:**
- Immediately after order is successfully created
- Sent to **both registered users and guest customers**
- Triggered from `create-order` edge function

### **Email Details:**
- **Subject:** `Order Confirmed - {order_number}`
- **Type:** `confirmation`
- **From:** `REVE <shop@reveclothingxnobody.com>`

### **Email Content:**

**Header:**
- Dark background (#1a1a1a)
- "Order Confirmed!" title in white

**Body:**
- Greeting: "Hi {customer_name},"
- Message: "Thank you for your order! We've received your order and will begin processing it shortly."
- **Order Number** displayed prominently in highlighted box

**Order Details Table:**
- Product name (with size badge if available)
- Quantity
- Unit price
- Total price
- **Size:** Displayed as a badge next to product name (e.g., "Size: M")

**Order Summary:**
- Subtotal
- Shipping fee
- **Total** (bold, larger font)

**Shipping & Payment:**
- Shipping address (formatted)
- Payment method (formatted label: COD, GCash, Maya, Bank Transfer)

**Footer:**
- "If you have any questions, please contact us."

### **Code Location:**
- `supabase/functions/send-order-email/index.ts` - `generateConfirmationEmail()` function
- Triggered from: `supabase/functions/create-order/index.ts` (lines 407-443)

---

## 3. 🔔 Order Status Update Emails

### **When Sent:**
- When order status changes to: `paid`, `packed`, `shipped`, `completed`, or `cancelled`
- Triggered from `useUpdateOrderStatus` hook in frontend
- Sent to **both registered users and guest customers**

### **Email Details:**
- **Subject:** `Order {Status Label} - {order_number}`
  - Examples:
    - "Order Payment Confirmed - ORD-2026-001"
    - "Order Shipped - ORD-2026-001"
    - "Order Completed - ORD-2026-001"
- **Type:** `status_update`
- **From:** `REVE <shop@reveclothingxnobody.com>`

### **Status-Specific Messages:**

#### **Paid:**
- Status Badge: Green (#10b981)
- Message: "Your payment has been confirmed. We will start packing your order shortly."

#### **Packed:**
- Status Badge: Green (#10b981)
- Message: "Your order has been packed and is ready for shipping."

#### **Shipped:**
- Status Badge: Green (#10b981)
- Message: "Great news! Your order is on its way to you."

#### **Completed:**
- Status Badge: Green (#10b981)
- Message: "Your order has been delivered. Thank you for shopping with us!"

#### **Cancelled:**
- Status Badge: Red (#ef4444)
- Message: "Your order has been cancelled. If you did not request this, please contact us."

### **Email Content:**

**Header:**
- Dark background (#1a1a1a)
- "Order Update" title in white

**Body:**
- Greeting: "Hi {customer_name},"
- **Status badge** (color-coded, rounded pill)
- Status-specific message
- **Order Number** displayed in highlighted box

**Footer:**
- "If you have any questions, please contact us."

### **Code Location:**
- `supabase/functions/send-order-email/index.ts` - `generateStatusUpdateEmail()` function
- Triggered from: `src/hooks/useOrders.ts` - `useUpdateOrderStatus()` hook (lines 122-143)

---

## 4. ✅ Payment Confirmation Email (Xendit)

### **When Sent:**
- When Xendit payment succeeds (via webhook)
- Only for GCash/Maya payments processed through Xendit
- Automatically updates order status to `paid` and sends email

### **Email Details:**
- **Subject:** `Order Payment Confirmed - {order_number}`
- **Type:** `status_update` with `new_status: 'paid'`
- **From:** `REVE <shop@reveclothingxnobody.com>`

### **Email Content:**
Same as Order Status Update Email for "Paid" status (see section 3 above)

### **Code Location:**
- `supabase/functions/xendit-webhook/index.ts` (lines 123-148)
- Calls `send-order-email` function with payment_received type

---

## 5. 🔢 OTP Verification Email (Checkout)

### **When Sent:**
- During checkout process (before order creation)
- Sent to **both registered users and guest customers**
- Required for order verification
- Sent via email or SMS (configurable)

### **Email Details:**
- **Subject:** `Your Order Verification Code`
- **From:** `REVE <shop@reveclothingxnobody.com>`
- **Expires:** 10 minutes

### **Email Content:**

**Header:**
- Dark background (#1a1a1a)
- "Verify Your Order" title in white

**Body:**
- Greeting: "Hi {customer_name},"
- Message: "Please use the following code to confirm your order:"
- **6-digit OTP code** displayed prominently:
  - Large font (36px)
  - Bold (700 weight)
  - Letter spacing (8px)
  - Highlighted in light gray box (#f9fafb)
- Expiration notice: "This code expires in 10 minutes."
- Security notice: "If you didn't request this code, please ignore this email."

**Footer:**
- "REVE - Performance Apparel"

### **Rate Limiting:**
- Maximum 5 OTP codes per email/phone per hour
- Returns 429 error if limit exceeded

### **Code Location:**
- `supabase/functions/send-otp/index.ts` - `generateOTPEmail()` function (lines 24-54)
- Triggered from: `src/pages/Checkout.tsx` during checkout flow

---

## 6. 📸 Payment Proof Notification Email

### **When Sent:**
- When customer uploads proof of payment (for bank transfer orders)
- Notifies admin/store manager (not customer)
- **Note:** This is an admin notification, not a customer email

### **Email Details:**
- **Recipient:** Admin/store manager
- **Subject:** `Payment Proof Uploaded - Order {order_number}`
- **From:** `REVE <shop@reveclothingxnobody.com>`

### **Email Content:**
- Order details
- Customer information
- Link to view proof of payment
- Payment amount

### **Code Location:**
- `supabase/functions/notify-payment-proof/index.ts`
- Triggered from: `src/components/orders/ProofOfPaymentUpload.tsx` (line 113)

---

## 7. 🚫 Guest Checkout Emails

### **Current Behavior:**
- **Guest customers receive the same emails as registered users:**
  - ✅ Order Confirmation Email
  - ✅ Order Status Update Emails
  - ✅ OTP Verification Email (during checkout)
  - ✅ Payment Confirmation Email (if using Xendit)

### **No Special Guest-Specific Emails:**
- No "Create Account" prompts in emails
- No "Complete Your Profile" reminders
- No "Join Us" promotional emails

### **Recommendation:**
Add guest-specific email enhancements:
- Post-order email: "Create an account to track orders faster"
- Order completion email: "Sign up to save your address and order history"

---

## 📊 Email Flow Summary

### **Account Creation Flow:**
```
User Signs Up
  ↓
Supabase Email Verification (if enabled)
  ↓
❌ NO CUSTOM WELCOME EMAIL (Missing)
  ↓
Account Pending Approval
  ↓
❌ NO APPROVAL NOTIFICATION EMAIL (Missing)
```

### **Order Flow (Registered User):**
```
Place Order
  ↓
OTP Email Sent (during checkout)
  ↓
Order Created
  ↓
✅ Order Confirmation Email
  ↓
Payment Processed (if Xendit)
  ↓
✅ Payment Confirmation Email
  ↓
Status Updates
  ↓
✅ Status Update Emails (paid, packed, shipped, completed)
```

### **Order Flow (Guest User):**
```
Place Order (Guest)
  ↓
OTP Email Sent (during checkout)
  ↓
Order Created
  ↓
✅ Order Confirmation Email
  ↓
Payment Processed (if Xendit)
  ↓
✅ Payment Confirmation Email
  ↓
Status Updates
  ↓
✅ Status Update Emails (paid, packed, shipped, completed)
```

---

## 🎨 Email Design

All emails use:
- **Responsive design** (max-width: 600px)
- **Modern styling** with rounded corners and shadows
- **Dark header** (#1a1a1a) with white text
- **Clean typography** (system fonts)
- **Color-coded status badges** (green for success, red for cancelled)
- **Mobile-friendly** layout

---

## ⚙️ Email Configuration

### **Resend API Setup:**
- **API Key:** Stored in Supabase secrets as `RESEND_API_KEY`
- **From Addresses:**
  - `REVE <shop@reveclothingxnobody.com>` (OTP emails)
  - `REVE <onboarding@resend.dev>` (Order emails - **should be updated**)

### **Email Sending:**
- **Non-blocking:** Email failures don't fail the main operation
- **Error handling:** Errors are logged but don't interrupt user flow
- **Rate limiting:** OTP emails limited to 5 per hour per email/phone

---

## 🔍 Missing Email Features

### **1. Welcome Email (Account Creation)**
- ❌ Not implemented
- Should welcome new users
- Explain approval process
- Provide account benefits

### **2. Account Approval Email**
- ❌ Not implemented
- Should notify when admin approves account
- Welcome approved users
- Provide login instructions

### **3. Account Rejection Email**
- ❌ Not implemented
- Should notify if account is rejected
- Provide reason (if applicable)
- Contact information for appeals

### **4. Password Reset Email**
- ✅ Handled by Supabase Auth (default)
- Custom styling not implemented

### **5. Email Verification Reminder**
- ❌ Not implemented
- Should remind users to verify email
- Resend verification link

### **6. Guest-to-Account Conversion Email**
- ❌ Not implemented
- Post-order email suggesting account creation
- Benefits of having an account

### **7. Abandoned Cart Email**
- ❌ Not implemented
- Remind customers about items left in cart
- Offer to complete purchase

### **8. Order Cancellation Request Email**
- ❌ Not implemented
- Confirmation when customer requests cancellation
- Status updates

---

## 📝 Email Template Locations

1. **Order Confirmation:** `supabase/functions/send-order-email/index.ts` - `generateConfirmationEmail()`
2. **Status Updates:** `supabase/functions/send-order-email/index.ts` - `generateStatusUpdateEmail()`
3. **OTP Verification:** `supabase/functions/send-otp/index.ts` - `generateOTPEmail()`

---

## 🚀 Recommendations

1. **Update From Address:**
   - Change `onboarding@resend.dev` to `shop@reveclothingxnobody.com` or custom domain
   - Verify domain in Resend dashboard

2. **Add Welcome Email:**
   - Create welcome email for new account signups
   - Include account benefits and next steps

3. **Add Approval Emails:**
   - Email when account is approved
   - Email when account is rejected (with reason)

4. **Enhance Order Confirmation:**
   - Include size information in order items table
   - Add product images
   - Include tracking information (when available)

5. **Add Guest Conversion:**
   - Post-order email suggesting account creation
   - Highlight benefits (order history, faster checkout, etc.)

6. **Add Abandoned Cart:**
   - Email reminder for abandoned carts
   - Include cart items and direct checkout link

---

## 📞 Support

For questions about email functionality:
- Check Supabase Edge Function logs
- Verify Resend API configuration
- Review email templates in codebase

---

**End of Documentation**
