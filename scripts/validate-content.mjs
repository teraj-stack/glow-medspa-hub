#!/usr/bin/env node
/**
 * Generic content validator for selected route sections.
 *
 * Sekcje:
 *   technologie  → src/routes/technologie*.tsx
 *   blog         → src/routes/blog.*.tsx
 *   faq          → src/routes/bezpieczenstwo-zabiegow-laserowych.tsx (Q&A)
 *   all          → wszystkie powyższe
 *
 * Reguły (te same dla każdej sekcji):
 *   - truncated-fragment  : 1–3 znaki + "…" (np. "bu…", "zaaw...")
 *   - ellipsis            : "…" / "..." w treści
 *   - straight-quotes     : "..." zamiast „...”
 *   - straight-apostrophe : it's, l'or — w polskim tekście niepożądane
 *   - missing-polish-diacritics : polski wyraz pisany bez ogonków
 *
 * CLI:
 *   --section=technologie|blog|faq|all   (default: all)
 *   --json=path                          (zapis raportu JSON)
 *   --html=path                          (zapis raportu HTML)
 *   --warn                               (exit 0 nawet przy błędach)
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const ROUTES_DIR = "src/routes";

const SECTIONS = {
  technologie: (f) => /^technologie.*\.tsx$/.test(f),
  blog: (f) => /^blog\..*\.tsx$/.test(f),
  faq: (f) => /^bezpieczenstwo-zabiegow-laserowych\.tsx$/.test(f),
};

function parseArgs(argv) {
  const out = { section: "all", json: null, html: null, warn: false };
  for (const a of argv.slice(2)) {
    if (a === "--warn") out.warn = true;
    else if (a.startsWith("--section=")) out.section = a.slice(10);
    else if (a.startsWith("--json=")) out.json = a.slice(7);
    else if (a.startsWith("--html=")) out.html = a.slice(7);
  }
  return out;
}

const args = parseArgs(process.argv);
const sectionsToRun =
  args.section === "all" ? Object.keys(SECTIONS) : args.section.split(",").filter((s) => SECTIONS[s]);

if (!sectionsToRun.length) {
  console.error(`Nieznana sekcja: ${args.section}`);
  process.exit(2);
}

function filesForSection(section) {
  const filter = SECTIONS[section];
  return readdirSync(ROUTES_DIR)
    .filter(filter)
    .map((f) => join(ROUTES_DIR, f));
}

function extractTexts(src) {
  /** @type {{text:string;line:number}[]} */
  const out = [];
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const re = />([^<>{}]{4,})</g;
    let m;
    while ((m = re.exec(lines[i])) !== null) {
      const t = m[1].trim();
      if (t && !/^[\s\d\-–—:|•·/]+$/.test(t)) out.push({ text: t, line: i + 1 });
    }
  }
  const metaRe = /(title|description|content)\s*:\s*(["'`])([^"'`\n]{6,})\2/g;
  let mm;
  while ((mm = metaRe.exec(src)) !== null) {
    const before = src.slice(0, mm.index).split("\n").length;
    out.push({ text: mm[3].trim(), line: before });
  }
  return out;
}

const TRUNCATED_ELLIPSIS = /(\.{3}|…)/;
const FRAGMENT_ELLIPSIS = /\b[a-ząćęłńóśźż]{1,3}(\.{3}|…)/i;
const STRAIGHT_QUOTES = /"[^"\n]{2,}"/;
const STRAIGHT_APOS = /\b\w+'\w+/;
const POLISH_HINT_WORDS =
  /\b(mozliwosc|bezpieczen|skutecznos|pielegnacj|leczeni[ea]|swiat[ł]|sredni[oc]|cwicz|naskor|przebar|niedostat|jakosc|wlasn[ae]|bedzi[ae]|mozesz|ktor[ay]|wszystk[oi]|zadn[ae]|miesia?c|tydzie|polsk[ai]|rownie|rozni[ace]|wiecej|miekk|gladk|naturaln[ae]|estetyczn|kosmetolog|tlumacz)/i;
const POLISH_DIACRITICS = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

const RULES = [
  {
    id: "truncated-fragment",
    label: "Urwany fragment + elipsa",
    test: (t) => FRAGMENT_ELLIPSIS.test(t),
  },
  {
    id: "ellipsis",
    label: "Elipsa w treści",
    test: (t) => !FRAGMENT_ELLIPSIS.test(t) && TRUNCATED_ELLIPSIS.test(t),
  },
  { id: "straight-quotes", label: "Proste cudzysłowy zamiast „”", test: (t) => STRAIGHT_QUOTES.test(t) },
  { id: "straight-apostrophe", label: "Apostrof prosty (it's)", test: (t) => STRAIGHT_APOS.test(t) },
  {
    id: "missing-polish-diacritics",
    label: "Brak polskich znaków",
    test: (t) =>
      t.length > 30 &&
      POLISH_HINT_WORDS.test(t) &&
      !POLISH_DIACRITICS.test(t) &&
      !/^[A-Z0-9 .,\-–—&|]+$/.test(t),
  },
];

