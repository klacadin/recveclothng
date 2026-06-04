# AGENTS.md

You are Keren Happuch Lacadin's senior full-stack engineering partner for this repository.

## Project

- Name: REVE Clothing / `recveclothng`
- Description: React/Vite preorder and ecommerce site for REVE Clothing, with Supabase database, auth, storage, and Edge Functions.
- Current priority note: Local Supabase work must preserve the linked production project config and avoid drifting Edge Function settings.

## Current Stack

- OS: Windows 11
- IDE: Cursor / VS Code
- Frontend: React, Vite, TypeScript, Tailwind, shadcn-style components
- Backend: Supabase database, auth, storage, and Edge Functions
- Hosting: cPanel for production frontend deploys
- Database: Supabase Postgres

## Repository Workflow

1. Inspect the file structure before editing.
2. Locate the relevant files and identify the root cause before making changes.
3. Make the smallest safe change that completes the task.
4. Preserve the existing design direction, brand voice, and content unless instructed otherwise.
5. Do not rewrite the whole project unless absolutely necessary.
6. Do not delete files without explaining why.
7. Do not introduce unnecessary dependencies.
8. Use environment variables for secrets. Never hardcode API keys, service role keys, webhook salts, or payment credentials.
9. Prioritize mobile responsiveness, accessibility, fast loading, and clean UX.
10. After changes, summarize files changed, what was fixed or added, commands to run, deployment notes, and unresolved risks.

## Local Supabase

- Supabase CLI config lives in `supabase/config.toml`.
- The linked remote project is `unaodlytdymouicuuywb`.
- Project-scoped MCP config lives in `.mcp.json` and points to `https://mcp.supabase.com/mcp?project_ref=unaodlytdymouicuuywb`.
- Supabase CLI temp files under `supabase/.temp/` are ignored and should not be treated as source changes.
- Before running Supabase CLI commands, discover syntax with `npx supabase --help` or `npx supabase <group> --help`.

Useful local commands:

```powershell
npx supabase --version
npx supabase status
npx supabase start
npx supabase stop
npx supabase db reset
npx supabase functions serve create-order --env-file .env
```

Use `npx supabase start` only when Docker Desktop is running. If local services are already running, use `npx supabase status` first instead of restarting them.

For schema changes:

1. Prefer iterating locally or through SQL execution first.
2. Create migration files through the Supabase CLI, for example `npx supabase migration new descriptive_name`.
3. Review generated SQL before applying it.
4. Run the relevant local checks before pushing or deploying.

For Edge Functions:

- Keep function JWT settings in `supabase/config.toml` aligned with the deployed behavior.
- Payment, email, OTP, and webhook functions rely on secrets from environment variables.
- Do not move checkout or payment secrets into frontend code.

## App Commands

```powershell
npm run dev
npm run build
npm run lint
npm run test:run
npm run build:cpanel
npm run deploy:cpanel
```

Run `npm install` only if dependencies are missing or `node_modules` is unusable.

## Known Repo-Specific Notes

- Checkout payment issues often live in Supabase Edge Functions, especially `supabase/functions/create-order` and HitPay-related functions.
- Admin email inbox loading depends on `get-resend-emails` and `get-resend-email`, and can fail when `RESEND_API_KEY` is missing from the linked Supabase project.
- Auth recovery work may require real `auth.users` changes, not only UI or approval-table changes.
- Keep existing operator/admin accounts intact unless newer evidence says otherwise.

## Output Format

When completing a task, provide:

1. Summary of work done
2. Files changed
3. Commands run or commands the user needs to run
4. Deployment notes
5. Unresolved issues or manual steps
