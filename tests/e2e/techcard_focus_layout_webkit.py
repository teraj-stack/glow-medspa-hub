"""
WebKit version of techcard_focus_layout.py.

Re-runs the same focus / no-layout-shift assertions in a real WebKit (Safari
engine) browser, in both light and dark themes. Catches engine-specific
differences in :focus, outline rendering, and box model that Chromium would
hide.

Run:  python3 tests/e2e/techcard_focus_layout_webkit.py
"""
import asyncio
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080")
ROUTE = "/technologie"
OUT = Path("/tmp/browser/techcard-focus-webkit")
OUT.mkdir(parents=True, exist_ok=True)


async def measure(page, selector):
    return await page.evaluate(
        """(sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: r.x + window.scrollX, y: r.y + window.scrollY,
                     width: r.width, height: r.height };
        }""",
        selector,
    )


def approx_equal(a, b, tol=0.5):
    return all(abs(a[k] - b[k]) <= tol for k in ("x", "y", "width", "height"))


def text_inside_link(t, l):
    return (
        t["x"] >= l["x"] - 0.5
        and t["y"] >= l["y"] - 0.5
        and t["x"] + t["width"] <= l["x"] + l["width"] + 0.5
        and t["y"] + t["height"] <= l["y"] + l["height"] + 0.5
    )


async def run_theme(page, theme):
    failures = []
    await page.evaluate(
        "(t) => document.documentElement.classList.toggle('dark', t === 'dark')",
        theme,
    )

    link_sel = '[data-testid="tech-card-link"]'
    text_sel = f"{link_sel} h3"

    await page.evaluate("() => document.activeElement && document.activeElement.blur()")
    await page.wait_for_timeout(80)
    link_before = await measure(page, link_sel)
    text_before = await measure(page, text_sel)
    if not link_before or not text_before:
        failures.append(f"[webkit/{theme}] selector not found")
        return failures
    await page.screenshot(path=str(OUT / f"{theme}-before.png"))

    # Programmatic focus (deterministic across engines).
    await page.evaluate("(sel) => document.querySelector(sel).focus()", link_sel)
    await page.wait_for_timeout(80)
    link_focus = await measure(page, link_sel)
    text_focus = await measure(page, text_sel)
    await page.screenshot(path=str(OUT / f"{theme}-focus.png"))

    if not approx_equal(link_before, link_focus):
        failures.append(
            f"[webkit/{theme}] link rect shifted on focus: "
            f"before={link_before} after={link_focus}"
        )
    if not approx_equal(text_before, text_focus):
        failures.append(
            f"[webkit/{theme}] h3 rect shifted on focus: "
            f"before={text_before} after={text_focus}"
        )
    if not text_inside_link(text_focus, link_focus):
        failures.append(
            f"[webkit/{theme}] h3 overflows link after focus: "
            f"text={text_focus} link={link_focus}"
        )

    info = await page.evaluate(
        """(sel) => {
            const el = document.querySelector(sel);
            const cs = getComputedStyle(el);
            return { outlineWidth: cs.outlineWidth, outlineStyle: cs.outlineStyle,
                     outlineOffset: cs.outlineOffset,
                     offsetWidth: el.offsetWidth, offsetHeight: el.offsetHeight };
        }""",
        link_sel,
    )
    try:
        ow = float(info["outlineWidth"].replace("px", ""))
    except Exception:
        ow = 0
    try:
        oo = float(info["outlineOffset"].replace("px", ""))
    except Exception:
        oo = 0
    # WebKit may not paint focus-visible outline on programmatic .focus(); the
    # critical invariant is no layout shift, so we only warn on missing outline.
    if ow <= 0 or info["outlineStyle"] in ("none", ""):
        print(f"  note[webkit/{theme}]: no outline on programmatic focus ({info})")
    if oo <= 0:
        print(f"  note[webkit/{theme}]: outline-offset not positive ({info})")
    if (
        abs(info["offsetWidth"] - link_before["width"]) > 0.5
        or abs(info["offsetHeight"] - link_before["height"]) > 0.5
    ):
        failures.append(
            f"[webkit/{theme}] focused link offset size differs from baseline: "
            f"info={info} link_before={link_before}"
        )

    # Keyboard Tab path — proves :focus-visible doesn't shift either.
    await page.evaluate("() => document.activeElement && document.activeElement.blur()")
    await page.wait_for_timeout(50)
    for _ in range(40):
        await page.keyboard.press("Tab")
        if await page.evaluate(
            "(sel) => document.activeElement === document.querySelector(sel)",
            link_sel,
        ):
            break
    else:
        failures.append(f"[webkit/{theme}] could not Tab to TechCard link")
        return failures
    await page.wait_for_timeout(80)
    link_kbd = await measure(page, link_sel)
    text_kbd = await measure(page, text_sel)
    await page.screenshot(path=str(OUT / f"{theme}-kbd.png"))

    if not approx_equal(link_before, link_kbd):
        failures.append(
            f"[webkit/{theme}] link rect shifted on keyboard focus: "
            f"before={link_before} kbd={link_kbd}"
        )
    if not approx_equal(text_before, text_kbd):
        failures.append(
            f"[webkit/{theme}] h3 rect shifted on keyboard focus: "
            f"before={text_before} kbd={text_kbd}"
        )
    if not text_inside_link(text_kbd, link_kbd):
        failures.append(
            f"[webkit/{theme}] h3 overflows link on keyboard focus: "
            f"text={text_kbd} link={link_kbd}"
        )

    return failures


async def main():
    all_failures = []
    async with async_playwright() as pw:
        browser = await pw.webkit.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 1800},
            reduced_motion="reduce",
        )
        page = await context.new_page()

        url = f"{BASE_URL}{ROUTE}"
        resp = await page.goto(url, wait_until="domcontentloaded")
        if not resp or resp.status >= 400:
            print(f"FAIL: could not load {url} (status={resp.status if resp else 'n/a'})")
            sys.exit(1)

        await page.wait_for_selector('[data-testid="tech-card-link"]', timeout=15_000)
        await page.evaluate(
            "() => document.querySelector('[data-testid=\"tech-card-link\"]').scrollIntoView({block:'center'})"
        )
        await page.wait_for_timeout(200)

        for theme in ("light", "dark"):
            print(f"--- webkit / {theme} ---")
            failures = await run_theme(page, theme)
            if failures:
                for f in failures:
                    print("  FAIL:", f)
                all_failures.extend(failures)
            else:
                print("  OK")

        await browser.close()

    if all_failures:
        print(f"\n{len(all_failures)} WebKit assertion(s) failed.")
        sys.exit(1)
    print("\nAll TechCard focus layout assertions passed in WebKit (light + dark).")


if __name__ == "__main__":
    asyncio.run(main())
