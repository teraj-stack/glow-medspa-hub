#!/usr/bin/env python3
"""
Axe accessibility tests for the "Przywrócenie konturów" tile.

Sprawdza dla viewportów mobile / tablet / desktop:
  * brak naruszeń axe-core w obrębie kafelka (kontrast WCAG AA, ARIA, role),
  * obecność landmarków / semantyki (region/heading) i poprawne aria-* na ikonach,
  * nawigację klawiaturą — wszystkie interaktywne elementy w kafelku
    są osiągalne Tabem i mają widoczny focus.

Uruchomienie:
  npm run test:e2e:tile-przywrocenie-konturow-a11y
  E2E_BASE_URL=https://bmclinics.ai python3 tests/e2e/tile_przywrocenie_konturow_a11y.py
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright, Page

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080").rstrip("/")
TARGET_URL = f"{BASE_URL}/rozwiazania"
TILE_SELECTOR = "#przywrocenie-konturow"
AXE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js"

VIEWPORTS = [
    ("mobile", 390, 1400),
    ("tablet", 834, 1600),
    ("desktop", 1440, 1800),
]

OUT_DIR = Path("/tmp/browser/a11y-przywrocenie-konturow")
OUT_DIR.mkdir(parents=True, exist_ok=True)


async def inject_axe(page: Page) -> None:
    # Preferuj CDN; w razie braku sieci spróbuj lokalnego pakietu.
    try:
        await page.add_script_tag(url=AXE_CDN)
        return
    except Exception:
        pass
    local = Path("node_modules/axe-core/axe.min.js")
    if local.exists():
        await page.add_script_tag(path=str(local))
        return
    raise RuntimeError("Nie udało się załadować axe-core (CDN ani lokalnie).")


async def run_axe_on_tile(page: Page) -> dict:
    """Uruchom axe ograniczony do kafelka z regułami WCAG 2.1 AA."""
    return await page.evaluate(
        """async (selector) => {
            const node = document.querySelector(selector);
            if (!node) throw new Error('Tile not found: ' + selector);
            const result = await window.axe.run(node, {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
                },
                resultTypes: ['violations']
            });
            return {
                violations: result.violations.map(v => ({
                    id: v.id,
                    impact: v.impact,
                    help: v.help,
                    helpUrl: v.helpUrl,
                    nodes: v.nodes.slice(0, 3).map(n => ({
                        target: n.target,
                        failureSummary: n.failureSummary,
                    }))
                }))
            };
        }""",
        TILE_SELECTOR,
    )


async def assert_aria_semantics(page: Page) -> list[str]:
    """Lekkie asercje strukturalne wokół kafelka."""
    issues: list[str] = []
    info = await page.evaluate(
        """(selector) => {
            const tile = document.querySelector(selector);
            if (!tile) return { exists: false };
            const headings = Array.from(tile.querySelectorAll('h1,h2,h3,h4,h5,h6'))
                .map(h => ({ tag: h.tagName, text: (h.textContent || '').trim() }));
            const imgs = Array.from(tile.querySelectorAll('img')).map(img => ({
                alt: img.getAttribute('alt'),
                ariaHidden: img.getAttribute('aria-hidden'),
                role: img.getAttribute('role'),
                src: img.currentSrc || img.src,
            }));
            const interactive = Array.from(tile.querySelectorAll(
                'a, button, [role="button"], input, select, textarea, [tabindex]'
            )).map(el => ({
                tag: el.tagName,
                role: el.getAttribute('role'),
                name: (el.getAttribute('aria-label')
                    || el.getAttribute('aria-labelledby')
                    || (el.textContent || '').trim()).slice(0, 80),
                tabIndex: el.tabIndex,
                hasHref: el.tagName === 'A' ? !!el.getAttribute('href') : null,
            }));
            return { exists: true, headings, imgs, interactive };
        }""",
        TILE_SELECTOR,
    )

    if not info.get("exists"):
        issues.append("Kafel #przywrocenie-konturow nie istnieje w DOM")
        return issues

    if not info["headings"]:
        issues.append("Brak nagłówka (h1-h6) w kafelku")

    for i, img in enumerate(info["imgs"]):
        alt = img.get("alt")
        aria_hidden = img.get("ariaHidden")
        # img musi mieć alt (puste alt="" dla dekoracji jest OK) lub być aria-hidden
        if alt is None and aria_hidden != "true":
            issues.append(f"Obraz #{i} bez atrybutu alt i bez aria-hidden (src={img.get('src')})")

    for i, el in enumerate(info["interactive"]):
        if not el["name"]:
            issues.append(
                f"Interaktywny element #{i} ({el['tag']}) bez dostępnej nazwy"
            )
        if el["tabIndex"] is not None and el["tabIndex"] > 0:
            issues.append(
                f"Interaktywny element #{i} ({el['tag']}) ma tabindex={el['tabIndex']} (> 0)"
            )
        if el["tag"] == "A" and el["hasHref"] is False:
            issues.append(f"Element <a> #{i} bez href — nieosiągalny klawiaturą")

    return issues


async def assert_keyboard_navigation(page: Page) -> list[str]:
    """Tab po wszystkich interaktywnych elementach kafelka; sprawdź focus-visible."""
    issues: list[str] = []

    # Lista interaktywnych elementów w kafelku
    targets = await page.evaluate(
        """(selector) => {
            const tile = document.querySelector(selector);
            if (!tile) return [];
            return Array.from(tile.querySelectorAll(
                'a[href], button:not([disabled]), [role="button"]:not([aria-disabled="true"]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )).map((el, i) => {
                el.setAttribute('data-a11y-idx', String(i));
                return {
                    idx: i,
                    tag: el.tagName,
                    name: (el.getAttribute('aria-label') || (el.textContent || '').trim()).slice(0, 60)
                };
            });
        }""",
        TILE_SELECTOR,
    )

    if not targets:
        # Brak elementów interaktywnych jest OK — kafel może być czysto prezentacyjny.
        return issues

    # Ustaw focus na początku dokumentu i Tabuj aż osiągniemy każdy element.
    await page.evaluate("() => document.body.focus()")

    reached: set[int] = set()
    # Maksymalnie 80 tabów — zapas na elementy poprzedzające kafel.
    for _ in range(80):
        await page.keyboard.press("Tab")
        idx = await page.evaluate(
            """() => {
                const el = document.activeElement;
                if (!el) return null;
                const v = el.getAttribute && el.getAttribute('data-a11y-idx');
                return v === null ? null : Number(v);
            }"""
        )
        if idx is not None:
            reached.add(idx)

            # Sprawdź widoczny wskaźnik focusu (outline/box-shadow/ring).
            visible = await page.evaluate(
                """() => {
                    const el = document.activeElement;
                    if (!el) return false;
                    const cs = getComputedStyle(el);
                    const outlineOk = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
                    const shadowOk = cs.boxShadow && cs.boxShadow !== 'none';
                    return outlineOk || shadowOk;
                }"""
            )
            if not visible:
                target = next((t for t in targets if t["idx"] == idx), None)
                name = target["name"] if target else f"idx={idx}"
                issues.append(f"Brak widocznego focusu na: {name}")

        if len(reached) == len(targets):
            break

    missing = [t for t in targets if t["idx"] not in reached]
    for t in missing:
        issues.append(f"Element nieosiągalny Tabem: <{t['tag']}> {t['name']}")

    return issues


async def run_for_viewport(name: str, width: int, height: int) -> dict:
    print(f"\n--- {name} ({width}x{height}) ---", flush=True)
    result = {"viewport": name, "violations": [], "issues": [], "passed": True}

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": width, "height": height})
        page = await context.new_page()
        try:
            await page.goto(TARGET_URL, wait_until="domcontentloaded", timeout=45000)
            # Czekaj na pojawienie się kafelka.
            await page.wait_for_selector(TILE_SELECTOR, timeout=20000)
            await page.locator(TILE_SELECTOR).scroll_into_view_if_needed()
            await page.wait_for_timeout(400)

            await inject_axe(page)
            axe = await run_axe_on_tile(page)
            result["violations"] = axe["violations"]

            sem = await assert_aria_semantics(page)
            kb = await assert_keyboard_navigation(page)
            result["issues"] = sem + kb

            await page.locator(TILE_SELECTOR).screenshot(
                path=str(OUT_DIR / f"{name}.png")
            )

            if axe["violations"]:
                result["passed"] = False
                for v in axe["violations"]:
                    print(f"  axe[{v['impact']}] {v['id']}: {v['help']}", flush=True)
                    for n in v["nodes"]:
                        print(f"    → {n['target']}", flush=True)
            if result["issues"]:
                result["passed"] = False
                for msg in result["issues"]:
                    print(f"  issue: {msg}", flush=True)
            if result["passed"]:
                print("  OK — brak naruszeń axe / ARIA / klawiatura", flush=True)
        finally:
            await browser.close()
    return result


async def main() -> int:
    print(f"Base URL: {TARGET_URL}", flush=True)
    results = []
    for name, w, h in VIEWPORTS:
        results.append(await run_for_viewport(name, w, h))

    (OUT_DIR / "report.json").write_text(json.dumps(results, indent=2, ensure_ascii=False))
    failed = [r for r in results if not r["passed"]]
    print(f"\nZapisano raport: {OUT_DIR / 'report.json'}", flush=True)
    if failed:
        print(f"FAIL — {len(failed)}/{len(results)} viewportów z naruszeniami", flush=True)
        return 1
    print(f"PASS — {len(results)}/{len(results)} viewportów bez naruszeń", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
