#!/usr/bin/env node
/**
 * resolve-server-fn-url.mjs
 *
 * Auto-discover the published URL of a TanStack `createServerFn` by reading
 * the build's server-fn resolver manifest. Eliminates the need to hardcode
 * `/_serverFn/<hash>` paths or paste them into CI variables.
 *
 * Usage:
 *   node scripts/resolve-server-fn-url.mjs <fnName> [--base <url>] [--env VAR_NAME] [--dist <path>]
 *
 * Example:
 *   node scripts/resolve-server-fn-url.mjs listActiveDoctors \
 *     --base https://www.bmclinics.dev \
 *     --env PUBLIC_DOCTORS_ENDPOINT
 *
 * Behaviour:
 *   - Parses `dist/server/__*tanstack-start-server-fn-resolver*.mjs`.
 *   - Finds the entry where `functionName === "<fnName>_createServerFn_handler"`.
 *   - Prints `<base>/_serverFn/<hash>` to stdout.
 *   - When `$GITHUB_ENV` is set and `--env` was passed, also appends
 *     `<VAR>=<url>` so subsequent CI steps inherit it.
 *   - Exits non-zero with a clear message if the build is missing or the
 *     function is not found.
 */

import { readFileSync, readdirSync, appendFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0 || args[0].startsWith("--")) {
  console.error("Usage: resolve-server-fn-url.mjs <fnName> [--base <url>] [--env VAR] [--dist <path>]");
  process.exit(2);
}

const fnName = args[0];
const opts = { base: "", env: "", dist: "dist" };
for (let i = 1; i < args.length; i++) {
  const flag = args[i];
  const value = args[i + 1];
  if (flag === "--base" && value) { opts.base = value.replace(/\/+$/, ""); i++; }
  else if (flag === "--env" && value) { opts.env = value; i++; }
  else if (flag === "--dist" && value) { opts.dist = value; i++; }
  else { console.error(`Unknown flag: ${flag}`); process.exit(2); }
}

const serverDir = join(opts.dist, "server");
if (!existsSync(serverDir) || !statSync(serverDir).isDirectory()) {
  console.error(`[resolve-server-fn] Build output not found at ${serverDir}. Run a build first.`);
  process.exit(1);
}

const resolverFile = readdirSync(serverDir).find(
  (f) => /tanstack-start-server-fn-resolver.*\.mjs$/.test(f),
);
if (!resolverFile) {
  console.error(`[resolve-server-fn] Resolver manifest not found in ${serverDir}.`);
  process.exit(1);
}

const source = readFileSync(join(serverDir, resolverFile), "utf8");
const handlerName = `${fnName}_createServerFn_handler`;

// Iterate every `"<hash>": { ... }` entry and find the one whose functionName matches.
// The manifest is a flat object literal, so each entry is bounded by the next hash key
// or the closing brace of `manifest`. We don't need full JS parsing — a focused regex
// per entry is robust enough and avoids cross-entry lazy-match bugs.
const entryRe = /"([a-f0-9]{32,})"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
let id = null;
for (const m of source.matchAll(entryRe)) {
  const [, hash, body] = m;
  const nameMatch = body.match(/functionName:\s*"([^"]+)"/);
  if (nameMatch && nameMatch[1] === handlerName) {
    id = hash;
    break;
  }
}
if (!id) {
  console.error(`[resolve-server-fn] Function "${fnName}" not found in resolver manifest (${resolverFile}).`);
  process.exit(1);
}
const url = opts.base ? `${opts.base}/_serverFn/${id}` : `/_serverFn/${id}`;
console.log(url);

if (opts.env && process.env.GITHUB_ENV) {
  appendFileSync(process.env.GITHUB_ENV, `${opts.env}=${url}\n`);
  console.error(`[resolve-server-fn] Wrote ${opts.env} to $GITHUB_ENV`);
}
