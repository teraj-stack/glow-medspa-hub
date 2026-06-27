"""
Visual regression dla sekcji „Mapowanie procesu starzenia się" (figure
#mapowanie-procesu-starzenia) w artykule /blog/mechanizmy-starzenia-skory,
na viewportach mobile / tablet / desktop.

Asercje:
- figure istnieje i jest widoczna
- <img> w środku załadowany (complete + naturalWidth > 0)
- proporcje renderu ≈ proporcje natywne (tolerancja 1%)
- brak overflow horyzontalnego na całej stronie (scrollWidth ≤ viewport)
- pixel-diff vs baseline (tolerancja DIFF_TOLERANCE %)

Env:
  E2E_BASE_URL         default https://glow-medspa-hub.lovable.app
  UPDATE_BASELINES=1   nadpisz baseline'y
  DIFF_TOLERANCE       default 0.5 (%)

Run:
  python3 tests/e2e/mapowanie_procesu_starzenia_visual_regression.py
  UPDATE_BASELINES=1 python3 tests/e2e/mapowanie_procesu_starzenia_visual_regression.py
"""
import asyncio
import os
import sys
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "https://glow-medspa-hub.lovable.app").rstrip("/")
ROUTE = os.environ.get("E2E_ROUTE", "/blog/mechanizmy-starzenia-skory")
SELECTOR = "#mapowanie-procesu-starzenia"
TOLERANCE = float(os.environ.get("DIFF_TOLERANCE", "0.5"))
UPDATE = os.environ.get("UPDATE_BASELINES") == "1"

BASELINE_DIR = Path(__file__).parent / "__baselines__" / "mapowanie-procesu-starzenia"
OUT_DIR = Path("/tmp/browser/mapowanie-procesu-starzenia-visual")
BASELINE_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [
    ("mobile", 390, 1600),
    ("tablet", 834, 1800),
    ("desktop", 1440, 1800),
]


async def assert_figure(page, name, viewport_width):
    info = await page.evaluate(
        """sel => {
            const fig = document.querySelector(sel);
            if (!fig) return { ok: false, reason: 'no-figure' };
            const img = fig.querySelector('img');
            if (!img) return { ok: false, reason: 'no-img' };
            const r = img.getBoundingClientRect();
            return {
                ok: true,
                figure: { width: fig.getBoundingClientRect().width },
                img: {
                    width: r.width, height: r.height,
                    naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight,
                    complete: img.complete,
                    alt: img.alt,
                },
                docScrollWidth: document.documentElement.scrollWidth,
            };
        }""",
        SELECTOR,
    )
    if not info.get("ok"):
        raise AssertionError(f"[{name}] probe failed: {info}")

    img = info["img"]
    if not img["complete"] or img["naturalWidth"] <= 0:
        raise AssertionError(f"[{name}] obraz nie załadowany (naturalWidth={img['naturalWidth']})")
    if not img["alt"] or len(img["alt"]) < 10:
        raise AssertionError(f"[{name}] brak/za krótki alt: {img['alt']!r}")

    natural_ratio = img["naturalWidth"] / img["naturalHeight"]
    render_ratio = img["width"] / img["height"]
    if abs(render_ratio - natural_ratio) / natural_ratio > 0.01:
        raise AssertionError(
            f"[{name}] proporcje rozjechane: render={render_ratio:.3f} vs natural={natural_ratio:.3f}"
        )

    if info["docScrollWidth"] > viewport_width + 1:
        raise AssertionError(
            f"[{name}] horyzontalny overflow: scrollWidth={info['docScrollWidth']} > viewport={viewport_width}"
        )

    print(
        f"  [{name}] OK · render={img['width']:.0f}x{img['height']:.0f} · ratio={render_ratio:.3f}"
    )


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

    fig = page.locator(SELECTOR)
    await fig.wait_for(state="visible", timeout=15_000)
    await fig.scroll_into_view_if_needed()

    await page.wait_for_function(
        """sel => {
            const fig = document.querySelector(sel);
            if (!fig) return false;
            const img = fig.querySelector('img');
            return !!img && img.complete && img.naturalWidth > 0;
        }""",
        arg=SELECTOR,
        timeout=15_000,
    )
    await page.wait_for_timeout(300)

    await assert_figure(page, name, width)

    shot_path = OUT_DIR / f"{name}-actual.png"
    await fig.screenshot(path=str(shot_path))
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
        print("  UPDATE_BASELINES=1 npm run test:e2e:mapowanie-starzenia-visual")
        sys.exit(1)

    print("\nWszystkie viewporty zgodne z baseline'ami.")


if __name__ == "__main__":
    asyncio.run(main())