/** @type {{section:string;file:string;line:number;rule:string;label:string;text:string}[]} */
const findings = [];
const sectionStats = {};

for (const section of sectionsToRun) {
  const files = filesForSection(section);
  sectionStats[section] = { files: files.length, issues: 0 };
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    for (const { text, line } of extractTexts(src)) {
      for (const rule of RULES) {
        if (rule.test(text)) {
          findings.push({ section, file, line, rule: rule.id, label: rule.label, text });
          sectionStats[section].issues++;
        }
      }
    }
  }
}

// Konsola
console.log(`Walidacja treści — sekcje: ${sectionsToRun.join(", ")}`);
for (const [s, st] of Object.entries(sectionStats)) {
  const mark = st.issues === 0 ? "✓" : "✗";
  console.log(`  ${mark} ${s}: ${st.files} plików, ${st.issues} problem(ów)`);
}
if (findings.length) {
  console.log("");
  for (const f of findings) {
    const snip = f.text.length > 120 ? f.text.slice(0, 117) + "…" : f.text;
    console.log(`  [${f.section}] ${f.file}:${f.line}  ${f.rule}`);
    console.log(`    "${snip}"`);
  }
}

// Raport JSON
if (args.json) {
  mkdirSync(dirname(args.json), { recursive: true });
  writeFileSync(
    args.json,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sections: sectionsToRun,
        stats: sectionStats,
        findings,
      },
      null,
      2,
    ),
  );
  console.log(`\n→ JSON: ${args.json}`);
}

// Raport HTML
if (args.html) {
  mkdirSync(dirname(args.html), { recursive: true });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const rows = findings
    .map(
      (f) =>
        `<tr><td>${esc(f.section)}</td><td><code>${esc(relative(".", f.file))}:${f.line}</code></td>` +
        `<td><span class="r r-${esc(f.rule)}">${esc(f.label)}</span></td>` +
        `<td><code>${esc(f.text.length > 200 ? f.text.slice(0, 197) + "…" : f.text)}</code></td></tr>`,
    )
    .join("\n");
  const statsRows = Object.entries(sectionStats)
    .map(
      ([s, st]) =>
        `<tr><td>${esc(s)}</td><td>${st.files}</td><td class="${st.issues ? "bad" : "ok"}">${st.issues}</td></tr>`,
    )
    .join("\n");
  const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Raport jakości treści</title>
<style>
  body{font:14px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;margin:2rem auto;max-width:1100px;padding:0 1rem;color:#0f172a;background:#fafafa}
  h1{margin:0 0 .25rem}.muted{color:#64748b}
  table{width:100%;border-collapse:collapse;margin:1rem 0;background:#fff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}
  th,td{padding:.5rem .75rem;border-bottom:1px solid #e2e8f0;text-align:left;vertical-align:top}
  th{background:#f1f5f9;font-weight:600}
  code{font:12px/1.4 ui-monospace,Menlo,monospace}
  .ok{color:#15803d;font-weight:600}.bad{color:#b91c1c;font-weight:600}
  .r{display:inline-block;padding:.1rem .5rem;border-radius:999px;font-size:12px;background:#fee2e2;color:#991b1b}
  .r-ellipsis{background:#fef3c7;color:#92400e}
  .r-straight-quotes,.r-straight-apostrophe{background:#dbeafe;color:#1e40af}
  .r-missing-polish-diacritics{background:#ede9fe;color:#5b21b6}
  .empty{text-align:center;padding:2rem;color:#15803d;font-size:18px}
</style>
<h1>Raport jakości treści</h1>
<p class="muted">Wygenerowano: ${esc(new Date().toISOString())} · Sekcje: ${esc(sectionsToRun.join(", "))}</p>
<h2>Podsumowanie</h2>
<table><thead><tr><th>Sekcja</th><th>Plików</th><th>Problemów</th></tr></thead><tbody>${statsRows}</tbody></table>
<h2>Znalezione problemy (${findings.length})</h2>
${findings.length ? `<table><thead><tr><th>Sekcja</th><th>Plik</th><th>Reguła</th><th>Fragment</th></tr></thead><tbody>${rows}</tbody></table>` : `<div class="empty">✓ Brak problemów</div>`}
</html>`;
  writeFileSync(args.html, html);
  console.log(`→ HTML: ${args.html}`);
}

const hasIssues = findings.length > 0;
if (hasIssues && !args.warn) process.exit(1);
process.exit(0);
