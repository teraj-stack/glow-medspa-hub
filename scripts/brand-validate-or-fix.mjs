#!/usr/bin/env node
/**
 * Post-build brand orchestrator.
 *
 * Flow:
 *   1. Run validate:brand:dist.
 *   2. If it passes → done.
 *   3. If it fails → run brand:fix:dist:apply (safe auto-rewrite in dist).
 *   4. Re-run validate:brand:dist; propagate its exit code.
 *
 * This runs AFTER `vite build` and BEFORE `report:content` in the build scripts.
 *
 * Exit codes:
 *   0 — success (no "BM Clinics" in dist, or fixed and strict mode is off)
 *   1 — strict mode: safe replacements were made in dist (legacy brand leaked into build)
 *   2 — validation still failing after auto-fix (unsafe/risky content remains)
 *   3 — auto-fix script itself failed
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const REPORT_JSON = resolve(ROOT, 'reports/brand-fix-dist-report.json')

function run(cmd, args, label) {
  console.log(`\n→ ${label}: ${cmd} ${args.join(' ')}`)
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: false })
  return res.status ?? 1
}

// Maximum locations to print per file in the console summary. Full data
// is always available in reports/brand-fix-dist-report.{json,md}.
const MAX_LOCATIONS_PER_FILE = 10
const SNIPPET_MAX = 100

function truncate(s, n) {
  if (!s) return ''
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

function printLocationList(label, items) {
  if (!items.length) return
  console.log(`\n  ${label} (${items.length}):`)
  const shown = items.slice(0, MAX_LOCATIONS_PER_FILE)
  for (const it of shown) {
    const loc = `L${it.line}:C${it.col}`
    const extra = it.reason ? ` — ${it.reason}` : ''
    console.log(`    • ${loc}  "${it.match}"${extra}`)
    if (it.snippet) console.log(`        > ${truncate(it.snippet, SNIPPET_MAX)}`)
  }
  const rest = items.length - shown.length
  if (rest > 0) console.log(`    … and ${rest} more (see reports/brand-fix-dist-report.md)`)
}

function printSummary(header) {
  const bar = '─'.repeat(64)
  console.log(`\n${bar}\n${header}\n${bar}`)
  if (!existsSync(REPORT_JSON)) {
    console.log('(no brand-fix report found — nothing was rewritten)')
    console.log(bar)
    return
  }
  let report
  try {
    report = JSON.parse(readFileSync(REPORT_JSON, 'utf8'))
  } catch (e) {
    console.log(`(could not parse ${REPORT_JSON}: ${e.message})`)
    console.log(bar)
    return
  }
  const perFile = report.perFile || []
  const changedFiles = perFile.filter((f) => f.changed)
  const filesWithSkips = perFile.filter((f) => (f.skips || []).length > 0)
  console.log(`Mode:          ${report.mode}`)
  console.log(`Files scanned: ${report.filesScanned}`)
  console.log(`Replacements:  ${report.totalReplacements}  ("BM Clinics" → "BMClinics.ai")`)
  console.log(`Skipped:       ${report.totalSkips}  (unsafe — manual review)`)
  console.log(`Files changed: ${changedFiles.length}`)

  if (changedFiles.length) {
    console.log('\nChanged files — replacement locations:')
    for (const f of changedFiles) {
      console.log(`\n  • ${f.file}  (+${f.replacements.length} replacement${f.replacements.length === 1 ? '' : 's'})`)
      printLocationList('Replacements', f.replacements || [])
    }
  }

  if (filesWithSkips.length) {
    console.log('\nFiles with skipped (unsafe) occurrences — needs manual review:')
    for (const f of filesWithSkips) {
      console.log(`\n  • ${f.file}  (${f.skips.length} skipped)`)
      printLocationList('Skipped', f.skips || [])
    }
  }

  console.log(`\nFull report: reports/brand-fix-dist-report.md  (JSON: reports/brand-fix-dist-report.json)`)
  console.log(bar)
}

const node = process.execPath
const validate = ['scripts/validate-brand-dist.mjs']
const apply = ['scripts/fix-brand-dist.mjs', '--apply']

const STRICT =
  process.argv.includes('--strict') ||
  process.env.BRAND_STRICT === '1' ||
  process.env.BRAND_STRICT === 'true'

function reportReplacements() {
  if (!existsSync(REPORT_JSON)) return 0
  try {
    return JSON.parse(readFileSync(REPORT_JSON, 'utf8')).totalReplacements || 0
  } catch {
    return 0
  }
}

let code = run(node, validate, 'validate:brand:dist')
if (code === 0) {
  const bar = '─'.repeat(64)
  console.log(`\n${bar}\nBrand post-build summary\n${bar}`)
  console.log('Replacements: 0  (no "BM Clinics" found in dist/)')
  console.log('Files changed: 0')
  if (STRICT) console.log('Strict mode:   enabled (any replacement would fail the build)')
  console.log(bar)
  console.log('\n✓ Brand check (dist) passed — no auto-fix needed.')
  process.exit(0)
}

console.warn('\n⚠ validate:brand:dist failed — running brand:fix:dist:apply to auto-rewrite safe occurrences in dist/.')
if (STRICT) console.warn('  Strict mode is ON: build will fail with exit code 1 if any replacements were made.')
const applyCode = run(node, apply, 'brand:fix:dist:apply')
if (applyCode !== 0) {
  printSummary('Brand post-build summary — auto-fix FAILED')
  console.error('\n✗ brand:fix:dist:apply exited non-zero. Aborting (exit code 3).')
  process.exit(3)
}

console.log('\n→ Re-running validate:brand:dist after auto-fix…')
code = run(node, validate, 'validate:brand:dist (post-fix)')
printSummary('Brand post-build summary — after auto-fix')
if (code !== 0) {
  console.error('\n✗ Brand check (dist) still failing after auto-fix — manual review required (exit code 2).')
  console.error('  See reports/brand-dist-report.md for the list of remaining offenders.')
  process.exit(2)
}

const replacements = reportReplacements()
if (STRICT && replacements > 0) {
  console.error(`\n✗ Strict brand mode: ${replacements} "BM Clinics" replacement(s) were made in dist/ (exit code 1).`)
  console.error('  The build is considered risky because legacy brand text was emitted into the output.')
  console.error('  Remove "BM Clinics" from the source so it does not appear in dist/.')
  process.exit(1)
}

console.log('\n✓ Brand check (dist) passed after auto-fix.')
process.exit(0)

