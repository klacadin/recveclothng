/**
 * Set Clerk public_metadata.role = admin for an email.
 * Usage: node scripts/set-clerk-admin.mjs email@example.com
 */
import { readFileSync, existsSync } from "fs";

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv(".env.local");
loadEnv(".env");

const key = process.env.CLERK_SECRET_KEY;
const email = (process.argv[2] || "").trim().toLowerCase();

if (!key) {
  console.error("Missing CLERK_SECRET_KEY");
  process.exit(1);
}
if (!email) {
  console.error("Usage: node scripts/set-clerk-admin.mjs email@example.com");
  process.exit(1);
}

const listRes = await fetch(
  "https://api.clerk.com/v1/users?email_address=" + encodeURIComponent(email),
  { headers: { Authorization: "Bearer " + key } }
);
const existing = await listRes.json();

if (!Array.isArray(existing) || existing.length === 0) {
  console.error(
    JSON.stringify(
      {
        error: "User not found in Clerk. They must sign up / sign in once first.",
        email,
      },
      null,
      2
    )
  );
  process.exit(1);
}

const user = existing[0];
const prev = user.public_metadata || {};
const patch = await fetch("https://api.clerk.com/v1/users/" + user.id, {
  method: "PATCH",
  headers: {
    Authorization: "Bearer " + key,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    public_metadata: { ...prev, role: "admin" },
  }),
});
const updated = await patch.json();
if (!patch.ok) {
  console.error(JSON.stringify(updated, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      id: updated.id,
      email,
      public_metadata: updated.public_metadata,
    },
    null,
    2
  )
);
