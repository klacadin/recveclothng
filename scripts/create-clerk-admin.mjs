/**
 * Create/update Clerk admin user (public_metadata.role = admin).
 * Usage: node scripts/create-clerk-admin.mjs [email]
 */
import { readFileSync, existsSync } from "fs";
import { randomBytes } from "crypto";

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
if (!key) {
  console.error("Missing CLERK_SECRET_KEY");
  process.exit(1);
}
console.log("KEY_OK", key.slice(0, 8) + "...");

const email = process.argv[2] || "khlacadin@gmail.com";
const password = "ReveAdmin!" + randomBytes(4).toString("hex");

const listRes = await fetch(
  "https://api.clerk.com/v1/users?email_address=" + encodeURIComponent(email),
  { headers: { Authorization: "Bearer " + key } }
);
const existing = await listRes.json();

if (Array.isArray(existing) && existing.length) {
  const id = existing[0].id;
  const patch = await fetch("https://api.clerk.com/v1/users/" + id, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_metadata: { role: "admin" } }),
  });
  const u = await patch.json();
  if (!patch.ok) {
    console.error(JSON.stringify(u, null, 2));
    process.exit(1);
  }
  console.log(
    JSON.stringify(
      {
        action: "updated_existing",
        id: u.id,
        email,
        public_metadata: u.public_metadata,
        note: "User already existed — set role=admin. Use Forgot password on preview if needed.",
      },
      null,
      2
    )
  );
  process.exit(0);
}

const create = await fetch("https://api.clerk.com/v1/users", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + key,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email_address: [email],
    password,
    first_name: "Keren",
    last_name: "Lacadin",
    skip_password_checks: true,
    public_metadata: { role: "admin" },
  }),
});
const u = await create.json();
if (!create.ok) {
  console.error(JSON.stringify(u, null, 2));
  process.exit(1);
}
console.log(
  JSON.stringify(
    {
      action: "created",
      id: u.id,
      email,
      password,
      public_metadata: u.public_metadata,
    },
    null,
    2
  )
);
