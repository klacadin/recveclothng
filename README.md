# REVE Clothing

Production storefront and admin system for REVE Clothing x Nobody.

## Stack

- Next.js 15 app router
- React 18 client app mounted through the Next catch-all route
- Tailwind CSS and shadcn/Radix UI components
- Drizzle ORM with Postgres
- Clerk authentication
- Vercel Blob uploads
- HitPay checkout and webhook reconciliation
- Resend transactional/admin email support

## Local Setup

```sh
npm install
cp .env.local.example .env.local
docker compose up -d postgres
npm run dev
```

The local app runs on `http://localhost:3000` by default.

## Useful Commands

```sh
npm run dev
npm run build
npm run lint
npm run test:run
npm run db:push
npm run db:studio
```

## Required Runtime Environment

See `.env.example` for the full list. The core production variables are:

- `DATABASE_URL` or `POSTGRES_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `HITPAY_API_KEY`
- `HITPAY_WEBHOOK_SALT`
- `APP_URL`
- `RESEND_API_KEY`
- `CRON_SECRET`

## Deployment

This build is configured for Next.js deployment. Run `npm run build` before shipping and verify the configured host has the required environment variables.
