#!/usr/bin/env node
// Backward-compatible alias — deleguje do scripts/validate-content.mjs.
import { spawnSync } from "node:child_process";
const extra = process.argv.slice(2);
const r = spawnSync(
  process.execPath,
  ["scripts/validate-content.mjs", "--section=technologie", ...extra],
  { stdio: "inherit" },
);
process.exit(r.status ?? 1);
