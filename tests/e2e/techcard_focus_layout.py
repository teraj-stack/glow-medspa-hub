"""
E2E a11y test for TechCard focus indicator.

Verifies in a real browser (Chromium via Playwright) that focusing a TechCard
on /technologie:
  1. Does NOT shift the page layout (boundingClientRect of the link AND of its
     inner <h3> are identical before vs. after focus, in both themes).
  2. The focus outline does NOT overlap the inner text — the text rect stays
     fully inside the link rect, and the painted outline sits outside the link
     box (CSS `outline` does not contribute to box dimensions, plus the
     component uses outline-offset, so the outline cannot touch the text).

Run:  python3 tests/e2e/techcard_focus_layout.py
Requires the dev server to be running (default http://localhost:8080).
"""
import asyncio
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080")
ROUTE = "/technologie"
OUT = Path("/tmp/browser/techcard-focus")
OUT.mkdir(parents=True, exist_ok=True)


async def measure(page, selector):
    """Return page-relative rect (immune to scroll) of selector as a dict."""
    return await page.evaluate(
        """(sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {
                x: r.x + window.scrollX,
                y: r.y + window.scrollY,
                width: r.width,
                height: r.height,
            };
        }""",
        selector,
    )


def approx_equal(a, b, tol=0.5):
    return all(abs(a[k] - b[k]) <= tol for k in ("x", "y", "width", "height"))


def text_inside_link(text_rect, link_rect):
    """Text rect must be fully contained in the link rect (≥ 0 padding)."""
    return (
        text_rect["x"] >= link_rect["x"]
        and text_rect["y"] >= link_rect["y"]
        and text_rect["x"] + text_rect["width"]
        <= link_rect["x"] + link_rect["width"] + 0.5
        and text_rect["y"] + text_rect["height"]
        <= link_rect["y"] + link_rect["height"] + 0.5
    )


async def run_theme(page, theme):
    """Run the focus assertions for one theme. Returns list of failures."""
    failures = []

    # Apply theme by toggling .dark on <html>.
    await page.evaluate(
        """(t) => {
            const root = document.documentElement;
            root.classList.toggle('dark', t === 'dark');
        }""",
        theme,
    )

    link_sel = '[data-testid="tech-card-link"]'
    text_sel = f"{link_sel} h3"

    # 1. Baseline measurements (no focus).
    await page.evaluate("() => document.activeElement && document.activeElement.blur()")
    await page.wait_for_timeout(50)
    link_before = await measure(page, link_sel)
    text_before = await measure(page, text_sel)
    if not link_before or not text_before:
        failures.append(f"[{theme}] selector not found")
        return failures

    await page.screenshot(path=str(OUT / f"{theme}-before-focus.png"))

    # 2. Focus the card via JS (deterministic; keyboard Tab path covered by
    #    the vitest suite).
    await page.evaluate(
        "(sel) => document.querySelector(sel).focus()", link_sel
    )
    await page.wait_for_timeout(50)
    link_after = await measure(page, link_sel)
    text_after = await measure(page, text_sel)

    await page.screenshot(path=str(OUT / f"{theme}-after-focus.png"))

    # ----- assertion: no layout shift on the link -----
    if not approx_equal(link_before, link_after):
        failures.append(
            f"[{theme}] link rect shifted on focus: "
            f"before={link_before} after={link_after}"
        )

    # ----- assertion: no layout shift on the inner text -----
    if not approx_equal(text_before, text_after):
        failures.append(
            f"[{theme}] h3 rect shifted on focus: "
            f"before={text_before} after={text_after}"
        )

    # ----- assertion: text remains fully inside the link box -----
    if not text_inside_link(text_after, link_after):
        failures.append(
            f"[{theme}] h3 overflows link after focus: "
            f"text={text_after} link={link_after}"
        )

    # ----- assertion: outline does NOT enlarge the layout box -----
    # CSS `outline` is painted outside the box and never affects layout.
    # We prove this by checking offsetWidth/offsetHeight stay identical and
    # by reading the resolved outline-width on :focus to confirm it's > 0.
    outline_info = await page.evaluate(
        """(sel) => {
            const el = document.querySelector(sel);
            const cs = getComputedStyle(el);
            return {
                outlineWidth: cs.outlineWidth,
                outlineStyle: cs.outlineStyle,
                outlineOffset: cs.outlineOffset,
                offsetWidth: el.offsetWidth,
                offsetHeight: el.offsetHeight,
            };
        }""",
        link_sel,
    )

    # outline-width must be > 0 (visible indicator)
    try:
        ow = float(outline_info["outlineWidth"].replace("px", ""))
    except Exception:
        ow = 0
    if ow <= 0 or outline_info["outlineStyle"] in ("none", ""):
        failures.append(
            f"[{theme}] no visible focus outline: {outline_info}"
        )

    # offset must be > 0 so the outline can never overlap content
    try:
        oo = float(outline_info["outlineOffset"].replace("px", ""))
    except Exception:
        oo = 0
    if oo <= 0:
        failures.append(
            f"[{theme}] outline-offset is not positive: {outline_info}"
        )

    # offsetWidth/Height matches the pre-focus link box → outline didn't grow
    # the layout box. (Already implied by link_before == link_after, but this
    # nails down the exact mechanism.)
    if (
        abs(outline_info["offsetWidth"] - link_before["width"]) > 0.5
        or abs(outline_info["offsetHeight"] - link_before["height"]) > 0.5
    ):
        failures.append(
            f"[{theme}] focused link offset size differs from pre-focus rect: "
            f"info={outline_info} link_before={link_before}"
        )

    return failures


async def main():
    all_failures = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 1800},
            # The component uses an entrance animation (.rise-in) and CSS
            # transitions on transform. Force prefers-reduced-motion so the
            # site disables those (handled in src/styles.css) and our
            # before/after rects compare a fully-settled layout.
            reduced_motion="reduce",
        )
        page = await context.new_page()

        url = f"{BASE_URL}{ROUTE}"
        resp = await page.goto(url, wait_until="domcontentloaded")
        if not resp or resp.status >= 400:
            print(f"FAIL: could not load {url} (status={resp.status if resp else 'n/a'})")
            sys.exit(1)

        # Wait for at least one TechCard to mount.
        await page.wait_for_selector('[data-testid="tech-card-link"]', timeout=10_000)
        await page.evaluate(
            "() => document.querySelector('[data-testid=\"tech-card-link\"]').scrollIntoView({block:'center'})"
        )
        await page.wait_for_timeout(150)

        for theme in ("light", "dark"):
            print(f"--- theme: {theme} ---")
            failures = await run_theme(page, theme)
            if failures:
                for f in failures:
                    print("  FAIL:", f)
                all_failures.extend(failures)
            else:
                print("  OK")

        await browser.close()

    if all_failures:
        print(f"\n{len(all_failures)} assertion(s) failed.")
        sys.exit(1)
    print("\nAll TechCard focus layout assertions passed in light + dark mode.")


if __name__ == "__main__":
    asyncio.run(main())
