#!/usr/bin/env node
/**
 * Content quality report.
 *
 * Skanuje pliki tras (src/routes/**\/*.tsx) i wyciąga widoczne fragmenty
 * tekstu (zawartość JSX między tagami oraz wartości w props meta: title,
 * description, og:title, og:description). Dla każdej podstrony liczy:
 *
 *   - truncated: fraza urwana wielokropkiem (… lub ...) lub kończąca się
 *     jedno-/dwuliterowym skrótem typu "kto bu" / "po…"
 *   - doubleSpaces: dwie lub więcej spacji pod rząd
 *   - missingPeriods: zdania/akapity dłuższe niż 40 znaków zakończone bez
 *     znaku interpunkcyjnego (. ! ? : … )) — proxy dla "brakujących kropek"
 *
 * Raport: konsola + content-quality-report.md w katalogu projektu.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROUTES_DIR = "src/routes";
const OUTPUT_FILE = "content-quality-report.md";

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(name) && !/\.test\.|\.spec\./.test(name)) out.push(full);
  }
  return out;
}

/** Wyciąga tekst widoczny dla użytkownika z pliku route'u. */
function extractTexts(src) {
  /** @type {string[]} */
  const texts = [];

  // 1) tekst pomiędzy tagami JSX: >coś<
  //    odfiltrowujemy fragmenty będące w istocie wyrażeniami {expr}
  const between = src.match(/>([^<>{}]{3,})</g) ?? [];
  for (const m of between) {
    const t = m.slice(1, -1).trim();
    if (t && !/^[\s\d\-–—:|•·]+$/.test(t)) texts.push(t);
  }

  // 2) literały w props meta (head() oraz og/twitter)
  const metaRe = /(title|description|content)\s*:\s*(["'`])([^"'`]{5,})\2/g;
  let mm;
  while ((mm = metaRe.exec(src)) !== null) texts.push(mm[3].trim());

  return texts;
}

const TRUNCATED_RE = /(\.{3}|…)\s*$|\b\w{1,2}…?\s*$/;
const DOUBLE_SPACE_RE = / {2,}/;

function analyze(text) {
  /** @type {{truncated:number;doubleSpaces:number;missingPeriods:number;samples:string[]}} */
  const r = { truncated: 0, doubleSpaces: 0, missingPeriods: 0, samples: [] };

  // Truncated: kończy się … / ... lub krótkim, "uciętym" wyrazem (np. "bu")
  if (TRUNCATED_RE.test(text) || /\b[a-ząćęłńóśźż]{1,2}$/i.test(text.trim())) {
    // odfiltruj rzeczy typu "II", inicjały
    if (!/^[A-ZĄĆĘŁŃÓŚŹŻ]{1,3}$/.test(text.trim())) {
      r.truncated++;
      r.samples.push(`urwane: "${text}"`);
    }
  }

  if (DOUBLE_SPACE_RE.test(text)) {
    r.doubleSpaces++;
    r.samples.push(`podwójne spacje: "${text.replace(/ {2,}/g, " ␣␣ ")}"`);
  }

  // Brakująca kropka: zdanie ≥ 40 znaków, kończy się literą/cyfrą
  const trimmed = text.trim();
  if (
    trimmed.length >= 40 &&
    /[\p{L}\p{N})]$/u.test(trimmed) &&
    !/[.!?…:]$/.test(trimmed) &&
    // nie nagłówek (heurystyka: nie krzyczy CAPS-em)
    !/^[A-ZĄĆĘŁŃÓŚŹŻ0-9 ,\-–—]+$/.test(trimmed)
  ) {
    r.missingPeriods++;
    r.samples.push(`brak kropki: "${trimmed.slice(0, 80)}${trimmed.length > 80 ? "…" : ""}"`);
  }

  return r;
}

function routeIdFromFile(file) {
  // src/routes/foo.bar.tsx -> /foo/bar ; index -> /
  const rel = relative(ROUTES_DIR, file).replace(/\\/g, "/").replace(/\.tsx?$/, "");
  if (rel === "__root") return "(root layout)";
  return (
    "/" +
    rel
      .replace(/\.index$/, "")
      .replace(/\./g, "/")
      .replace(/^index$/, "")
  );
}

function main() {
  const files = walk(ROUTES_DIR);
  /** @type {{route:string;file:string;texts:number;truncated:number;doubleSpaces:number;missingPeriods:number;issuePct:number;samples:string[]}[]} */
  const rows = [];

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const texts = extractTexts(src);
    if (!texts.length) continue;

    const agg = { truncated: 0, doubleSpaces: 0, missingPeriods: 0 };
    /** @type {string[]} */
    const samples = [];
    for (const t of texts) {
      const r = analyze(t);
      agg.truncated += r.truncated;
      agg.doubleSpaces += r.doubleSpaces;
      agg.missingPeriods += r.missingPeriods;
      if (r.samples.length && samples.length < 5) samples.push(...r.samples.slice(0, 5 - samples.length));
    }

    const totalIssues = agg.truncated + agg.doubleSpaces + agg.missingPeriods;
    rows.push({
      route: routeIdFromFile(file),
      file,
      texts: texts.length,
      truncated: agg.truncated,
      doubleSpaces: agg.doubleSpaces,
      missingPeriods: agg.missingPeriods,
      issuePct: texts.length ? Math.round((totalIssues / texts.length) * 1000) / 10 : 0,
      samples,
    });
  }

  rows.sort((a, b) => b.issuePct - a.issuePct);

  // markdown
  const lines = [
    "# Raport jakości treści",
    "",
    `Wygenerowano: ${new Date().toISOString()}`,
    `Przeskanowanych plików tras: ${rows.length}`,
    "",
    "| Podstrona | Fragmentów | Urwane | Podwójne spacje | Brak kropki | % problemów |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const r of rows) {
    lines.push(
      `| \`${r.route}\` | ${r.texts} | ${r.truncated} | ${r.doubleSpaces} | ${r.missingPeriods} | ${r.issuePct}% |`,
    );
  }

  const problematic = rows.filter((r) => r.truncated + r.doubleSpaces + r.missingPeriods > 0);
  if (problematic.length) {
    lines.push("", "## Przykłady (do 5 na podstronę)", "");
    for (const r of problematic) {
      lines.push(`### \`${r.route}\``);
      for (const s of r.samples) lines.push(`- ${s}`);
      lines.push("");
    }
  }

  writeFileSync(OUTPUT_FILE, lines.join("\n"));

  // konsola
  const total = rows.reduce(
    (a, r) => ({
      texts: a.texts + r.texts,
      issues: a.issues + r.truncated + r.doubleSpaces + r.missingPeriods,
    }),
    { texts: 0, issues: 0 },
  );
  console.log(`\nContent quality report → ${OUTPUT_FILE}`);
  console.log(`Łącznie fragmentów: ${total.texts}, problemów: ${total.issues}`);
  console.log("Top 10 podstron wg % problemów:");
  for (const r of rows.slice(0, 10)) {
    console.log(
      `  ${r.issuePct.toString().padStart(5)}%  ${r.route.padEnd(40)}  ` +
        `trunc=${r.truncated} dbl=${r.doubleSpaces} dot=${r.missingPeriods}`,
    );
  }
}

main();
