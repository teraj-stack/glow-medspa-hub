#!/usr/bin/env node
/**
 * Safe auto-rewrite of legacy "BM Clinics" → "BMClinics.ai" in dist/.
 *
 * Usage:
 *   node scripts/fix-brand-dist.mjs            # dry-run (default)
 *   node scripts/fix-brand-dist.mjs --apply    # write changes
 *
 * Safety rules — a match is rewritten ONLY when ALL hold:
 *   1. Case-sensitive variants: "BM Clinics", "BM clinics", "Bm Clinics".
 *      Lowercase "bm clinics" and uppercase "BM CLINICS" are skipped
 *      (likely identifiers, URL slugs, or shouting copy worth a human look).
 *   2. Character immediately BEFORE is NOT [A-Za-z0-9_/-] — prevents
 *      touching identifiers, file paths, URL segments, hyphenated tokens.
 *   3. Character immediately AFTER is NOT [A-Za-z0-9_.-] — prevents
 *      touching e.g. "BM Clinics.com", "BM Clinics-foo", or partials
 *      that already share a dot with surrounding code.
 *   4. The match is NOT inside a URL: skip if the 200 chars before
 *      contain `://` without an intervening whitespace/quote.
 *   5. File ext is in a text allowlist (HTML/JS/CSS/XML/TXT/JSON/SVG).
 *
 * Source-map files (.map) are never modified.
 *
 * Always writes a report to reports/brand-fix-dist-report.{json,md}.
 */
import { readdirSync, readFileSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve, extname, relative as relPath } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = resolve(ROOT, 'dist')
const REPORT_DIR = resolve(ROOT, 'reports')
const REPORT_JSON = resolve(REPORT_DIR, 'brand-fix-dist-report.json')
const REPORT_MD = resolve(REPORT_DIR, 'brand-fix-dist-report.md')

const APPLY = process.argv.includes('--apply')

const TARGET = 'BMClinics.ai'
// Case-sensitive variants we will rewrite. Others are flagged "skipped".
const SAFE_VARIANTS = new Set(['BM Clinics', 'BM clinics', 'Bm Clinics'])
const ALL_PATTERN = /BM[ \u00A0]Clinics/gi
const SCAN_EXT = new Set([
  '.html', '.htm', '.js', '.mjs', '.cjs', '.css',
  '.xml', '.txt', '.json', '.svg', '.webmanifest',
])
const BEFORE_BAD = /[A-Za-z0-9_/-]/
const AFTER_BAD = /[A-Za-z0-9_.-]/
const URL_LOOKBEHIND = /:\/\/[^\s"'<>]*$/

if (!existsSync(DIST)) {
  console.error('✗ Brand fix (dist): dist/ not found — run after `vite build`.')
  process.exit(1)
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (SCAN_EXT.has(extname(e).toLowerCase()) && !e.endsWith('.map')) out.push(full)
  }
  return out
}

function locate(content, index) {
  let line = 1
  let lineStart = 0
  for (let i = 0; i < index; i++) {
    if (content.charCodeAt(i) === 10) {
      line++
      lineStart = i + 1
    }
  }
  return { line, col: index - lineStart + 1 }
}

const files = walk(DIST)
const perFile = [] // { file, replacements, skips, newContent? }
let totalReplacements = 0
let totalSkips = 0

for (const file of files) {
  const content = readFileSync(file, 'utf8')
  if (!ALL_PATTERN.test(content)) continue
  ALL_PATTERN.lastIndex = 0

  const replacements = []
  const skips = []

  const rewritten = content.replace(ALL_PATTERN, (match, offset, src) => {
    const before = offset > 0 ? src[offset - 1] : ''
    const after = offset + match.length < src.length ? src[offset + match.length] : ''
    const winStart = Math.max(0, offset - 200)
    const window = src.slice(winStart, offset)
    const loc = locate(src, offset)
    const snippet = src.slice(Math.max(0, offset - 60), Math.min(src.length, offset + match.length + 60)).replace(/\s+/g, ' ').trim()

    const reason =
      !SAFE_VARIANTS.has(match) ? `variant "${match}" not in safe list`
      : (before && BEFORE_BAD.test(before)) ? `unsafe char before: "${before}"`
      : (after && AFTER_BAD.test(after)) ? `unsafe char after: "${after}"`
      : URL_LOOKBEHIND.test(window) ? 'inside URL'
      : null

    if (reason) {
      skips.push({ line: loc.line, col: loc.col, match, reason, snippet })
      return match
    }

    replacements.push({ line: loc.line, col: loc.col, match, snippet })
    return TARGET
  })

  totalReplacements += replacements.length
  totalSkips += skips.length

  perFile.push({
    file: relPath(ROOT, file),
    replacements,
    skips,
    changed: rewritten !== content,
    newContent: APPLY && rewritten !== content ? rewritten : undefined,
  })
}

if (APPLY) {
  for (const f of perFile) {
    if (f.newContent !== undefined) writeFileSync(resolve(ROOT, f.file), f.newContent)
  }
}

// ---------- Report ----------
mkdirSync(REPORT_DIR, { recursive: true })
const report = {
  generatedAt: new Date().toISOString(),
  mode: APPLY ? 'apply' : 'dry-run',
  dist: relPath(ROOT, DIST),
  filesScanned: files.length,
  filesWithMatches: perFile.length,
  filesChanged: perFile.filter((f) => f.changed).length,
  totalReplacements,
  totalSkips,
  perFile,
}
writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2))

const md = [
  `# Brand fix report (dist) — ${report.mode}`,
  '',
  `- Generated: ${report.generatedAt}`,
  `- Files scanned: **${report.filesScanned}**`,
  `- Files with matches: **${report.filesWithMatches}** • would-change: **${report.filesChanged}**`,
  `- Replacements: **${totalReplacements}** • Skipped (unsafe): **${totalSkips}**`,
  '',
]

for (const f of perFile) {
  md.push(`## \`${f.file}\``, '')
  if (f.replacements.length) {
    md.push(`### Safe replacements (${f.replacements.length})`, '')
    for (const r of f.replacements) {
      md.push(`- L${r.line}:C${r.col} \`${r.match}\` → \`${TARGET}\``)
      md.push(`  > ${r.snippet}`)
    }
    md.push('')
  }
  if (f.skips.length) {
    md.push(`### Skipped (${f.skips.length}) — needs manual review`, '')
    for (const s of f.skips) {
      md.push(`- L${s.line}:C${s.col} \`${s.match}\` — ${s.reason}`)
      md.push(`  > ${s.snippet}`)
    }
    md.push('')
  }
}

if (!perFile.length) md.push('No occurrences found.', '')
writeFileSync(REPORT_MD, md.join('\n'))

// ---------- Console summary ----------
const tag = APPLY ? 'APPLY' : 'DRY-RUN'
if (!perFile.length) {
  console.log(`✓ Brand fix (dist) [${tag}]: no "BM Clinics" occurrences. Report: ${relPath(ROOT, REPORT_MD)}`)
  process.exit(0)
}

console.log(`Brand fix (dist) [${tag}]: ${totalReplacements} safe replacement(s), ${totalSkips} skipped, in ${perFile.length} file(s).`)
for (const f of perFile) {
  console.log(`  ${f.file}: +${f.replacements.length} change(s), ${f.skips.length} skipped`)
}
console.log(`Report: ${relPath(ROOT, REPORT_MD)}  •  ${relPath(ROOT, REPORT_JSON)}`)
if (!APPLY) console.log('Re-run with --apply to write changes.')
