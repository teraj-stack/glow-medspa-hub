#!/usr/bin/env node
/**
 * NAP (Name, Address, Phone) validator.
 *
 * Blokuje build, jeśli:
 *   - w kodzie lub w dist/ pojawi się stara/zakazana fraza adresowa
 *     (Promedion, Bielany, Wóycickiego/Woycickiego, 02-097),
 *   - wzmianka o "Branickiego" nie zawiera numeru "10",
 *   - postal code obok "Branickiego" jest inny niż kanoniczny 02-972,
 *   - któryś JSON-LD PostalAddress w src/routes/ ma pole niezgodne
 *     z src/config/clinic.ts (streetAddress / addressLocality /
 *     postalCode / addressRegion / addressCountry).
 *
 * Uwaga: allowlist plików służy tylko do wyjątków — komentarze
 * historyczne, migracje, dokumentacja skanera. Sam plik walidatora
 * jest z automatu na allowliście.
 *
 * CLI:
 *   --scope=src|dist|both  (default: src)
 *   --json=path            (raport JSON)
 */
import { readdirSync, readFileSync, writeFileSync, statSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

// ---------- Kanoniczny NAP (musi być identyczny z src/config/clinic.ts) ----------
const CANON = {
  street: "ul. Branickiego 10",
  postalCode: "02-972",
  city: "Warszawa",
  region: "mazowieckie",
  country: "PL",
};

// ---------- Zakazane frazy (case-insensitive, jako całe słowa) ----------
const FORBIDDEN = [
  { id: "promedion", pattern: /\bpromedion\b/i, note: "Stara nazwa poprzedniego miejsca pracy — usuń wszystkie wzmianki." },
  { id: "bielany", pattern: /\bbielany\b/i, note: "Klinika jest w Wilanowie, nie na Bielanach." },
  { id: "woycickiego", pattern: /\bw(?:ó|o)ycickiego\b/i, note: "Stary adres (ul. Wóycickiego) — zastąp ul. Branickiego 10." },
  { id: "postal-02-097", pattern: /\b02-097\b/, note: "Stary kod pocztowy (Bielany). Kanoniczny: 02-972 (Wilanów)." },
  { id: "siedlce", pattern: /siedl(?:c|ec)/i, note: "Nie używamy nazwy tego miasta nigdzie w serwisie — tylko Warszawa." },
];

// ---------- Allowlista plików (pełne ścieżki relatywne od root) ----------
const ALLOWLIST = new Set([
  "scripts/validate-nap.mjs",
  "src/lib/sitemap-entries.ts",
]);

// Katalogi skanowane w src
const SRC_ROOTS = ["src"];
const SRC_EXT = /\.(ts|tsx|js|jsx|mjs|md|mdx|json|html|css)$/;

// Katalogi/rozszerzenia w dist
const DIST_ROOTS = ["dist"];
const DIST_EXT = /\.(html|xml|txt|json|js|css)$/;

// ---------- args ----------
const args = { scope: "src", json: null };
for (const a of process.argv.slice(2)) {
  if (a.startsWith("--scope=")) args.scope = a.slice(8);
  else if (a.startsWith("--json=")) args.json = a.slice(7);
}

// ---------- helpers ----------
function walk(root, extRe) {
  if (!existsSync(root)) return [];
  const out = [];
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    const st = statSync(cur);
    if (st.isDirectory()) {
      for (const entry of readdirSync(cur)) {
        if (entry === "node_modules" || entry.startsWith(".git")) continue;
        stack.push(join(cur, entry));
      }
    } else if (st.isFile() && extRe.test(cur)) {
      out.push(cur);
    }
  }
  return out;
}

function lineNo(source, index) {
  let n = 1;
  for (let i = 0; i < index; i++) if (source.charCodeAt(i) === 10) n++;
  return n;
}

function findAll(source, re) {
  const hits = [];
  const rx = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m;
  while ((m = rx.exec(source))) {
    hits.push({ index: m.index, match: m[0] });
    if (m.index === rx.lastIndex) rx.lastIndex++;
  }
  return hits;
}

// ---------- reguły ----------
const issues = [];

