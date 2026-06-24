/**
 * Brand consistency tests.
 *
 * Verifies that every email template (rendered HTML + subject) and every
 * source file in the project uses "BMClinics.ai" and never the legacy
 * "BM Clinics" form.
 */
import { describe, it, expect } from 'vitest'
import { render } from '@react-email/render'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import React from 'react'

import { TEMPLATES } from '@/lib/email-templates/registry'

const FORBIDDEN = /BM[\s\u00A0]+Clinics/i
const REQUIRED = 'BMClinics.ai'

describe('Email templates — brand strings', () => {
  for (const [name, entry] of Object.entries(TEMPLATES)) {
    it(`[${name}] rendered HTML contains "${REQUIRED}" and no "BM Clinics"`, async () => {
      const data = entry.previewData ?? {}
      const html = await render(React.createElement(entry.component, data))
      expect(html).toContain(REQUIRED)
      expect(html).not.toMatch(FORBIDDEN)
    })

    it(`[${name}] subject uses BMClinics.ai (or omits brand) and no "BM Clinics"`, () => {
      const subject =
        typeof entry.subject === 'function'
          ? entry.subject(entry.previewData ?? {})
          : entry.subject
      expect(subject).not.toMatch(FORBIDDEN)
    })
  }
})

describe('Source tree — no legacy "BM Clinics" string', () => {
  const ROOT = resolve(__dirname, '../..')
  const SCAN_DIRS = ['src', 'public', 'scripts']
  const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'routeTree.gen.ts'])
  const ALLOW_FILES = new Set<string>([
    resolve(__dirname, 'brand.test.ts'),
    resolve(ROOT, 'scripts/validate-brand.mjs'),
    resolve(ROOT, 'scripts/validate-brand-dist.mjs'),
    resolve(ROOT, 'scripts/fix-brand-dist.mjs'),
  ])
  const SCAN_EXT = /\.(tsx?|jsx?|mjs|cjs|css|md|html|txt|json)$/i

  function walk(dir: string, out: string[] = []): string[] {
    let entries: string[]
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

  const files = SCAN_DIRS.flatMap((d) => walk(resolve(ROOT, d)))

  it('scans at least some files', () => {
    expect(files.length).toBeGreaterThan(50)
  })

  it('contains no "BM Clinics" occurrences', () => {
    const offenders: string[] = []
    for (const file of files) {
      if (ALLOW_FILES.has(file)) continue
      const content = readFileSync(file, 'utf8')
      if (FORBIDDEN.test(content)) {
        const lines = content.split('\n')
        lines.forEach((line, i) => {
          if (FORBIDDEN.test(line)) {
            offenders.push(`${file}:${i + 1}: ${line.trim()}`)
          }
        })
      }
    }
    expect(offenders, `Found legacy "BM Clinics":\n${offenders.join('\n')}`).toEqual([])
  })
})
