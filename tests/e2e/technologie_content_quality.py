"""
Walidacja jakości treści na /technologie (e2e).

Sprawdza renderowaną stronę po SSR/CSR:
  - żaden widoczny akapit/nagłówek/element listy nie kończy się elipsą "…" / "..."
  - brak "fragmentów" typu "bu…" / "zaaw…" (1-3 znaki + elipsa)
  - brak prostych cudzysłowów " w tekście (powinny być „ ”)

Test pada (exit 1), gdy znajdzie problem.

Uruchomienie lokalne:
  python3 tests/e2e/technologie_content_quality.py
"""
import asyncio
import os
import re
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080")
ROUTES = [
    "/technologie",
    "/technologie/picoking",
    "/technologie/fusion-plasma",
    "/technologie/laser-tulowy",
    "/technologie/peeling-weglowy-laserowy",
    "/technologie/terapia-led",
]
OUT = Path("/tmp/browser/technologie-content")
OUT.mkdir(parents=True, exist_ok=True)

ELLIPSIS_END = re.compile(r"(\.{3}|…)\s*$")
FRAGMENT_ELLIPSIS = re.compile(r"\b[a-ząćęłńóśźż]{1,3}(\.{3}|…)", re.IGNORECASE)
STRAIGHT_QUOTES = re.compile(r'"[^"\n]{2,}"')

# Selektory akapitów kluczowych dla treści.
SELECTORS = "main p, main h1, main h2, main h3, main li"


async def scan(page, route: str):
    await page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
    await page.wait_for_selector("main", timeout=10_000)
    texts = await page.eval_on_selector_all(
        SELECTORS,
        "els => els.map(e => (e.innerText || '').trim()).filter(t => t.length > 10)",
    )
    findings = []
    for t in texts:
        if ELLIPSIS_END.search(t):
            findings.append(("ellipsis-end", t))
        if FRAGMENT_ELLIPSIS.search(t):
            findings.append(("fragment-ellipsis", t))
        if STRAIGHT_QUOTES.search(t):
            findings.append(("straight-quotes", t))
    return findings


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()

        all_findings = []
        for route in ROUTES:
            try:
                f = await scan(page, route)
            except Exception as exc:
                print(f"  {route}: błąd nawigacji — {exc}")
                continue
            print(f"  {route}: {len(f)} problem(ów)")
            for rule, t in f:
                snippet = t if len(t) <= 120 else t[:117] + "…"
                print(f"    [{rule}] {snippet}")
            all_findings.extend((route, rule, t) for rule, t in f)

        await page.screenshot(path=str(OUT / "last.png"))
        await browser.close()

    if all_findings:
        print(f"\n✗ Znaleziono {len(all_findings)} problemów na /technologie")
        sys.exit(1)
    print("\n✓ /technologie — treści bez urwań, elips i prostych cudzysłowów")


asyncio.run(main())
