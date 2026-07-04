#!/usr/bin/env node
/**
 * Waliduje JSON-LD `geo` (schema.org GeoCoordinates) w źródłach tras.
 *
 * Zasady:
 *   - Każdy blok `"@type": "GeoCoordinates"` w `src/routes/**` MUSI mieć
 *     `latitude` / `longitude` zgodne z `src/config/clinic.ts`
 *     (CLINIC_ADDRESS.latitude / .longitude), z tolerancją 1e-4°.
 *   - Wartości mogą być podane literalnie (np. `latitude: 52.15515`) lub
 *     jako referencja do `CLINIC_ADDRESS.latitude` / `CLINIC_GEO_JSONLD`
 *     / `...CLINIC_GEO_JSONLD` — referencje zawsze przechodzą.
 *   - Kluczowe strony (index, diagnostyka-skory-warszawa,
 *     technologie.laser-frakcyjny-co2-warszawa) MUSZĄ zawierać co najmniej
 *     jeden blok GeoCoordinates — brak = błąd (regression guard).
 *
 * CLI:
 *   --json=path            (raport JSON, opcjonalny)
 */
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const ROOT = process.cwd();
const ROUTES_DIR = join(ROOT, "src", "routes");
const CLINIC_FILE = join(ROOT, "src", "config", "clinic.ts");
const TOLERANCE = 1e-4;

// Strony, które MUSZĄ mieć zdefiniowane geo (regression guard):
const REQUIRED_GEO_ROUTES = [
  "src/routes/index.tsx",
  "src/routes/diagnostyka-skory-warszawa.tsx",
  "src/routes/technologie.laser-frakcyjny-co2-warszawa.tsx",
];

function parseArgs(argv) {
  const out = {};
  for (const a of argv) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function readCanonicalGeo() {
  const src = readFileSync(CLINIC_FILE, "utf8");
  const lat = src.match(/latitude:\s*([\d.-]+)/);
  const lng = src.match(/longitude:\s*([\d.-]+)/);
  if (!lat || !lng) {
    throw new Error("Nie odnaleziono latitude/longitude w src/config/clinic.ts");
  }
  return { latitude: parseFloat(lat[1]), longitude: parseFloat(lng[1]) };
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(t|j)sx?$/.test(name)) out.push(p);
  }
  return out;
}

/**
 * Wyciąga z tekstu wszystkie bloki `{ ... "@type": "GeoCoordinates" ... }`.
 * Prosty parser nawiasów — wystarczający do rozpoznawania bloków
 * zdefiniowanych inline w head() / JSON-LD.
 */
function extractGeoBlocks(src) {
  const blocks = [];
  const marker = /"@type"\s*:\s*"GeoCoordinates"/g;
  let m;
  while ((m = marker.exec(src)) !== null) {
    // znajdź obejmujący blok {...}
    let start = m.index;
    while (start > 0 && src[start] !== "{") start--;
    if (src[start] !== "{") continue;
    let depth = 0;
    let end = -1;
    for (let i = start; i < src.length; i++) {
      const c = src[i];
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
    if (end < 0) continue;
    // policz linię
    const before = src.slice(0, start);
    const line = before.split("\n").length;
    blocks.push({ text: src.slice(start, end + 1), line });
  }
  return blocks;
}

function evaluateCoord(raw) {
  // literal numeric
  const num = raw.match(/^-?\d+(?:\.\d+)?$/);
  if (num) return { kind: "literal", value: parseFloat(raw) };
  // reference to CLINIC_ADDRESS / CLINIC_GEO_JSONLD
  if (/CLINIC_(?:ADDRESS|GEO_JSONLD)\.(latitude|longitude)/.test(raw)) {
    return { kind: "reference", value: null };
  }
  return { kind: "unknown", raw };
}

function validateBlock(block, canon) {
  // Spread ...CLINIC_GEO_JSONLD → OK
  if (/\.\.\.CLINIC_GEO_JSONLD\b/.test(block.text)) {
    return { ok: true, reason: "spread-canonical" };
  }
  const latM = block.text.match(/latitude\s*:\s*([^,\n}]+)/);
  const lngM = block.text.match(/longitude\s*:\s*([^,\n}]+)/);
  if (!latM || !lngM) {
    return { ok: false, reason: "missing latitude/longitude in GeoCoordinates block" };
  }
  const lat = evaluateCoord(latM[1].trim());
  const lng = evaluateCoord(lngM[1].trim());

  if (lat.kind === "reference" && lng.kind === "reference") {
    return { ok: true, reason: "reference-canonical" };
  }
  if (lat.kind === "unknown" || lng.kind === "unknown") {
    return {
      ok: false,
      reason: `nierozpoznana wartość latitude/longitude: lat=${latM[1].trim()}, lng=${lngM[1].trim()}`,
    };
  }
  // przynajmniej jedna literal — porównaj z kanonicznym
  const actualLat = lat.kind === "literal" ? lat.value : canon.latitude;
  const actualLng = lng.kind === "literal" ? lng.value : canon.longitude;
  const dLat = Math.abs(actualLat - canon.latitude);
  const dLng = Math.abs(actualLng - canon.longitude);
  if (dLat > TOLERANCE || dLng > TOLERANCE) {
    return {
      ok: false,
      reason: `geo mismatch: got (${actualLat}, ${actualLng}), expected (${canon.latitude}, ${canon.longitude}) — używaj CLINIC_ADDRESS.latitude / .longitude z src/config/clinic.ts`,
    };
  }
  return { ok: true, reason: "literal-matches" };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const canon = readCanonicalGeo();
  const files = walk(ROUTES_DIR);
  const issues = [];
  const seen = new Set();

  for (const file of files) {
    const rel = relative(ROOT, file).replaceAll("\\", "/");
    const src = readFileSync(file, "utf8");
    const blocks = extractGeoBlocks(src);
    if (blocks.length > 0) seen.add(rel);
    for (const b of blocks) {
      const v = validateBlock(b, canon);
      if (!v.ok) {
        issues.push({ file: rel, line: b.line, reason: v.reason });
      }
    }
  }

  for (const req of REQUIRED_GEO_ROUTES) {
    if (!seen.has(req)) {
      issues.push({
        file: req,
        line: 0,
        reason: "brak bloku JSON-LD GeoCoordinates na kluczowej stronie (regression guard)",
      });
    }
  }

  const report = {
    canonical: canon,
    tolerance: TOLERANCE,
    filesWithGeo: [...seen].sort(),
    issues,
  };

  if (args.json) {
    mkdirSync(dirname(args.json), { recursive: true });
    writeFileSync(args.json, JSON.stringify(report, null, 2));
  }

  if (issues.length > 0) {
    console.error(`✖ validate-geo-jsonld: ${issues.length} problem(y):\n`);
    for (const i of issues) {
      console.error(`  - ${i.file}:${i.line}  ${i.reason}`);
    }
    console.error(
      `\nKanoniczne współrzędne (src/config/clinic.ts): ${canon.latitude}, ${canon.longitude}`,
    );
    process.exit(1);
  }
  console.log(
    `✓ validate-geo-jsonld: ${seen.size} plik(ów) z GeoCoordinates zgodnych z (${canon.latitude}, ${canon.longitude}).`,
  );
}

main();
