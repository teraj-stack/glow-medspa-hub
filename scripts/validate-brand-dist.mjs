#!/usr/bin/env node
/**
 * Post-build brand check.
 *
 * Scans the `dist/` directory produced by `vite build` and fails the
 * build if:
 *   - any output file contains the legacy "BM Clinics" string
 *   - none of the HTML/JS/CSS outputs mention "BMClinics.ai"
 *
 * Wired into `build` and `build:dev` after `vite build`.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = resolve(ROOT, 'dist')

const FORBIDDEN = /BM[\s\u00A0]+Clinics/i
const REQUIRED = /BMClinics\.ai/i
const SCAN_EXT = new Set([
  '.html', '.htm', '.js', '.mjs', '.cjs', '.css',
  '.xml', '.txt', '.json', '.svg', '.webmanifest',
])

if (!existsSync(DIST)) {
  console.error('✗ Brand check (dist): dist/ not found — run after `vite build`.')
  process.exit(1)
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (SCAN_EXT.has(extname(e).toLowerCase())) out.push(full)
  }
  return out
}

const files = walk(DIST)
const offenders = []
let requiredHits = 0
let scannedByExt = {}

for (const file of files) {
  const ext = extname(file).toLowerCase()
  scannedByExt[ext] = (scannedByExt[ext] || 0) + 1

  const content = readFileSync(file, 'utf8')

  if (FORBIDDEN.test(content)) {
    content.split('\n').forEach((line, i) => {
      if (FORBIDDEN.test(line)) {
        const trimmed = line.trim().slice(0, 240)
        offenders.push(`${file}:${i + 1}: ${trimmed}`)
      }
    })
  }

  if (
    (ext === '.html' || ext === '.js' || ext === '.mjs' || ext === '.cjs' || ext === '.css') &&
    REQUIRED.test(content)
  ) {
    requiredHits++
  }
}

const summary = Object.entries(scannedByExt)
  .map(([k, v]) => `${k}:${v}`)
  .join(' ')

if (offenders.length) {
  console.error(`\n✗ Brand check (dist): legacy "BM Clinics" found in build output:`)
  for (const o of offenders) console.error('  ' + o)
  process.exit(1)
}

if (requiredHits === 0) {
  console.error(
    '\n✗ Brand check (dist): no "BMClinics.ai" mention found in any HTML/JS/CSS output. ' +
    'Expected the brand to appear in at least one rendered file.',
  )
  console.error(`  Scanned: ${summary}`)
  process.exit(1)
}

console.log(
  `✓ Brand check (dist): scanned ${files.length} files (${summary}); ` +
  `"BMClinics.ai" present in ${requiredHits} HTML/JS/CSS files; no "BM Clinics".`,
)
