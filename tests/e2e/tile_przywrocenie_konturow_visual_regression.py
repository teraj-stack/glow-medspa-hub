"""
Visual regression for tile "Przywrócenie konturów" (#przywrocenie-konturow)
on /rozwiazania, across mobile / tablet / desktop viewports.

Sprawdza odstępy i brak ucinania ikon w rzędzie top-icons:
- 5 ikon w jednym wierszu (flex-nowrap)
- żadna ikona nie wystaje poza prawą/lewą krawędź kafelka
- naturalWidth > 0 dla każdej ikony (CDN dociągnięty)

Plus pixel-diff vs baseline.

Env:
  E2E_BASE_URL         default https://glow-medspa-hub.lovable.app
  UPDATE_BASELINES=1   nadpisz baseline'y
  DIFF_TOLERANCE       default 0.5 (%)

Run:
  python3 tests/e2e/tile_przywrocenie_konturow_visual_regression.py
  UPDATE_BASELINES=1 python3 tests/e2e/tile_przywrocenie_konturow_visual_regression.py
"""
import asyncio
import os
import sys
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "https://glow-medspa-hub.lovable.app").rstrip("/")
ROUTE = os.environ.get("E2E_ROUTE", "/rozwiazania")
SELECTOR = "#przywrocenie-konturow"
TOLERANCE = float(os.environ.get("DIFF_TOLERANCE", "0.5"))
UPDATE = os.environ.get("UPDATE_BASELINES") == "1"

BASELINE_DIR = Path(__file__).parent / "__baselines__" / "tile-przywrocenie-konturow"
OUT_DIR = Path("/tmp/browser/tile-przywrocenie-konturow-visual")
BASELINE_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [
    ("mobile", 390, 1400),
    ("tablet", 834, 1600),
    ("desktop", 1440, 1800),
]

EXPECTED_ICONS = 5


async def assert_icons_layout(page, name):
    """Brak ucinania + jeden rząd + załadowane obrazy."""
    info = await page.evaluate(
        """sel => {
            const tile = document.querySelector(sel);
            if (!tile) return { ok: false, reason: 'no-tile' };
            const row = tile.querySelector('[aria-hidden="true"]');
            if (!row) return { ok: false, reason: 'no-row' };
            const tileRect = tile.getBoundingClientRect();
            const imgs = Array.from(row.querySelectorAll('img'));
            const items = imgs.map(img => {
                const r = img.getBoundingClientRect();
                return {
                    left: r.left, right: r.right, top: r.top, bottom: r.bottom,
                    w: r.width, h: r.height,
                    naturalWidth: img.naturalWidth,
                    complete: img.complete,
                };
            });
            return {
                ok: true,
                tile: { left: tileRect.left, right: tileRect.right, top: tileRect.top, width: tileRect.width },
                items,
            };
        }""",
        SELECTOR,
    )
    if not info.get("ok"):
        raise AssertionError(f"[{name}] layout probe failed: {info}")

    items = info["items"]
    if len(items) != EXPECTED_ICONS:
        raise AssertionError(f"[{name}] expected {EXPECTED_ICONS} ikon, got {len(items)}")

    tile = info["tile"]
    # 1 px tolerancja na subpiksele
    for i, it in enumerate(items):
        if it["naturalWidth"] <= 0 or not it["complete"]:
            raise AssertionError(f"[{name}] ikona {i} nie załadowana (naturalWidth={it['naturalWidth']})")
        if it["left"] < tile["left"] - 1:
            raise AssertionError(f"[{name}] ikona {i} ucięta z lewej (left={it['left']} < tile.left={tile['left']})")
        if it["right"] > tile["right"] + 1:
            raise AssertionError(f"[{name}] ikona {i} ucięta z prawej (right={it['right']} > tile.right={tile['right']})")
        if it["w"] < 20 or it["h"] < 20:
            raise AssertionError(f"[{name}] ikona {i} zbyt mała ({it['w']}x{it['h']})")

    # Jeden rząd: top wszystkich ikon w obrębie 2 px.
    tops = [it["top"] for it in items]
    if max(tops) - min(tops) > 2:
        raise AssertionError(f"[{name}] ikony nie w jednym rzędzie (tops={tops})")

    # Odstępy nieujemne i z grubsza równe (tolerancja 2 px).
    gaps = [items[i + 1]["left"] - items[i]["right"] for i in range(len(items) - 1)]
    if any(g < -1 for g in gaps):
        raise AssertionError(f"[{name}] ikony nachodzą na siebie (gaps={gaps})")
    if max(gaps) - min(gaps) > 2:
        raise AssertionError(f"[{name}] nierówne odstępy (gaps={gaps})")

    print(f"  [{name}] layout OK · ikon={len(items)} · gaps={[round(g, 1) for g in gaps]}")


