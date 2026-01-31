# User Approval System Implementation

**Date:** January 29, 2025  
**Status:** ✅ Complete

---

## Overview

Implemented a comprehensive admin approval system for email signups. New users must be approved by an admin before they can log in to their accounts.

---

## What Was Implemented

### 1. Database Migration
**File:** `supabase/migrations/20250129000000_add_user_approval_system.sql`

- Created `user_approvals` table to track approval status
- Added database trigger to automatically create pending approval on user signup
- Created RLS policies for secure access
- Added helper functions for checking approval status

**Key Features:**
- Status: `pending`, `approved`, or `rejected`
- Tracks who approved/rejected and when
- Optional rejection reason field
- Automatic creation on signup

### 2. Authentication Context Updates
**File:** `src/contexts/AuthContext.tsx`

- Added `isApproved` and `approvalStatus` to context
- Updated `signIn` to check approval status before allowing login
- Automatically signs out users who aren't approved (unless admin)
- Updated `signUp` to inform users about approval requirement

### 3. User Approval Hooks
**File:** `src/hooks/useUserApprovals.ts`

Created hooks for managing user approvals:
- `usePendingUsers()` - Get all pending approvals
- `useAllUserApprovals()` - Get all approval history
- `useApproveUser()` - Approve a user
- `useRejectUser()` - Reject a user with optional reason

### 4. Admin Interface Component
**File:** `src/components/admin/UserApprovals.tsx`

Created comprehensive admin interface:
- View pending approvals with user emails
- Approve/reject users with one click
- View full approval history
- Optional rejection reason field
- Real-time updates

### 5. Updated Signup/Login Pages
**Files:**
- `src/pages/AdminLogin.tsx`
- `src/components/checkout/CheckoutAuth.tsx`

- Updated signup messages to inform users about approval requirement
- Updated login to show approval error messages
- Prevents login for unapproved users

### 6. Admin Dashboard Integration
**File:** `src/pages/Admin.tsx`

- Added "User Approvals" tab to admin sidebar
- Badge showing count of pending approvals
- Integrated UserApprovals component

### 7. Edge Function for User Emails
**File:** `supabase/functions/get-user-emails/index.ts`

- Created edge function to fetch user emails (since auth.users isn't directly queryable)
- Secured with admin-only access
- Returns email and creation date for user IDs

---

## How It Works

### User Signup Flow

1. User signs up with email/password
2. Supabase creates auth user
3. Database trigger automatically creates `user_approvals` record with status `pending`
4. User sees message: "Your account is pending admin approval"
5. User cannot log in until approved

### Admin Approval Flow

1. Admin logs into admin dashboard
2. Navigates to "User Approvals" tab
3. Sees list of pending users with email addresses
4. Clicks "Approve" or "Reject" button
5. If rejected, can optionally provide reason
6. User's approval status is updated in database

### User Login Flow

1. User attempts to log in
2. System checks approval status
3. If `pending` or `rejected`: User is signed out and shown error message
4. If `approved`: User can log in normally
5. Admins bypass approval check (can always log in)

---

## Database Schema

```sql
CREATE TABLE public.user_approvals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only view their own approval status
- ✅ Only admins can view all approvals and approve/reject
- ✅ Admin-only edge function for fetching emails
- ✅ Automatic signout for unapproved login attempts

---

## Next Steps

### To Deploy:

1. **Run Database Migration:**
   ```sql
   -- Run the migration file in Supabase SQL Editor
   supabase/migrations/20250129000000_add_user_approval_system.sql
   ```

2. **Deploy Edge Function:**
   ```bash
   supabase functions deploy get-user-emails
   ```

3. **Test the System:**
   - Sign up as a new user
   - Verify approval record is created
   - Log in as admin
   - Approve the new user
   - Test login with approved user

---

## Usage Notes

- **Existing Users:** Users who signed up before this system was implemented won't have approval records. You may need to manually approve them or create a migration script.

- **Admin Bypass:** Admins can always log in regardless of approval status. This is intentional for system access.

- **Email Fetching:** The edge function requires admin authentication. Make sure the function is deployed and accessible.

- **Rejection Reasons:** Optional but recommended for transparency and record-keeping.

---

## Files Modified/Created

### Created:
- `supabase/migrations/20250129000000_add_user_approval_system.sql`
- `src/hooks/useUserApprovals.ts`
- `src/components/admin/UserApprovals.tsx`
- `supabase/functions/get-user-emails/index.ts`
- `USER_APPROVAL_SYSTEM.md` (this file)

### Modified:
- `src/contexts/AuthContext.tsx`
- `src/pages/AdminLogin.tsx`
- `src/components/checkout/CheckoutAuth.tsx`
- `src/pages/Admin.tsx`

---

## Testing Checklist

- [ ] New user signup creates pending approval
- [ ] Unapproved user cannot log in
- [ ] Admin can view pending approvals
- [ ] Admin can approve users
- [ ] Admin can reject users with reason
- [ ] Approved users can log in
- [ ] Rejected users cannot log in
- [ ] Admin can always log in (bypass)
- [ ] Approval history shows correctly
- [ ] Badge count updates in sidebar

---

**Implementation Complete!** 🎉

