"""
Pixel-diff test: screenshot the TechCard before and after focus, then compare
the *text region* pixel-by-pixel to prove the focus outline does not bleed
into the text.

Approach:
  1. Screenshot just the link element (page.locator.screenshot) — twice:
     once unfocused, once focused.
  2. Compute the inner h3 rect relative to the link rect.
  3. Inset that rect by `OUTLINE_SAFE_MARGIN` px (must be ≥ outline-offset +
     outline-width to be safe), crop the same window from both screenshots,
     and require an exact pixel match.

If the outline ever overlaps the text, those pixels would differ between
before/focus screenshots and the test fails.

Run:  python3 tests/e2e/techcard_focus_pixel_diff.py
"""
import asyncio
import io
import os
import sys
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080")
ROUTE = "/technologie"
OUT = Path("/tmp/browser/techcard-pixel-diff")
OUT.mkdir(parents=True, exist_ok=True)

# Must be < outline-offset (8px) so we don't accidentally crop INTO where the
# outline would paint. 4px is well inside the safe zone between text and
# outline-offset; if the outline ever reached this band, the test fails.
TEXT_INSET = 4


async def shot(page, link, name):
    img_bytes = await link.screenshot()
    path = OUT / name
    path.write_bytes(img_bytes)
    return Image.open(io.BytesIO(img_bytes)).convert("RGB")


async def run_theme(page, theme):
    failures = []
    await page.evaluate(
        "(t) => document.documentElement.classList.toggle('dark', t === 'dark')",
        theme,
    )

    link = page.locator('[data-testid="tech-card-link"]').first
    await link.scroll_into_view_if_needed()
    await page.wait_for_timeout(150)

    await page.evaluate("() => document.activeElement && document.activeElement.blur()")
    await page.wait_for_timeout(80)
    img_before = await shot(page, link, f"{theme}-before.png")

    # Inner text region, in link-relative coordinates.
    rel = await page.evaluate(
        """(sel) => {
            const a = document.querySelector(sel);
            const h = a.querySelector('h3');
            const ar = a.getBoundingClientRect();
            const hr = h.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            return {
                x: Math.round((hr.x - ar.x) * dpr),
                y: Math.round((hr.y - ar.y) * dpr),
                w: Math.round(hr.width * dpr),
                h: Math.round(hr.height * dpr),
                dpr,
                aw: Math.round(ar.width * dpr),
                ah: Math.round(ar.height * dpr),
            };
        }""",
        '[data-testid="tech-card-link"]',
    )

    await page.evaluate(
        "(sel) => document.querySelector(sel).focus()",
        '[data-testid="tech-card-link"]',
    )
    await page.wait_for_timeout(80)
    img_focus = await shot(page, link, f"{theme}-focus.png")

    if img_before.size != img_focus.size:
        failures.append(
            f"[{theme}] link screenshot size changed on focus: "
            f"before={img_before.size} focus={img_focus.size}"
        )
        return failures

    inset = TEXT_INSET * int(rel["dpr"])
    x1 = max(0, rel["x"] + inset)
    y1 = max(0, rel["y"] + inset)
    x2 = min(img_before.size[0], rel["x"] + rel["w"] - inset)
    y2 = min(img_before.size[1], rel["y"] + rel["h"] - inset)
    if x2 <= x1 or y2 <= y1:
        failures.append(f"[{theme}] degenerate text crop rect: ({x1},{y1})-({x2},{y2})")
        return failures

    crop_before = img_before.crop((x1, y1, x2, y2))
    crop_focus = img_focus.crop((x1, y1, x2, y2))
    crop_before.save(OUT / f"{theme}-text-before.png")
    crop_focus.save(OUT / f"{theme}-text-focus.png")

    diff = ImageChops.difference(crop_before, crop_focus)
    bbox = diff.getbbox()
    if bbox is not None:
        # Save the diff for inspection.
        diff.save(OUT / f"{theme}-text-diff.png")
        # Quantify: how many pixels actually differ, and by how much.
        stats = diff.getextrema()
        max_per_channel = [hi for (_lo, hi) in stats]
        failures.append(
            f"[{theme}] text region pixels changed on focus "
            f"(bbox={bbox}, max channel delta={max_per_channel}). "
            f"Outline likely overlaps text. See {OUT}/{theme}-text-diff.png"
        )

    return failures


async def main():
    all_failures = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 1800},
            reduced_motion="reduce",
        )
        page = await context.new_page()

        url = f"{BASE_URL}{ROUTE}"
        resp = await page.goto(url, wait_until="domcontentloaded")
        if not resp or resp.status >= 400:
            print(f"FAIL: could not load {url}")
            sys.exit(1)
        await page.wait_for_selector('[data-testid="tech-card-link"]', timeout=10_000)

        for theme in ("light", "dark"):
            print(f"--- pixel-diff / {theme} ---")
            failures = await run_theme(page, theme)
            if failures:
                for f in failures:
                    print("  FAIL:", f)
                all_failures.extend(failures)
            else:
                print("  OK (text pixels identical before/after focus)")

        await browser.close()

    if all_failures:
        print(f"\n{len(all_failures)} pixel-diff assertion(s) failed.")
        sys.exit(1)
    print("\nTechCard text region pixel-identical before/after focus in both themes.")


if __name__ == "__main__":
    asyncio.run(main())
