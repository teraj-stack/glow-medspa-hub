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

function run(cmd, args, label) {
  console.log(`\n→ ${label}: ${cmd} ${args.join(' ')}`)
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: false })
  return res.status ?? 1
}

const node = process.execPath
const validate = ['scripts/validate-brand-dist.mjs']
const apply = ['scripts/fix-brand-dist.mjs', '--apply']

let code = run(node, validate, 'validate:brand:dist')
if (code === 0) {
  console.log('\n✓ Brand check (dist) passed — no auto-fix needed.')
  process.exit(0)
}

console.warn('\n⚠ validate:brand:dist failed — running brand:fix:dist:apply to auto-rewrite safe occurrences in dist/.')
const applyCode = run(node, apply, 'brand:fix:dist:apply')
if (applyCode !== 0) {
  console.error('\n✗ brand:fix:dist:apply exited non-zero. Aborting.')
  process.exit(applyCode)
}

console.log('\n→ Re-running validate:brand:dist after auto-fix…')
code = run(node, validate, 'validate:brand:dist (post-fix)')
if (code === 0) {
  console.log('\n✓ Brand check (dist) passed after auto-fix.')
} else {
  console.error('\n✗ Brand check (dist) still failing after auto-fix — manual review required (see reports/brand-dist-report.md).')
}
process.exit(code)
