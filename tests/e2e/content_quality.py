"""
E2E walidacja jakości treści dla /technologie, /blog/* i FAQ.

Sprawdza renderowane treści:
  - urwane zakończenia (elipsa)
  - fragmenty typu "bu…" / "zaaw…"
  - proste cudzysłowy " zamiast „”

Uruchomienie:
  python3 tests/e2e/content_quality.py
  REPORT_JSON=/tmp/content.json python3 tests/e2e/content_quality.py
"""
import asyncio
import json
import os
import re
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080")
REPORT_JSON = os.environ.get("REPORT_JSON")

ROUTES = {
    "technologie": [
        "/technologie",
        "/technologie/picoking",
        "/technologie/fusion-plasma",
        "/technologie/laser-tulowy",
        "/technologie/peeling-weglowy-laserowy",
        "/technologie/terapia-led",
    ],
    "blog": [
        "/blog/blizny-potradzikowe",
        "/blog/laser-frakcyjny-rekonwalescencja",
        "/blog/powiklania-mezoterapia-iglowa",
        "/blog/slonce-skora-nowoczesne-technologie",
    ],
    "faq": [
        "/bezpieczenstwo-zabiegow-laserowych",
    ],
}

OUT = Path("/tmp/browser/content-quality")
OUT.mkdir(parents=True, exist_ok=True)

ELLIPSIS_END = re.compile(r"(\.{3}|…)\s*$")
FRAGMENT_ELLIPSIS = re.compile(r"\b[a-ząćęłńóśźż]{1,3}(\.{3}|…)", re.IGNORECASE)
STRAIGHT_QUOTES = re.compile(r'"[^"\n]{2,}"')

SELECTORS = "main p, main h1, main h2, main h3, main h4, main li, main dd, main blockquote"


async def scan(page, route):
    await page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
    await page.wait_for_selector("main", timeout=10_000)
    texts = await page.eval_on_selector_all(
        SELECTORS,
        "els => els.map(e => (e.innerText || '').trim()).filter(t => t.length > 10)",
    )
    findings = []
    for t in texts:
        if FRAGMENT_ELLIPSIS.search(t):
            findings.append(("fragment-ellipsis", t))
        elif ELLIPSIS_END.search(t):
            findings.append(("ellipsis-end", t))
        if STRAIGHT_QUOTES.search(t):
            findings.append(("straight-quotes", t))
    return findings


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()

        all_findings = []
        for section, routes in ROUTES.items():
            print(f"\n[{section}]")
            for route in routes:
                try:
                    f = await scan(page, route)
                except Exception as exc:
                    print(f"  {route}: BŁĄD nawigacji — {exc}")
                    continue
                print(f"  {route}: {len(f)} problem(ów)")
                for rule, t in f:
                    snip = t if len(t) <= 120 else t[:117] + "…"
                    print(f"    [{rule}] {snip}")
                all_findings.extend(
                    {"section": section, "route": route, "rule": rule, "text": t}
                    for rule, t in f
                )
        await page.screenshot(path=str(OUT / "last.png"))
        await browser.close()

    if REPORT_JSON:
        Path(REPORT_JSON).parent.mkdir(parents=True, exist_ok=True)
        Path(REPORT_JSON).write_text(
            json.dumps({"findings": all_findings, "total": len(all_findings)}, ensure_ascii=False, indent=2)
        )
        print(f"\n→ JSON: {REPORT_JSON}")

    if all_findings:
        print(f"\n✗ Łącznie problemów: {len(all_findings)}")
        sys.exit(1)
    print("\n✓ Wszystkie sekcje czyste")


asyncio.run(main())
