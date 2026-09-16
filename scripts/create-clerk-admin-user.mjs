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
const key = process.env.CLERK_SECRET_KEY;
const email = (process.argv[2] || "").trim().toLowerCase();
if (!key || !email) {
  console.error("Usage: node scripts/create-clerk-admin-user.mjs email@example.com");
  process.exit(1);
}

const password = "ReveAdmin!" + randomBytes(4).toString("hex");

const listRes = await fetch(
  "https://api.clerk.com/v1/users?email_address=" + encodeURIComponent(email),
  { headers: { Authorization: "Bearer " + key } }
);
const existing = await listRes.json();
if (Array.isArray(existing) && existing.length) {
  const id = existing[0].id;
  const prev = existing[0].public_metadata || {};
  const patch = await fetch("https://api.clerk.com/v1/users/" + id, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_metadata: { ...prev, role: "admin" } }),
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
