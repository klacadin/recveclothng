# 📧 Customer Email Summary - Visual Guide

## Quick Reference: All Customer Emails

---

### ✅ **IMPLEMENTED EMAILS**

#### 1. 🔢 **OTP Verification Email** (During Checkout)
**Sent To:** Both registered users and guest customers  
**When:** During checkout, before order creation  
**Subject:** `Your Order Verification Code`  
**From:** `REVE <shop@reveclothingxnobody.com>`

**Content:**
- 6-digit verification code (large, bold)
- Expires in 10 minutes
- Security notice

**Preview:**
```
┌─────────────────────────────────┐
│   Verify Your Order             │
├─────────────────────────────────┤
│ Hi [Customer Name],             │
│                                 │
│ Please use the following code:  │
│                                 │
│   ┌─────────────────────────┐   │
│   │    1 2 3 4 5 6         │   │
│   └─────────────────────────┘   │
│                                 │
│ Expires in 10 minutes           │
└─────────────────────────────────┘
```

---

#### 2. 📦 **Order Confirmation Email**
**Sent To:** Both registered users and guest customers  
**When:** Immediately after order is created  
**Subject:** `Order Confirmed - {order_number}`  
**From:** `REVE <shop@reveclothingxnobody.com>`

**Content:**
- Order number (highlighted)
- Complete order details table:
  - Product name
  - Quantity
  - Unit price
  - Total price
- Order summary:
  - Subtotal
  - Shipping fee
  - Total
- Shipping address
- Payment method

**Preview:**
```
┌─────────────────────────────────┐
│   Order Confirmed!              │
├─────────────────────────────────┤
│ Hi [Customer Name],             │
│                                 │
│ Thank you for your order!       │
│                                 │
│ Order Number: ORD-2026-001      │
│                                 │
│ Order Details:                  │
│ ┌─────────────────────────────┐ │
│ │ Product    Qty  Price  Total│ │
│ │ T-Shirt    2    ₱500   ₱1000│ │
│ └─────────────────────────────┘ │
│                                 │
│ Subtotal:    ₱1,000             │
│ Shipping:    ₱150                │
│ Total:       ₱1,150             │
│                                 │
│ Shipping Address:               │
│ [Full address]                  │
│                                 │
│ Payment: GCash                  │
└─────────────────────────────────┘
```

---

#### 3. 💳 **Payment Confirmation Email** (Xendit)
**Sent To:** Customers who paid via GCash/Maya through Xendit  
**When:** When Xendit payment succeeds (via webhook)  
**Subject:** `Order Payment Confirmed - {order_number}`  
**From:** `REVE <shop@reveclothingxnobody.com>`

**Content:**
- Status badge: "Payment Confirmed" (green)
- Message: "Your payment has been confirmed. We will start packing your order shortly."
- Order number

**Preview:**
```
┌─────────────────────────────────┐
│   Order Update                  │
├─────────────────────────────────┤
│ Hi [Customer Name],             │
│                                 │
│   ┌─────────────────────────┐   │
│   │ Payment Confirmed       │   │
│   └─────────────────────────┘   │
│                                 │
│ Your payment has been           │
│ confirmed. We will start        │
│ packing your order shortly.     │
│                                 │
│ Order: ORD-2026-001             │
└─────────────────────────────────┘
```

---

#### 4. 📊 **Order Status Update Emails**
**Sent To:** Both registered users and guest customers  
**When:** Order status changes (paid, packed, shipped, completed, cancelled)  
**Subject:** `Order {Status} - {order_number}`  
**From:** `REVE <shop@reveclothingxnobody.com>`

**Status Types:**

**Paid:**
- Badge: Green
- Message: "Your payment has been confirmed. We will start packing your order shortly."

**Packed:**
- Badge: Green
- Message: "Your order has been packed and is ready for shipping."

**Shipped:**
- Badge: Green
- Message: "Great news! Your order is on its way to you."

**Completed:**
- Badge: Green
- Message: "Your order has been delivered. Thank you for shopping with us!"

**Cancelled:**
- Badge: Red
- Message: "Your order has been cancelled. If you did not request this, please contact us."

---

### ❌ **MISSING EMAILS**

#### 1. 🔐 **Welcome Email** (Account Creation)
**Status:** Not implemented  
**Should Include:**
- Welcome message
- Account approval status
- Next steps
- Benefits of having an account

#### 2. ✅ **Account Approval Email**
**Status:** Not implemented  
**Should Include:**
- Approval confirmation
- Login instructions
- Account benefits

#### 3. ❌ **Account Rejection Email**
**Status:** Not implemented  
**Should Include:**
- Rejection notice
- Reason (if provided)
- Appeal process

#### 4. 📧 **Email Verification Reminder**
**Status:** Not implemented  
**Should Include:**
- Reminder to verify email
- Resend verification link

#### 5. 🛒 **Abandoned Cart Email**
**Status:** Not implemented  
**Should Include:**
- Cart items reminder
- Direct checkout link
- Limited-time offer (optional)

#### 6. 🔄 **Guest-to-Account Conversion Email**
**Status:** Not implemented  
**Should Include:**
- Post-order suggestion to create account
- Benefits (order history, faster checkout)
- Sign-up link

---

## 📋 Email Flow Diagrams

### **Guest Checkout Flow:**
```
Guest Customer
  ↓
[OTP Email] ← Verification code
  ↓
Order Created
  ↓
[Order Confirmation Email] ← Order details
  ↓
Payment (if Xendit)
  ↓
[Payment Confirmation Email] ← Payment confirmed
  ↓
Status Updates
  ↓
[Status Update Emails] ← paid → packed → shipped → completed
```

### **Registered User Flow:**
```
User Signs Up
  ↓
[❌ NO WELCOME EMAIL]
  ↓
Account Pending Approval
  ↓
[❌ NO APPROVAL EMAIL]
  ↓
Account Approved
  ↓
[❌ NO APPROVAL NOTIFICATION]
  ↓
Places Order
  ↓
[OTP Email] ← Verification code
  ↓
Order Created
  ↓
[Order Confirmation Email] ← Order details
  ↓
Payment (if Xendit)
  ↓
[Payment Confirmation Email] ← Payment confirmed
  ↓
Status Updates
  ↓
[Status Update Emails] ← paid → packed → shipped → completed
```

---

## 🎯 Email Statistics

**Currently Implemented:**
- ✅ OTP Verification: 1 email type
- ✅ Order Confirmation: 1 email type
- ✅ Status Updates: 5 email types (paid, packed, shipped, completed, cancelled)
- ✅ Payment Confirmation: 1 email type (via Xendit)

**Total Active Emails:** 8 email types

**Missing:**
- ❌ Welcome email
- ❌ Approval/rejection emails
- ❌ Abandoned cart
- ❌ Guest conversion

---

## 📝 Email Template Code Locations

1. **OTP Email:** `supabase/functions/send-otp/index.ts` - `generateOTPEmail()`
2. **Order Confirmation:** `supabase/functions/send-order-email/index.ts` - `generateConfirmationEmail()`
3. **Status Updates:** `supabase/functions/send-order-email/index.ts` - `generateStatusUpdateEmail()`

---

## 🔧 Configuration

**Email Service:** Resend API  
**API Key:** Stored in Supabase secrets (`RESEND_API_KEY`)  
**From Address:**
- `REVE <shop@reveclothingxnobody.com>` (All customer emails)

---

**For full details, see:** `CUSTOMER_EMAILS_DOCUMENTATION.md`
