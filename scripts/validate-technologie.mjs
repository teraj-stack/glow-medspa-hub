#!/usr/bin/env node
/**
 * Strict content validator for /technologie routes.
 *
 * Skanuje wszystkie pliki `src/routes/technologie*.tsx` i wymusza twarde
 * zasady redakcyjne. Wyjście != 0 = build pada (CI / postbuild).
 *
 * Wykrywa:
 *   1. Urwane zakończenia: "…" / "..." na końcu zdania, jedno-/dwuliterowe
 *      ogony typu "kto bu", "po…", "zaaw…".
 *   2. Złe cudzysłowy: proste " ' zamiast polskich „ ” oraz francuskich » «
 *      w długich literałach widocznych dla użytkownika.
 *   3. Polskie ogonki: heurystyka — fragmenty z polskimi słowami bez ani
 *      jednego diakrytyku tam, gdzie powinny być (np. "mozliwosc", "zabieg
 *      jest bardzo bezpieczny ale" → flaga "może brak polskich znaków").
 *
 * Tryby:
 *   node scripts/validate-technologie.mjs           # strict (exit 1 on issues)
 *   node scripts/validate-technologie.mjs --warn    # report only (exit 0)
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROUTES_DIR = "src/routes";
const WARN_ONLY = process.argv.includes("--warn");

const files = readdirSync(ROUTES_DIR)
  .filter((f) => /^technologie.*\.tsx$/.test(f))
  .map((f) => join(ROUTES_DIR, f));

function extractTexts(src) {
  /** @type {{text:string;line:number}[]} */
  const out = [];
  const lines = src.split("\n");

  // tekst pomiędzy tagami JSX
  for (let i = 0; i < lines.length; i++) {
    const re = />([^<>{}]{4,})</g;
    let m;
    while ((m = re.exec(lines[i])) !== null) {
      const t = m[1].trim();
      if (t && !/^[\s\d\-–—:|•·/]+$/.test(t)) out.push({ text: t, line: i + 1 });
    }
  }

  // literały meta (title/description/content)
  const metaRe = /(title|description|content)\s*:\s*(["'`])([^"'`\n]{6,})\2/g;
  let mm;
  while ((mm = metaRe.exec(src)) !== null) {
    const before = src.slice(0, mm.index).split("\n").length;
    out.push({ text: mm[3].trim(), line: before });
  }
  return out;
}

const TRUNCATED_ELLIPSIS = /(\.{3}|…)\s*$/;
const TRUNCATED_TAIL = /\b[a-ząćęłńóśźż]{1,2}$/i;
// proste cudzysłowy w obrębie literału (z wyłączeniem apostrofów w nazwach typu d'Or — rzadkość)
const STRAIGHT_QUOTES = /(^|[\s(\[])"[^"]{3,}"/;
const STRAIGHT_APOS = /\b\w+'\w+/; // np. it's — w polskich treściach niepotrzebne
// słowa, które prawie zawsze mają polski znak
const POLISH_HINT_WORDS =
  /\b(mozliwo|bezpiecze|skutecz|zabieg|pielegnac|leczeni|swiat|piek|sredni|warszaw|siedlc|cwicz|cwartek|wiek|naskor|przebar|niedostat|jakos|wlasn|bedzi|moze|ktor|wszystk|zadn|cwiartk|miesi[ae]c|tydzie|polsk|rownie|rozni|wiecej|laczy|wlacz|miekk|gladk|szybk|naturaln|estetycz|kosmetolog|leczeni|tlumacz|opieki|opiek)/i;
const POLISH_DIACRITICS = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

/** @type {{file:string;line:number;rule:string;text:string}[]} */
const issues = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const texts = extractTexts(src);
  for (const { text, line } of texts) {
    // 1. urwane zakończenie
    if (TRUNCATED_ELLIPSIS.test(text)) {
      issues.push({ file, line, rule: "truncated-ellipsis", text });
    } else if (
      text.length > 25 &&
      TRUNCATED_TAIL.test(text.trim()) &&
      !/[.!?:)]$/.test(text.trim()) &&
      // pomijamy całe pojedyncze słowa typu "PL", "v2"
      !/^\S+$/.test(text.trim())
    ) {
      issues.push({ file, line, rule: "truncated-tail", text });
    }

    // 2. cudzysłowy
    if (STRAIGHT_QUOTES.test(text)) {
      issues.push({ file, line, rule: "straight-quotes", text });
    }
    if (STRAIGHT_APOS.test(text)) {
      issues.push({ file, line, rule: "straight-apostrophe", text });
    }

    // 3. brak polskich znaków w "polskim" tekście
    if (
      text.length > 25 &&
      POLISH_HINT_WORDS.test(text) &&
      !POLISH_DIACRITICS.test(text) &&
      // pomiń CAPSY (nagłówki sekcji często bez diakrytyków świadomie, ale tu wymagamy)
      !/^[A-Z0-9 .,\-–—]+$/.test(text)
    ) {
      issues.push({ file, line, rule: "missing-polish-diacritics", text });
    }
  }
}

if (issues.length === 0) {
  console.log(`✓ /technologie: ${files.length} plików OK, brak wykrytych problemów`);
  process.exit(0);
}

const byRule = issues.reduce((acc, i) => ((acc[i.rule] = (acc[i.rule] ?? 0) + 1), acc), {});
console.log(`✗ /technologie: ${issues.length} problemów w ${files.length} plikach`);
for (const [rule, n] of Object.entries(byRule)) console.log(`   - ${rule}: ${n}`);
console.log("");
for (const i of issues) {
  console.log(`  ${i.file}:${i.line}  [${i.rule}]`);
  console.log(`    "${i.text.length > 120 ? i.text.slice(0, 117) + "…" : i.text}"`);
}

if (WARN_ONLY) {
  console.log("\n(--warn) raportowanie tylko, build nie pada");
  process.exit(0);
}
process.exit(1);
