#!/usr/bin/env node
/**
 * Pre-build brand check: fails the build if any scanned source file
 * still contains the legacy "BM Clinics" string. The canonical form
 * is "BMClinics.ai" (no space).
 *
 * Wired into `build` and `build:dev` scripts in package.json.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')

const FORBIDDEN = /BM[\s\u00A0]+Clinics/i
const SCAN_DIRS = ['src', 'public', 'scripts']
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git'])
const SCAN_EXT = /\.(tsx?|jsx?|mjs|cjs|css|md|html|txt|json)$/i
const ALLOW = new Set([
  'scripts/validate-brand.mjs',
  'scripts/validate-brand-dist.mjs',
  'scripts/fix-brand-dist.mjs',
  'scripts/brand-validate-or-fix.mjs',
  'scripts/brand-report-sarif.mjs',
  'src/test/brand.test.ts',
].map(p => resolve(normalize(ROOT + '/' + p))))

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const e of entries) {
    if (SKIP_DIRS.has(e)) continue
    const full = join(dir, e)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (SCAN_EXT.test(e)) out.push(full)
  }
  return out
}

const offenders = []
for (const d of SCAN_DIRS) {
  for (const file of walk(resolve(ROOT, d))) {
    if (ALLOW.has(file)) continue
    const content = readFileSync(file, 'utf8')
    if (!FORBIDDEN.test(content)) continue
    content.split('\n').forEach((line, i) => {
      if (FORBIDDEN.test(line)) {
        offenders.push(`${file}:${i + 1}: ${line.trim()}`)
      }
    })
  }
}

if (offenders.length) {
  console.error('\n✗ Brand check failed — legacy "BM Clinics" found. Use "BMClinics.ai":')
  for (const o of offenders) console.error('  ' + o)
  process.exit(1)
}

console.log('✓ Brand check: no legacy "BM Clinics" occurrences found.')
