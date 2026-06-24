// Pure helpers for converting SARIF results into GitHub Checks annotations.
// Kept dependency-free so it can be `require()`d from actions/github-script
// and imported from vitest.

export const SARIF_LEVEL_TO_ANNOTATION = {
  error: 'failure',
  warning: 'warning',
  note: 'notice',
  none: 'notice',
};

export const DEFAULT_ANNOTATION_LEVEL = 'warning';

/** Map a SARIF result `level` to a GitHub Checks `annotation_level`. */
export function mapSarifLevel(level) {
  return SARIF_LEVEL_TO_ANNOTATION[level] ?? DEFAULT_ANNOTATION_LEVEL;
}

/** Convert a parsed SARIF document into a flat array of Checks annotations. */
export function sarifToAnnotations(sarif) {
  const annotations = [];
  for (const run of sarif?.runs ?? []) {
    const rules = new Map(
      (run.tool?.driver?.rules ?? []).map((r) => [r.id, r]),
    );
    for (const res of run.results ?? []) {
      const loc = res.locations?.[0]?.physicalLocation;
      const uri = loc?.artifactLocation?.uri;
      const region = loc?.region;
      if (!uri || !region?.startLine) continue;

      const rule = rules.get(res.ruleId);
      const ruleName = rule?.shortDescription?.text ?? res.ruleId ?? 'brand';
      const message =
        res.message?.text ??
        rule?.fullDescription?.text ??
        'Brand validation finding';
      const snippet = region.snippet?.text;
      const sameLine =
        region.startColumn && (!region.endLine || region.endLine === region.startLine);

      annotations.push({
        path: uri,
        start_line: region.startLine,
        end_line: region.endLine ?? region.startLine,
        ...(sameLine
          ? {
              start_column: region.startColumn,
              end_column: region.endColumn ?? region.startColumn,
            }
          : {}),
        annotation_level: mapSarifLevel(res.level),
        title: `[${res.ruleId ?? 'brand'}] ${ruleName}`,
        message: snippet ? `${message}\n\nSnippet:\n${snippet}` : message,
      });
    }
  }
  return annotations;
}

/**
 * Chunk an annotations array into batches of at most `size` (default 50 —
 * the GitHub Checks API per-request cap). Empty input → empty array.
 */
export function chunkAnnotations(annotations, size = 50) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError(`chunkAnnotations: size must be a positive integer, got ${size}`);
  }
  const out = [];
  for (let i = 0; i < annotations.length; i += size) {
    out.push(annotations.slice(i, i + size));
  }
  return out;
}
