import { describe, it, expect } from 'vitest';
// @ts-expect-error - plain .mjs helper, no type declarations
import {
  mapSarifLevel,
  sarifToAnnotations,
  chunkAnnotations,
  SARIF_LEVEL_TO_ANNOTATION,
  DEFAULT_ANNOTATION_LEVEL,
} from '../../scripts/sarif-annotations.mjs';

describe('mapSarifLevel', () => {
  it('maps every documented SARIF level to a GitHub annotation level', () => {
    expect(mapSarifLevel('error')).toBe('failure');
    expect(mapSarifLevel('warning')).toBe('warning');
    expect(mapSarifLevel('note')).toBe('notice');
    expect(mapSarifLevel('none')).toBe('notice');
  });

  it('falls back to "warning" for unknown / missing levels', () => {
    expect(mapSarifLevel(undefined)).toBe(DEFAULT_ANNOTATION_LEVEL);
    expect(mapSarifLevel(null)).toBe(DEFAULT_ANNOTATION_LEVEL);
    expect(mapSarifLevel('bogus')).toBe(DEFAULT_ANNOTATION_LEVEL);
    expect(DEFAULT_ANNOTATION_LEVEL).toBe('warning');
  });

  it('exposes the full mapping table for documentation/use', () => {
    expect(SARIF_LEVEL_TO_ANNOTATION).toEqual({
      error: 'failure',
      warning: 'warning',
      note: 'notice',
      none: 'notice',
    });
  });
});

describe('sarifToAnnotations', () => {
  const buildResult = (level: string, ruleId = 'brand/auto-replaced') => ({
    ruleId,
    level,
    message: { text: `msg-${level}` },
    locations: [
      {
        physicalLocation: {
          artifactLocation: { uri: `dist/${level}.html` },
          region: { startLine: 10, startColumn: 3, endColumn: 12 },
        },
      },
    ],
  });

  it('maps each SARIF level through to the right annotation_level', () => {
    const sarif = {
      runs: [
        {
          tool: { driver: { rules: [] } },
          results: [
            buildResult('error'),
            buildResult('warning'),
            buildResult('note'),
            buildResult('none'),
            buildResult('mystery'),
          ],
        },
      ],
    };
    const annotations = sarifToAnnotations(sarif);
    expect(annotations.map((a: { annotation_level: string }) => a.annotation_level)).toEqual([
      'failure',
      'warning',
      'notice',
      'notice',
      'warning', // fallback
    ]);
  });

  it('skips results without a usable location', () => {
    const annotations = sarifToAnnotations({
      runs: [
        {
          results: [
            { ruleId: 'x', level: 'error' }, // no locations
            {
              ruleId: 'y',
              level: 'error',
              locations: [{ physicalLocation: { region: { startLine: 1 } } }], // no uri
            },
          ],
        },
      ],
    });
    expect(annotations).toEqual([]);
  });
});

describe('chunkAnnotations (50-per-request pagination)', () => {
  const make = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i }));

  it('returns an empty array for empty input', () => {
    expect(chunkAnnotations([])).toEqual([]);
  });

  it('keeps a single batch when input fits the cap', () => {
    const batches = chunkAnnotations(make(50));
    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(50);
  });

  it('paginates inputs > 50 into 50-sized batches with remainder last', () => {
    const batches = chunkAnnotations(make(123));
    expect(batches.map((b: unknown[]) => b.length)).toEqual([50, 50, 23]);
    // First batch starts at 0; last batch ends at the final element.
    expect(batches[0][0]).toEqual({ id: 0 });
    expect(batches[2][22]).toEqual({ id: 122 });
  });

  it('produces exactly one batch per 50 when divisible', () => {
    const batches = chunkAnnotations(make(150));
    expect(batches).toHaveLength(3);
    expect(batches.every((b: unknown[]) => b.length === 50)).toBe(true);
  });

  it('respects a custom chunk size', () => {
    const batches = chunkAnnotations(make(7), 3);
    expect(batches.map((b: unknown[]) => b.length)).toEqual([3, 3, 1]);
  });

  it('rejects non-positive sizes', () => {
    expect(() => chunkAnnotations([], 0)).toThrow(RangeError);
    expect(() => chunkAnnotations([], -1)).toThrow(RangeError);
  });
});
