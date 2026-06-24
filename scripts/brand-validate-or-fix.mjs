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
  const changedFiles = (report.perFile || []).filter((f) => f.changed)
  console.log(`Mode:          ${report.mode}`)
  console.log(`Files scanned: ${report.filesScanned}`)
  console.log(`Replacements:  ${report.totalReplacements}  ("BM Clinics" → "BMClinics.ai")`)
  console.log(`Skipped:       ${report.totalSkips}  (unsafe — manual review)`)
  console.log(`Files changed: ${changedFiles.length}`)
  if (changedFiles.length) {
    console.log('\nChanged files:')
    for (const f of changedFiles) {
      console.log(`  • ${f.file}  (+${f.replacements.length} replacement${f.replacements.length === 1 ? '' : 's'})`)
    }
  }
  console.log(`\nFull report: reports/brand-fix-dist-report.md`)
  console.log(bar)
}

const node = process.execPath
const validate = ['scripts/validate-brand-dist.mjs']
const apply = ['scripts/fix-brand-dist.mjs', '--apply']

let code = run(node, validate, 'validate:brand:dist')
if (code === 0) {
  const bar = '─'.repeat(64)
  console.log(`\n${bar}\nBrand post-build summary\n${bar}`)
  console.log('Replacements: 0  (no "BM Clinics" found in dist/)')
  console.log('Files changed: 0')
  console.log(bar)
  console.log('\n✓ Brand check (dist) passed — no auto-fix needed.')
  process.exit(0)
}

console.warn('\n⚠ validate:brand:dist failed — running brand:fix:dist:apply to auto-rewrite safe occurrences in dist/.')
const applyCode = run(node, apply, 'brand:fix:dist:apply')
if (applyCode !== 0) {
  printSummary('Brand post-build summary — auto-fix FAILED')
  console.error('\n✗ brand:fix:dist:apply exited non-zero. Aborting.')
  process.exit(applyCode)
}

console.log('\n→ Re-running validate:brand:dist after auto-fix…')
code = run(node, validate, 'validate:brand:dist (post-fix)')
printSummary('Brand post-build summary — after auto-fix')
if (code === 0) {
  console.log('\n✓ Brand check (dist) passed after auto-fix.')
} else {
  console.error('\n✗ Brand check (dist) still failing after auto-fix — manual review required (see reports/brand-dist-report.md).')
}
process.exit(code)

