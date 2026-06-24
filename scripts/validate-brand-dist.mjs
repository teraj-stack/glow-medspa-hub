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
import { readdirSync, readFileSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve, extname, relative as relPath } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = resolve(ROOT, 'dist')
const REPORT_DIR = resolve(ROOT, 'reports')
const REPORT_JSON = resolve(REPORT_DIR, 'brand-dist-report.json')
const REPORT_MD = resolve(REPORT_DIR, 'brand-dist-report.md')

const FORBIDDEN = /BM[\s\u00A0]+Clinics/i
const FORBIDDEN_G = /BM[\s\u00A0]+Clinics/gi
const REQUIRED = /BMClinics\.ai/i
const SCAN_EXT = new Set([
  '.html', '.htm', '.js', '.mjs', '.cjs', '.css',
  '.xml', '.txt', '.json', '.svg', '.webmanifest',
])
const CONTEXT_CHARS = 80

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
const offenders = [] // { file, line, col, snippet, match }
let requiredHits = 0
const scannedByExt = {}

for (const file of files) {
  const ext = extname(file).toLowerCase()
  scannedByExt[ext] = (scannedByExt[ext] || 0) + 1
  const content = readFileSync(file, 'utf8')

  if (FORBIDDEN.test(content)) {
    const lines = content.split('\n')
    lines.forEach((line, i) => {
      let m
      const re = new RegExp(FORBIDDEN_G.source, 'gi')
      while ((m = re.exec(line)) !== null) {
        const start = Math.max(0, m.index - CONTEXT_CHARS)
        const end = Math.min(line.length, m.index + m[0].length + CONTEXT_CHARS)
        const snippet = (start > 0 ? '…' : '') + line.slice(start, end).trim() + (end < line.length ? '…' : '')
        offenders.push({
          file: relPath(ROOT, file),
          line: i + 1,
          col: m.index + 1,
          match: m[0],
          snippet,
        })
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

const summary = Object.entries(scannedByExt).map(([k, v]) => `${k}:${v}`).join(' ')

// Group offenders by file for the report
const byFile = {}
for (const o of offenders) {
  ;(byFile[o.file] ||= []).push(o)
}

const report = {
  generatedAt: new Date().toISOString(),
  dist: relPath(ROOT, DIST),
  filesScanned: files.length,
  scannedByExt,
  requiredHits,
  forbiddenPattern: FORBIDDEN.source,
  requiredPattern: REQUIRED.source,
  offenderCount: offenders.length,
  offendingFiles: Object.keys(byFile).length,
  offenders,
}

mkdirSync(REPORT_DIR, { recursive: true })
writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2))

const mdLines = [
  '# Brand check report (dist)',
  '',
  `- Generated: ${report.generatedAt}`,
  `- Dist: \`${report.dist}\``,
  `- Files scanned: **${report.filesScanned}** (${summary})`,
  `- "BMClinics.ai" present in: **${requiredHits}** HTML/JS/CSS files`,
  `- "BM Clinics" occurrences: **${offenders.length}** in **${report.offendingFiles}** file(s)`,
  '',
]

if (offenders.length === 0) {
  mdLines.push('✓ No legacy "BM Clinics" occurrences in build output.', '')
} else {
  mdLines.push('## Offenders', '')
  for (const [file, items] of Object.entries(byFile)) {
    mdLines.push(`### \`${file}\` (${items.length})`, '')
    for (const it of items) {
      mdLines.push(`- L${it.line}:C${it.col} — \`${it.match}\``)
      mdLines.push(`  > ${it.snippet.replace(/`/g, '\\`')}`)
    }
    mdLines.push('')
  }
}

writeFileSync(REPORT_MD, mdLines.join('\n'))

if (offenders.length) {
  console.error(`\n✗ Brand check (dist): ${offenders.length} "BM Clinics" occurrence(s) in ${report.offendingFiles} file(s):`)
  for (const [file, items] of Object.entries(byFile)) {
    console.error(`  ${file} (${items.length})`)
    for (const it of items.slice(0, 5)) {
      console.error(`    L${it.line}:C${it.col}  ${it.snippet}`)
    }
    if (items.length > 5) console.error(`    …(+${items.length - 5} more, see report)`)
  }
  console.error(`\n  Full report: ${relPath(ROOT, REPORT_MD)}  •  ${relPath(ROOT, REPORT_JSON)}`)
  process.exit(1)
}

if (requiredHits === 0) {
  console.error(
    '\n✗ Brand check (dist): no "BMClinics.ai" mention found in any HTML/JS/CSS output. ' +
    'Expected the brand to appear in at least one rendered file.',
  )
  console.error(`  Scanned: ${summary}`)
  console.error(`  Report: ${relPath(ROOT, REPORT_MD)}`)
  process.exit(1)
}

console.log(
  `✓ Brand check (dist): scanned ${files.length} files (${summary}); ` +
  `"BMClinics.ai" present in ${requiredHits} HTML/JS/CSS files; no "BM Clinics". ` +
  `Report: ${relPath(ROOT, REPORT_MD)}`,
)
