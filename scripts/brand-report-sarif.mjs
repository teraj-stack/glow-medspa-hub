#!/usr/bin/env node
/**
 * Convert reports/brand-fix-dist-report.json into a SARIF 2.1.0 file at
 * reports/brand-fix-dist.sarif, suitable for GitHub Code Scanning upload
 * (github/codeql-action/upload-sarif).
 *
 * Each replacement and each skip becomes a SARIF "result" with:
 *   - ruleId:      brand/auto-replaced     (level: warning)
 *                  brand/unsafe-occurrence (level: error)
 *   - artifactLocation.uri = path relative to repo root (e.g. dist/index.html)
 *   - region.startLine / startColumn from the brand-fix report
 *   - region.snippet.text = short surrounding context
 *
 * GitHub renders these as inline annotations on the commit/PR and exposes
 * severity + rule filters in the Security → Code scanning UI.
 *
 * Exit codes:
 *   0 — SARIF written (even with zero results, so the upload step has a file)
 *   1 — could not read/parse the JSON report
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const REPORT_JSON = resolve(ROOT, 'reports/brand-fix-dist-report.json')
const SARIF_OUT = resolve(ROOT, 'reports/brand-fix-dist.sarif')

const TOOL_NAME = 'brand-validate-dist'
const TOOL_VERSION = '1.0.0'
const INFO_URI = 'https://github.com/' // overridden by GitHub when uploaded

const RULES = [
  {
    id: 'brand/auto-replaced',
    name: 'LegacyBrandAutoReplaced',
    shortDescription: { text: 'Legacy "BM Clinics" was auto-rewritten in dist/' },
    fullDescription: {
      text:
        'A safe occurrence of "BM Clinics" was found in the build output and rewritten ' +
        'to "BMClinics.ai" by scripts/fix-brand-dist.mjs. The original source still ' +
        'contains the legacy brand string — clean it up so it does not appear in dist/.',
    },
    helpUri:
      'https://github.com/bmclinics-ai/brand-guidelines#legacy-bm-clinics-in-dist',
    defaultConfiguration: { level: 'warning' },
  },
  {
    id: 'brand/unsafe-occurrence',
    name: 'LegacyBrandUnsafeOccurrence',
    shortDescription: { text: 'Unsafe "BM Clinics" occurrence in dist/ — manual review required' },
    fullDescription: {
      text:
        'An occurrence of "BM Clinics" in the build output was NOT auto-rewritten ' +
        'because the surrounding context is risky (URL, identifier, hyphenated token, ' +
        'unexpected case). Review the location and remove the legacy brand string by hand.',
    },
    helpUri:
      'https://github.com/bmclinics-ai/brand-guidelines#unsafe-bm-clinics-in-dist',
    defaultConfiguration: { level: 'error' },
  },
]

function emptySarif(reason) {
  return {
    version: '2.1.0',
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/main/Documentation/CommitteeSpecifications/2.1.0/sarif-schema-2.1.0.json',
    runs: [
      {
        tool: {
          driver: {
            name: TOOL_NAME,
            version: TOOL_VERSION,
            informationUri: INFO_URI,
            rules: RULES,
          },
        },
        invocations: [
          {
            executionSuccessful: true,
            toolExecutionNotifications: reason
              ? [
                  {
                    level: 'note',
                    message: { text: reason },
                  },
                ]
              : [],
          },
        ],
        results: [],
      },
    ],
  }
}

function writeSarif(obj) {
  mkdirSync(dirname(SARIF_OUT), { recursive: true })
  writeFileSync(SARIF_OUT, JSON.stringify(obj, null, 2))
}

if (!existsSync(REPORT_JSON)) {
  writeSarif(emptySarif('No brand-fix report found — nothing was scanned.'))
  console.log(`✓ Wrote empty SARIF (no JSON report): ${SARIF_OUT}`)
  process.exit(0)
}

let report
try {
  report = JSON.parse(readFileSync(REPORT_JSON, 'utf8'))
} catch (e) {
  console.error(`✗ Could not parse ${REPORT_JSON}: ${e.message}`)
  process.exit(1)
}

const results = []
for (const f of report.perFile || []) {
  const uri = f.file // already relative to repo root, e.g. "dist/index.html"
  for (const r of f.replacements || []) {
    results.push({
      ruleId: 'brand/auto-replaced',
      level: 'warning',
      message: {
        text: `Legacy "${r.match}" was auto-rewritten to "BMClinics.ai" in dist. Remove it from the source so it stops leaking into builds.`,
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri },
            region: {
              startLine: r.line,
              startColumn: r.col,
              endColumn: r.col + r.match.length,
              snippet: r.snippet ? { text: r.snippet } : undefined,
            },
          },
        },
      ],
      partialFingerprints: {
        // Stable per file+line+match so GitHub can dedupe across runs.
        primaryLocationLineHash: `${uri}:${r.line}:${r.match}`,
      },
    })
  }
  for (const s of f.skips || []) {
    results.push({
      ruleId: 'brand/unsafe-occurrence',
      level: 'error',
      message: {
        text: `Unsafe "${s.match}" in dist — ${s.reason || 'manual review required'}. Auto-fix refused to touch this location.`,
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri },
            region: {
              startLine: s.line,
              startColumn: s.col,
              endColumn: s.col + s.match.length,
              snippet: s.snippet ? { text: s.snippet } : undefined,
            },
          },
        },
      ],
      partialFingerprints: {
        primaryLocationLineHash: `${uri}:${s.line}:${s.match}:${s.reason || 'unsafe'}`,
      },
    })
  }
}

const sarif = emptySarif()
sarif.runs[0].results = results
sarif.runs[0].invocations[0].toolExecutionNotifications.push({
  level: 'note',
  message: {
    text:
      `brand-fix mode=${report.mode} • files scanned=${report.filesScanned} • ` +
      `replacements=${report.totalReplacements} • skipped=${report.totalSkips}`,
  },
})

writeSarif(sarif)
console.log(
  `✓ Wrote SARIF: ${SARIF_OUT} — ${results.length} result(s) ` +
    `(${report.totalReplacements} auto-replaced, ${report.totalSkips} unsafe)`,
)
