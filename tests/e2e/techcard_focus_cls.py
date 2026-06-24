"""
Hard CLS metric for TechCard focus transitions.

Uses PerformanceObserver('layout-shift') to capture every layout-shift entry
emitted while Tab-focusing through TechCards on /technologie. We require:

  - cumulative CLS attributable to the focus interaction == 0
    (threshold MAX_CLS, default 0.0)
  - no individual shift entry with value > 0

Runs in both light and dark themes.

Run:  python3 tests/e2e/techcard_focus_cls.py
"""
import asyncio
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080")
ROUTE = "/technologie"
OUT = Path("/tmp/browser/techcard-focus-cls")
OUT.mkdir(parents=True, exist_ok=True)

MAX_CLS = float(os.environ.get("MAX_CLS", "0.0"))
TAB_PRESSES = 12


INSTALL_OBSERVER = """
() => {
  window.__cls = { entries: [], total: 0 };
  const po = new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      // Spec: ignore shifts attributed to recent user input.
      if (e.hadRecentInput) continue;
      window.__cls.entries.push({
        value: e.value,
        startTime: e.startTime,
        sources: (e.sources || []).map(s => s.node ? (s.node.tagName || '?') : '?'),
      });
      window.__cls.total += e.value;
    }
  });
  po.observe({ type: 'layout-shift', buffered: true });
  window.__clsObserver = po;
}
"""


async def run_theme(page, theme):
    failures = []
    await page.evaluate(
        "(t) => document.documentElement.classList.toggle('dark', t === 'dark')",
        theme,
    )
    # Settle after theme swap so its shifts don't get attributed to focus.
    await page.wait_for_timeout(300)

    # Reset observer state right before the interaction.
    await page.evaluate(INSTALL_OBSERVER)
    await page.wait_for_timeout(50)

    await page.evaluate("() => document.activeElement && document.activeElement.blur()")
    # Tab through the page; we want layout-shift entries during keyboard focus.
    for _ in range(TAB_PRESSES):
        await page.keyboard.press("Tab")
        await page.wait_for_timeout(60)

    # Force the browser to flush any pending layout-shift entry before we read.
    await page.wait_for_timeout(250)
    metric = await page.evaluate("() => window.__cls")
    Path(OUT / f"{theme}-cls.json").write_text(repr(metric))
    await page.screenshot(path=str(OUT / f"{theme}-after-tab.png"))

    print(f"  total CLS = {metric['total']:.6f} over {len(metric['entries'])} entry/ies")
    for e in metric["entries"]:
        print(f"    shift {e['value']:.6f} @ {e['startTime']:.1f}ms sources={e['sources']}")

    if metric["total"] > MAX_CLS:
        failures.append(
            f"[{theme}] cumulative CLS during Tab focus = {metric['total']:.6f} "
            f"> MAX_CLS={MAX_CLS}"
        )
    for e in metric["entries"]:
        if e["value"] > 0:
            failures.append(
                f"[{theme}] non-zero layout-shift entry value={e['value']:.6f} "
                f"sources={e['sources']}"
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
        # Let entrance animations / images settle so their shifts are NOT
        # counted against the focus interaction.
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(500)

        for theme in ("light", "dark"):
            print(f"--- CLS / {theme} ---")
            failures = await run_theme(page, theme)
            if failures:
                for f in failures:
                    print("  FAIL:", f)
                all_failures.extend(failures)
            else:
                print("  OK (CLS == 0 during Tab focus)")

        await browser.close()

    if all_failures:
        print(f"\n{len(all_failures)} CLS assertion(s) failed.")
        sys.exit(1)
    print("\nTechCard Tab-focus CLS == 0 in both light and dark themes.")


if __name__ == "__main__":
    asyncio.run(main())
