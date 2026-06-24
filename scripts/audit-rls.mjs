#!/usr/bin/env node
// Stały audyt RLS — wykrywa tabele bez RLS, brakujące polityki oraz
// zbyt permisywne polityki INSERT/UPDATE/DELETE. Uruchamiany w CI.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const { Client } = pg;

const DB_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
const REPORT_DIR = process.env.REPORT_DIR || "reports";
const ALLOWLIST_PATH =
  process.env.RLS_AUDIT_ALLOWLIST || "docs/rls-audit-allowlist.json";
const WARN_MODE = process.argv.includes("--warn");

if (!DB_URL) {
  console.error(
    "❌ Missing SUPABASE_DB_URL or DATABASE_URL environment variable."
  );
  process.exit(2);
}

const allowlist = loadAllowlist(ALLOWLIST_PATH);

const client = new Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();

  const tables = await client.query(`
    SELECT c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
    ORDER BY c.relname;
  `);

  const noRls = await client.query(`
    SELECT c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND NOT c.relrowsecurity
    ORDER BY c.relname;
  `);

  const policies = await client.query(`
    SELECT
      schemaname,
      tablename,
      policyname,
      permissive,
      roles,
      cmd,
      qual::text AS qual,
      with_check::text AS with_check
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, cmd, policyname;
  `);

  await client.end();

  const tableNames = tables.rows.map((r) => r.table_name);
  const noRlsSet = new Set(noRls.rows.map((r) => r.table_name));
  const findings = [];

  for (const t of noRls.rows) {
    findings.push({
      type: "rls_disabled",
      severity: "critical",
      table: t.table_name,
      operation: "ALL",
      message: `RLS nie jest włączony na tabeli public.${t.table_name}.`,
      remediation: `ALTER TABLE public.${t.table_name} ENABLE ROW LEVEL SECURITY;`,
    });
  }

  const policyMap = {};
  for (const t of tableNames) {
    policyMap[t] = { SELECT: false, INSERT: false, UPDATE: false, DELETE: false };
  }

  for (const p of policies.rows) {
    if (!policyMap[p.tablename]) continue;
    if (p.cmd === "*") {
      for (const op of ["SELECT", "INSERT", "UPDATE", "DELETE"]) {
        policyMap[p.tablename][op] = true;
      }
    } else if (p.cmd) {
      policyMap[p.tablename][p.cmd] = true;
    }
  }

  for (const t of tableNames) {
    if (noRlsSet.has(t)) continue;
    for (const op of ["SELECT", "INSERT", "UPDATE", "DELETE"]) {
      if (policyMap[t][op]) continue;
      const key = `${t}.${op}`;
      if (allowlist[key]) continue;
      findings.push({
        type: "missing_policy",
        severity: "high",
        table: t,
        operation: op,
        message: `Brak polityki RLS dla ${op} na tabeli public.${t}.`,
        remediation: `Dodaj politykę ${op} dla public.${t} lub dodaj "${key}" do allowlisty, jeśli brak jest celowy.`,
      });
    }
  }

  for (const p of policies.rows) {
    if (p.cmd === "SELECT") continue;
    if (isAlwaysTrue(p.qual) || isAlwaysTrue(p.with_check)) {
      findings.push({
        type: "permissive_policy",
        severity: "high",
        table: p.tablename,
        operation: p.cmd,
        policy: p.policyname,
        message: `Polityka ${p.policyname} na public.${p.tablename} dla ${p.cmd} używa wyrażenia zawsze prawdziwego.`,
        remediation: "Zwęź politykę do konkretnych ról lub własności rekordu.",
      });
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    tables_scanned: tableNames.length,
    findings_count: findings.length,
    findings,
    tables_without_rls: Array.from(noRlsSet),
    policy_summary: policyMap,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const jsonPath = path.join(REPORT_DIR, "rls-audit.json");
  const htmlPath = path.join(REPORT_DIR, "rls-audit.html");

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(htmlPath, generateHtml(report));

  console.log(`\n📊 Przeskanowano tabel: ${tableNames.length}`);
  console.log(`🔴 Findingi: ${findings.length}`);
  console.log(`📝 JSON: ${jsonPath}`);
  console.log(`🌐 HTML: ${htmlPath}`);

  if (findings.length > 0) {
    const bySeverity = { critical: 0, high: 0 };
    for (const f of findings) {
      bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
    }
    console.log(`   critical: ${bySeverity.critical || 0}, high: ${bySeverity.high || 0}`);

    if (!WARN_MODE) {
      console.log("\n❌ Audyt RLS nie przeszedł. Szczegóły w raportach.");
      process.exit(1);
    }
    console.log("\n⚠️  Tryb --warn: audyt zgłasza problemy, ale nie failuje joba.");
  } else {
    console.log("\n✅ Audyt RLS przeszedł bez zarzutu.");
  }
}

function loadAllowlist(allowlistPath) {
  if (!fs.existsSync(allowlistPath)) return {};
  try {
    const raw = fs.readFileSync(allowlistPath, "utf8");
    const data = JSON.parse(raw);
    return Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v === true)
    );
  } catch (err) {
    console.error(`⚠️  Could not parse allowlist ${allowlistPath}:`, err.message);
    return {};
  }
}

function isAlwaysTrue(expr) {
  if (!expr) return false;
  const normalized = expr.replace(/\s+/g, " ").trim().toLowerCase();
  return (
    normalized === "true" ||
    normalized === "(true)" ||
    normalized === "true::boolean" ||
    normalized === "b'1'" ||
    normalized === "true::bool"
  );
}

function generateHtml(report) {
  const rows = report.findings
    .map(
      (f, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><span class="badge ${f.severity}">${f.severity}</span></td>
        <td>${f.type}</td>
        <td><code>${f.table}</code></td>
        <td>${f.operation || "-"}</td>
        <td>${escapeHtml(f.message)}</td>
        <td>${escapeHtml(f.remediation)}</td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RLS Audit Report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; background: #0f172a; color: #e2e8f0; }
    h1 { color: #f8fafc; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.9rem; }
    th, td { padding: 0.75rem; border: 1px solid #334155; text-align: left; vertical-align: top; }
    th { background: #1e293b; color: #94a3b8; }
    tr:nth-child(even) { background: #162032; }
    code { background: #1e293b; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.85rem; }
    .badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 999px; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; }
    .badge.critical { background: #7f1d1d; color: #fecaca; }
    .badge.high { background: #7c2d12; color: #fed7aa; }
    .summary { display: flex; gap: 1rem; margin: 1rem 0; }
    .summary > div { background: #1e293b; padding: 1rem; border-radius: 0.5rem; min-width: 8rem; }
    .summary .num { font-size: 1.5rem; font-weight: 700; }
  </style>
</head>
<body>
  <h1>RLS Audit Report</h1>
  <p>Wygenerowano: ${new Date(report.generated_at).toLocaleString("pl-PL")}</p>
  <div class="summary">
    <div><div class="num">${report.tables_scanned}</div><div>Tabel</div></div>
    <div><div class="num">${report.findings_count}</div><div>Findingów</div></div>
    <div><div class="num">${report.tables_without_rls.length}</div><div>Bez RLS</div></div>
  </div>
  ${report.findings_count > 0 ? `
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Priorytet</th>
        <th>Typ</th>
        <th>Tabela</th>
        <th>Operacja</th>
        <th>Opis</th>
        <th>Rekomendacja</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  ` : "<p>✅ Brak findingów — wszystkie tabele spełniają obecne reguły audytu.</p>"}
</body>
</html>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