function scanFile(path) {
  const rel = path.split(sep).join("/");
  if (ALLOWLIST.has(rel)) return;
  const src = readFileSync(path, "utf8");

  // 1) zakazane frazy
  for (const rule of FORBIDDEN) {
    for (const hit of findAll(src, rule.pattern)) {
      issues.push({
        rule: `forbidden:${rule.id}`,
        file: rel,
        line: lineNo(src, hit.index),
        message: `Zakazana fraza „${hit.match}" — ${rule.note}`,
      });
    }
  }

  // 2) Branickiego z numerem innym niż 10 (np. "Branickiego 4", "Branickiego 12")
  //    Sama "Branickiego" bez numeru (keyword SEO, wzmianka o przystanku)
  //    jest dozwolona — flagujemy wyłącznie konkretną, złą numerację.
  for (const hit of findAll(src, /Branickiego\s+(\d+)/g)) {
    const num = hit.match.match(/\d+/)[0];
    if (num !== "10") {
      issues.push({
        rule: "nap:wrong-street-number",
        file: rel,
        line: lineNo(src, hit.index),
        message: `Wzmianka „Branickiego ${num}" — kanoniczny numer to 10 („${CANON.street}").`,
      });
    }
  }


  // 3) postal code w pobliżu Branickiego musi być 02-972
  for (const hit of findAll(src, /Branickiego[\s\S]{0,200}?(\d{2}-\d{3})/g)) {
    const code = hit.match.match(/\d{2}-\d{3}/)[0];
    if (code !== CANON.postalCode) {
      issues.push({
        rule: "nap:wrong-postal-code",
        file: rel,
        line: lineNo(src, hit.index),
        message: `Adres Branickiego z niekanonicznym kodem „${code}" (oczekiwane: ${CANON.postalCode}).`,
      });
    }
  }

  // 4) JSON-LD PostalAddress w src/routes/ musi mieć kanoniczne pola
  if (rel.startsWith("src/routes/")) {
    for (const hit of findAll(src, /"@type"\s*:\s*"PostalAddress"[\s\S]{0,600}?\}/g)) {
      const block = hit.match;
      const getField = (name) => {
        const m = block.match(new RegExp(`${name}\\s*:\\s*"([^"]+)"`));
        return m ? m[1] : null;
      };
      const checks = [
        ["addressLocality", CANON.city],
        ["addressRegion", CANON.region],
        ["postalCode", CANON.postalCode],
        ["addressCountry", CANON.country],
      ];
      for (const [field, expected] of checks) {
        const v = getField(field);
        if (v == null) continue; // pole może być rozwinięte przez spread — dopuszczamy
        if (v !== expected) {
          issues.push({
            rule: "nap:jsonld-mismatch",
            file: rel,
            line: lineNo(src, hit.index),
            message: `PostalAddress.${field} = „${v}", oczekiwane „${expected}". Użyj ...CLINIC_POSTAL_ADDRESS_JSONLD z @/config/clinic.`,
          });
        }
      }
      const street = getField("streetAddress");
      if (street != null && !street.startsWith(CANON.street)) {
        issues.push({
          rule: "nap:jsonld-mismatch",
          file: rel,
          line: lineNo(src, hit.index),
          message: `PostalAddress.streetAddress = „${street}", oczekiwane zaczynające się od „${CANON.street}".`,
        });
      }
    }
  }
}

// ---------- run ----------
const roots = args.scope === "dist" ? DIST_ROOTS : args.scope === "both" ? [...SRC_ROOTS, ...DIST_ROOTS] : SRC_ROOTS;
const extRe = args.scope === "dist" ? DIST_EXT : args.scope === "both" ? new RegExp(SRC_EXT.source + "|" + DIST_EXT.source) : SRC_EXT;

const files = roots.flatMap((r) => walk(r, extRe));
for (const f of files) scanFile(f);

// ---------- raport ----------
if (args.json) {
  mkdirSync(dirname(args.json), { recursive: true });
  writeFileSync(args.json, JSON.stringify({ ok: issues.length === 0, scope: args.scope, canonical: CANON, issues }, null, 2));
}

if (issues.length === 0) {
  console.log(`✔ NAP validator: OK (${files.length} plików, scope=${args.scope}).`);
  process.exit(0);
}

console.error(`✖ NAP validator: ${issues.length} problem(ów) w ${new Set(issues.map((i) => i.file)).size} plikach.\n`);
const byFile = new Map();
for (const it of issues) {
  if (!byFile.has(it.file)) byFile.set(it.file, []);
  byFile.get(it.file).push(it);
}
for (const [file, list] of byFile) {
  console.error(`  ${file}`);
  for (const it of list) {
    console.error(`    L${it.line}  [${it.rule}]  ${it.message}`);
  }
}
console.error("\nKanoniczny NAP: " + JSON.stringify(CANON));
console.error("Źródło prawdy: src/config/clinic.ts");
process.exit(1);
