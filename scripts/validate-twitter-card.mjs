#!/usr/bin/env node
/**
 * Waliduje spójność Twitter Card w `src/routes/**`.
 *
 * Reguła: jeśli w projekcie dowolny plik (root layout lub konkretna
 * trasa) ustawia `twitter:card` = `summary_large_image`, każda
 * publiczna strona (trasa z head() i title, bez robots=noindex) MUSI
 * mieć własny meta `twitter:image` z absolutnym URL (http/https).
 *
 * Pomijamy:
 *   - trasy pod `src/routes/api/**` (endpointy HTTP, nie strony),
 *   - trasy pod `src/routes/_authenticated/**` (panel, wymaga logowania),
 *   - trasy `src/routes/lovable/**` i `src/routes/email/**`
 *     (wewnętrzne endpointy),
 *   - trasy z `robots` zawierającym `noindex`,
 *   - trasy będące wyłącznie redirectami (bez `title` w head()).
 *
 * CLI:
 *   --json=path  (opcjonalny raport JSON)
 */
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const ROOT = process.cwd();
const ROUTES_DIR = join(ROOT, "src", "routes");
const CARD_VALUE = "summary_large_image";

const SKIP_PREFIXES = [
  "src/routes/api/",
  "src/routes/_authenticated/",
  "src/routes/lovable/",
  "src/routes/email/",
];

function parseArgs(argv) {
  const out = {};
  for (const a of argv) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

function toRel(p) {
  return relative(ROOT, p).replaceAll("\\", "/");
}

function shouldSkip(rel) {
  return SKIP_PREFIXES.some((p) => rel.startsWith(p));
}

/** Czy plik zawiera `head:` z zawartością meta (traktujemy jako stronę). */
function looksLikePageWithHead(src) {
  return /head\s*:\s*\(/.test(src) && /meta\s*:\s*\[/.test(src);
}

/** Czy meta blok zawiera { title: ... } albo `title` jako klucz meta. */
function hasTitle(src) {
  return /\btitle\s*:/.test(src);
}

function hasNoindex(src) {
  return /name\s*:\s*["']robots["'][^}]*content\s*:\s*["'][^"']*noindex/i.test(src);
}

function hasTwitterCardLarge(src) {
  return new RegExp(
    `name\\s*:\\s*["']twitter:card["'][^}]*content\\s*:\\s*["']${CARD_VALUE}["']`,
    "i",
  ).test(src);
}

/** Zwraca wartość content dla meta twitter:image, jeżeli istnieje. */
function findTwitterImage(src) {
  const re =
    /name\s*:\s*["']twitter:image["']\s*,\s*content\s*:\s*([^,}]+)/g;
  const matches = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

function isAbsoluteUrlExpr(expr) {
  // 1) Zwykły string literal "https://..." lub "http://..."
  const strMatch = expr.match(/^["'`](.+?)["'`]$/);
  if (strMatch) return /^https?:\/\//i.test(strMatch[1]);

  // 2) Template literal z prefiksem `https://...${...}` lub odwrotnie
  if (/^`https?:\/\//i.test(expr)) return true;

  // 3) withOgVersion(`https://...`) / withOgVersion("https://...") —
  //    wrapper zawsze zwraca oryginalny URL z parametrem wersji.
  if (/withOgVersion\s*\(\s*[`"']https?:\/\//i.test(expr)) return true;
  if (/withOgVersion\s*\(\s*`https?:\/\//i.test(expr)) return true;

  // 4) Dowolne wyrażenie zawierające literal "https://bmclinics.ai" lub
  //    zmienną OG_IMAGE / OG_URL uznajemy za absolutne — projekt trzyma
  //    absolutne URL-e w tych stałych.
  if (/https?:\/\/[\w.-]+/.test(expr)) return true;
  if (/\b(OG_IMAGE|OG_URL|ABSOLUTE_[A-Z_]+)\b/.test(expr)) return true;

  return false;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = walk(ROUTES_DIR).map((f) => ({ path: f, rel: toRel(f) }));

  // Sprawdzenie globalne: czy w ogóle ustawiamy summary_large_image?
  const sourcesWithCard = files.filter((f) =>
    hasTwitterCardLarge(readFileSync(f.path, "utf8")),
  );
  if (sourcesWithCard.length === 0) {
    console.log("✓ validate-twitter-card: brak twitter:card=summary_large_image w projekcie — reguła nieaktywna.");
    return;
  }

  const issues = [];
  const checked = [];
  for (const { path, rel } of files) {
    if (shouldSkip(rel)) continue;
    const src = readFileSync(path, "utf8");
    if (!looksLikePageWithHead(src)) continue;
    if (!hasTitle(src)) continue; // redirect-only / pusty head
    if (hasNoindex(src)) continue;

    checked.push(rel);
    const images = findTwitterImage(src);
    if (images.length === 0) {
      issues.push({
        file: rel,
        reason:
          "brak meta twitter:image — wymagane, bo projekt ustawia twitter:card=summary_large_image (root __root.tsx).",
      });
      continue;
    }
    for (const expr of images) {
      if (!isAbsoluteUrlExpr(expr)) {
        issues.push({
          file: rel,
          reason: `twitter:image nie jest absolutnym URL: ${expr}. Użyj \`https://bmclinics.ai\${asset}\` lub withOgVersion(\`https://…\`).`,
        });
      }
    }
  }

  const report = {
    cardSources: sourcesWithCard.map((s) => s.rel),
    checkedRoutes: checked,
    issues,
  };
  if (args.json) {
    mkdirSync(dirname(args.json), { recursive: true });
    writeFileSync(args.json, JSON.stringify(report, null, 2));
  }

  if (issues.length > 0) {
    console.error(`✖ validate-twitter-card: ${issues.length} problem(y):\n`);
    for (const i of issues) console.error(`  - ${i.file}  ${i.reason}`);
    console.error(
      `\nRoot ustawia twitter:card=summary_large_image w: ${sourcesWithCard.map((s) => s.rel).join(", ")}`,
    );
    process.exit(1);
  }
  console.log(
    `✓ validate-twitter-card: ${checked.length} publicznych stron ma poprawne twitter:image (absolutny URL).`,
  );
}

main();
