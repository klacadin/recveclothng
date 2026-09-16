# J&T Integration Checklist

Use this checklist when building J&T waybill automation into the current Next.js app.

## Phase 1: Get J&T Credentials

- [ ] Contact J&T Express Sales
- [ ] Request API account ID / merchant account
- [ ] Request private key for request signing
- [ ] Confirm the Philippines API base URL
- [ ] Confirm request and response formats
- [ ] Store credentials in the deployment environment only

## Phase 2: Configure Deployment Secrets

- [ ] `JNT_API_ENABLED=true`
- [ ] `JNT_API_ACCOUNT`
- [ ] `JNT_PRIVATE_KEY`
- [ ] `JNT_API_URL`
- [ ] Optional: `JNT_SENDER_NAME`
- [ ] Optional: `JNT_SENDER_PHONE`
- [ ] Optional: `JNT_SENDER_ADDRESS`

## Phase 3: Build Admin Route

- [ ] Add an authenticated Next.js admin route for waybill creation
- [ ] Require Clerk admin role
- [ ] Validate order status before calling J&T
- [ ] Sign the request according to J&T documentation
- [ ] Store `waybill_number`
- [ ] Set order status to `for_pickup`
- [ ] Return clear errors to the admin order modal

## Phase 4: Test

- [ ] Create or use a paid/preparing/packed test order
- [ ] Trigger waybill creation from Admin > Orders
- [ ] Confirm the route appears in deployment logs
- [ ] Confirm `waybill_number` is stored
- [ ] Confirm manual waybill entry still works as fallback

## Current Fallback

Automatic waybill creation is not active yet. Admin users can manually enter the waybill number in the order detail modal and mark the order for pickup.
