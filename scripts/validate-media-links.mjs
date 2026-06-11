import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);

function getArg(name, fallback = "") {
  const match = args.find((arg) => arg.startsWith(`${name}=`));
  return match ? match.split("=").slice(1).join("=") : fallback;
}

const fileArg = getArg("--file", path.join(repoRoot, "scripts", "media-urls.txt"));
const concurrency = Number.parseInt(getArg("--concurrency", "8"), 10);
const timeoutMs = Number.parseInt(getArg("--timeout", "12000"), 10);
const outputPath = path.join(repoRoot, "scripts", "media-link-report.json");

async function readUrls(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return Array.from(
    new Set(
      raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"))
    )
  );
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const head = await fetch(url, { method: "HEAD", signal: controller.signal });
    if (head.ok) {
      return { url, status: head.status, ok: true, method: "HEAD" };
    }

    // Some hosts block HEAD; try GET as fallback.
    const getRes = await fetch(url, { method: "GET", signal: controller.signal });
    return { url, status: getRes.status, ok: getRes.ok, method: "GET" };
  } catch (error) {
    return {
      url,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      method: "HEAD/GET",
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runWithConcurrency(items, worker, limit) {
  const results = [];
  let index = 0;

  async function runner() {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await worker(items[currentIndex]);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => runner());
  await Promise.all(workers);
  return results;
}

async function main() {
  const urls = await readUrls(fileArg);
  if (urls.length === 0) {
    console.log(`No URLs found in ${fileArg}`);
    process.exit(0);
  }

  console.log(`Checking ${urls.length} media URL(s) from ${fileArg} ...`);
  const results = await runWithConcurrency(urls, checkUrl, concurrency);
  const failed = results.filter((row) => !row.ok);
  const passed = results.length - failed.length;

  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        checked_at: new Date().toISOString(),
        source_file: fileArg,
        total: results.length,
        passed,
        failed: failed.length,
        results,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`Pass: ${passed}`);
  console.log(`Fail: ${failed.length}`);
  console.log(`Report: ${outputPath}`);

  if (failed.length > 0) {
    console.log("Failed URLs:");
    for (const row of failed) {
      console.log(`- ${row.url} (${row.status ?? row.error ?? "unknown error"})`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Link validation failed:", error.message);
  process.exitCode = 1;
});

