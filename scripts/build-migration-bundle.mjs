import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const migrationsDir = path.join(repoRoot, "supabase", "migrations");
const outputFile = path.join(repoRoot, "scripts", "combined-migration.sql");
const projectRef = "unaodlytdymouicuuywb";

const banner = [
  "-- =====================================================",
  "-- Combined Migration Script for Supabase Project",
  `-- Project ID: ${projectRef}`,
  "--",
  "-- Auto-generated from supabase/migrations/*.sql",
  "-- Run this in:",
  `-- https://supabase.com/dashboard/project/${projectRef}/sql/new`,
  "-- =====================================================",
  "",
  "-- IMPORTANT:",
  "-- - This script is generated in timestamp order.",
  "-- - Review before execution on production.",
  "",
].join("\n");

async function buildBundle() {
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  const migrationFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  if (migrationFiles.length === 0) {
    throw new Error("No migration files found in supabase/migrations.");
  }

  const blocks = [banner];

  for (let index = 0; index < migrationFiles.length; index += 1) {
    const filename = migrationFiles[index];
    const migrationPath = path.join(migrationsDir, filename);
    const content = await fs.readFile(migrationPath, "utf8");

    blocks.push(`-- =====================================================`);
    blocks.push(`-- Migration ${index + 1}: ${filename}`);
    blocks.push(`-- Source: supabase/migrations/${filename}`);
    blocks.push(`-- =====================================================`);
    blocks.push("");
    blocks.push(content.trimEnd());
    blocks.push("");
    blocks.push("");
  }

  await fs.writeFile(outputFile, blocks.join("\n"), "utf8");

  console.log(`Generated bundle with ${migrationFiles.length} migrations:`);
  console.log(outputFile);
}

buildBundle().catch((error) => {
  console.error("Failed to build migration bundle:", error.message);
  process.exitCode = 1;
});