async def capture(page, name, width, height):
    await page.set_viewport_size({"width": width, "height": height})
    resp = await page.goto(f"{BASE_URL}{ROUTE}", wait_until="domcontentloaded")
    if not resp or resp.status >= 400:
        raise RuntimeError(f"[{name}] HTTP {resp.status if resp else '?'} dla {BASE_URL}{ROUTE}")

    await page.add_style_tag(content="""
        *, *::before, *::after {
            animation: none !important;
            transition: none !important;
        }
    """)

    tile = page.locator(SELECTOR)
    await tile.wait_for(state="visible", timeout=15_000)
    await tile.scroll_into_view_if_needed()

    await page.wait_for_function(
        """sel => {
            const tile = document.querySelector(sel);
            if (!tile) return false;
            const imgs = tile.querySelectorAll('img');
            return imgs.length >= 6 && Array.from(imgs).every(i => i.complete && i.naturalWidth > 0);
        }""",
        arg=SELECTOR,
        timeout=15_000,
    )
    await page.wait_for_timeout(300)

    await assert_icons_layout(page, name)

    shot_path = OUT_DIR / f"{name}-actual.png"
    await tile.screenshot(path=str(shot_path))
    return shot_path


def compare(name, actual_path):
    baseline_path = BASELINE_DIR / f"{name}.png"

    if UPDATE or not baseline_path.exists():
        baseline_path.write_bytes(actual_path.read_bytes())
        action = "zaktualizowany" if UPDATE else "utworzony"
        print(f"  [{name}] baseline {action}: {baseline_path}")
        return True

    a = Image.open(baseline_path).convert("RGB")
    b = Image.open(actual_path).convert("RGB")

    if a.size != b.size:
        print(f"  FAIL [{name}] rozmiar: baseline={a.size} actual={b.size}")
        return False

    diff = ImageChops.difference(a, b)
    if diff.getbbox() is None:
        print(f"  OK [{name}] piksele identyczne ({a.size[0]}x{a.size[1]})")
        return True

    pixels = diff.getdata()
    total = a.size[0] * a.size[1]
    changed = sum(1 for px in pixels if max(px) > 8)
    pct = changed / total * 100

    diff_path = OUT_DIR / f"{name}-diff.png"
    diff.save(diff_path)

    if pct > TOLERANCE:
        print(f"  FAIL [{name}] różnica {pct:.3f}% > {TOLERANCE}% ({changed}/{total} px). Diff: {diff_path}")
        return False

    print(f"  OK [{name}] różnica {pct:.3f}% ≤ {TOLERANCE}%")
    return True


async def main():
    print(f"Base URL: {BASE_URL}{ROUTE}")
    print(f"Baselines: {BASELINE_DIR}")
    if UPDATE:
        print("Tryb: UPDATE_BASELINES")

    failures = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 1800},
            device_scale_factor=1,
            reduced_motion="reduce",
        )
        page = await context.new_page()

        for name, w, h in VIEWPORTS:
            print(f"--- {name} ({w}x{h}) ---")
            try:
                actual = await capture(page, name, w, h)
            except Exception as e:
                print(f"  FAIL [{name}] {e}")
                failures.append(name)
                continue
            if not compare(name, actual):
                failures.append(name)

        await browser.close()

    if failures:
        print(f"\n{len(failures)} viewport(ów) nie przeszło: {', '.join(failures)}")
        print(f"Podgląd różnic: {OUT_DIR}")
        print("Jeśli zmiana jest oczekiwana:")
        print("  UPDATE_BASELINES=1 npm run test:e2e:tile-przywrocenie-konturow-visual")
        sys.exit(1)

    print("\nWszystkie viewporty zgodne z baseline'ami.")


if __name__ == "__main__":
    asyncio.run(main())
