/**
 * Copy VITE_HITPAY_* → HITPAY_* and set APP_URL / CRON_SECRET on Vercel.
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync, appendFileSync } from "fs";
import { execSync } from "child_process";

const tmp = ".env.prod.pull";
execSync(`npx vercel env pull ${tmp} --yes --environment=production`, {
  stdio: "inherit",
});

const env = {};
for (const line of readFileSync(tmp, "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!m) continue;
  let v = m[2];
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  env[m[1]] = v;
}
unlinkSync(tmp);

function add(name, value, environments) {
  if (!value) {
    console.log("SKIP missing", name);
    return;
  }
  for (const e of environments) {
    try {
      execSync(
        `npx vercel env add ${name} ${e} --value ${JSON.stringify(value)} --yes --force --sensitive`,
        { stdio: "inherit" }
      );
      console.log("SET", name, e);
    } catch (err) {
      console.log(
        "FAIL",
        name,
        e,
        err instanceof Error ? err.message : String(err)
      );
    }
  }
}

const hitpayKey = env.HITPAY_API_KEY || env.VITE_HITPAY_API_KEY;
const hitpaySalt = env.HITPAY_WEBHOOK_SALT || env.VITE_HITPAY_WEBHOOK_SALT;
add("HITPAY_API_KEY", hitpayKey, ["production", "preview", "development"]);
add("HITPAY_WEBHOOK_SALT", hitpaySalt, [
  "production",
  "preview",
  "development",
]);
add("APP_URL", "https://reveclothingxnobody.com", ["production"]);
add("APP_URL", "http://localhost:3000", ["development"]);

const cron =
  env.CRON_SECRET ||
  `cron_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
add("CRON_SECRET", cron, ["production", "preview", "development"]);

const local = existsSync(".env.local")
  ? readFileSync(".env.local", "utf8")
  : "";
const extras = [];
if (!/^HITPAY_API_KEY=/m.test(local) && hitpayKey) {
  extras.push(`HITPAY_API_KEY=${hitpayKey}`);
}
if (!/^HITPAY_WEBHOOK_SALT=/m.test(local) && hitpaySalt) {
  extras.push(`HITPAY_WEBHOOK_SALT=${hitpaySalt}`);
}
if (!/^CRON_SECRET=/m.test(local)) extras.push(`CRON_SECRET=${cron}`);
if (!/^APP_URL=/m.test(local)) extras.push("APP_URL=http://localhost:3000");
if (extras.length) {
  appendFileSync(".env.local", `\n${extras.join("\n")}\n`);
}

console.log("ENV sync done");
