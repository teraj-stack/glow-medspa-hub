"""
Visual regression test for tile 02 ("Tekstura « HD »") on /rozwiązania.

Robi screenshot kafla `#tekstura-hd` na trzech viewportach (mobile, tablet,
desktop) i porównuje go z baseline'em zapisanym w
`tests/e2e/__baselines__/tile-02/<viewport>.png`.

Zmienne środowiskowe:
  E2E_BASE_URL        domyślnie https://glow-medspa-hub.lovable.app
                      (na CI ustaw na URL deploya, który chcesz zweryfikować)
  UPDATE_BASELINES=1  nadpisuje baseline'y zamiast porównywać
  DIFF_TOLERANCE      maks. % różniących się pikseli (default 0.5)

Uruchomienie:
  python3 tests/e2e/tile_02_visual_regression.py
  UPDATE_BASELINES=1 python3 tests/e2e/tile_02_visual_regression.py
"""
import asyncio
import os
import sys
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageChops
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "https://glow-medspa-hub.lovable.app").rstrip("/")
ROUTE = "/" + quote("rozwiązania")
SELECTOR = "#tekstura-hd"
TOLERANCE = float(os.environ.get("DIFF_TOLERANCE", "0.5"))  # percent
UPDATE = os.environ.get("UPDATE_BASELINES") == "1"

BASELINE_DIR = Path(__file__).parent / "__baselines__" / "tile-02"
OUT_DIR = Path("/tmp/browser/tile-02-visual")
BASELINE_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [
    ("mobile", 390, 1200),
    ("tablet", 834, 1400),
    ("desktop", 1440, 1600),
]


async def capture(page, name, width, height):
    await page.set_viewport_size({"width": width, "height": height})
    resp = await page.goto(f"{BASE_URL}{ROUTE}", wait_until="domcontentloaded")
    if not resp or resp.status >= 400:
        raise RuntimeError(f"[{name}] HTTP {resp.status if resp else '?'} dla {BASE_URL}{ROUTE}")

    # Wyłącz animacje, żeby screenshot był deterministyczny.
    await page.add_style_tag(content="""
        *, *::before, *::after {
            animation: none !important;
            transition: none !important;
        }
    """)

    tile = page.locator(SELECTOR)
    await tile.wait_for(state="visible", timeout=15_000)
    await tile.scroll_into_view_if_needed()

    # Poczekaj, aż ikona kafla dociągnie się z CDN.
    await page.wait_for_function(
        """sel => {
            const tile = document.querySelector(sel);
            if (!tile) return false;
            const imgs = tile.querySelectorAll('img');
            return Array.from(imgs).every(i => i.complete && i.naturalWidth > 0);
        }""",
        arg=SELECTOR,
        timeout=15_000,
    )
    await page.wait_for_timeout(300)

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
        print(f"  FAIL [{name}] rozmiar zmieniony: baseline={a.size} actual={b.size}")
        return False

    diff = ImageChops.difference(a, b)
    bbox = diff.getbbox()
    if bbox is None:
        print(f"  OK [{name}] piksele identyczne ({a.size[0]}x{a.size[1]})")
        return True

    # Zlicz piksele różniące się o > 8/255 na dowolnym kanale.
    pixels = diff.getdata()
    total = a.size[0] * a.size[1]
    changed = sum(1 for px in pixels if max(px) > 8)
    pct = changed / total * 100

    diff_path = OUT_DIR / f"{name}-diff.png"
    diff.save(diff_path)

    if pct > TOLERANCE:
        print(
            f"  FAIL [{name}] różnica {pct:.3f}% > tolerancja {TOLERANCE}% "
            f"({changed}/{total} px). Diff: {diff_path}"
        )
        return False

    print(f"  OK [{name}] różnica {pct:.3f}% ≤ {TOLERANCE}%")
    return True


async def main():
    print(f"Base URL: {BASE_URL}{ROUTE}")
    print(f"Baselines: {BASELINE_DIR}")
    if UPDATE:
        print("Tryb: UPDATE_BASELINES (nadpisuję baseline'y)")

    failures = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 1600},
            device_scale_factor=1,
            reduced_motion="reduce",
        )
        page = await context.new_page()

        for name, w, h in VIEWPORTS:
            print(f"--- {name} ({w}x{h}) ---")
            try:
                actual = await capture(page, name, w, h)
            except Exception as e:
                print(f"  FAIL [{name}] capture: {e}")
                failures.append(name)
                continue
            if not compare(name, actual):
                failures.append(name)

        await browser.close()

    if failures:
        print(f"\n{len(failures)} viewport(ów) nie przeszło: {', '.join(failures)}")
        print(f"Podgląd różnic: {OUT_DIR}")
        print("Jeśli zmiana jest oczekiwana, zaktualizuj baseline:")
        print("  UPDATE_BASELINES=1 npm run test:e2e:tile02-visual")
        sys.exit(1)

    print("\nWszystkie viewporty zgodne z baseline'ami.")


if __name__ == "__main__":
    asyncio.run(main())
