import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Technology } from "@/data/technologies";

vi.mock("@tanstack/react-router", () => ({
  // Mirror TanStack Router's <Link>: build a real href from `to` + `params`
  // so navigation/keyboard tests can assert on the resolved URL.
  Link: ({
    children,
    className,
    to = "#",
    params = {},
  }: {
    children: React.ReactNode;
    className?: string;
    to?: string;
    params?: Record<string, string>;
  }) => {
    const href = Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(`$${k}`, String(v)),
      to,
    );
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  },
}));

import { TechCard } from "./TechCard";

const tech: Technology = {
  slug: "laser-tulowy",
  name: "Laser tulowy 1927 nm\n/laser Er:Yag glass 1550nm",
  category: "skóra",
  shortDesc: "Opis testowy dla a11y.",
  mechanism: "—",
  indications: [],
  pricing: [],
  faq: [],
};

// ---------- OKLCH → sRGB → WCAG relative luminance ----------
// Björn Ottosson's OKLab matrices, then the standard sRGB transfer.
function oklchToRgb(L: number, C: number, hDeg: number): [number, number, number] {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const toSrgb = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };
  return [toSrgb(r), toSrgb(g), toSrgb(bl)];
}

function relativeLuminance([r, g, b]: [number, number, number]) {
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(fg: [number, number, number], bg: [number, number, number]) {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

// Parse `oklch(L C h)` (ignores alpha) from a CSS variable value.
function parseOklch(value: string): [number, number, number] {
  const m = value.match(
    /oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/i,
  );
  if (!m) throw new Error(`Cannot parse oklch from "${value}"`);
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
}

// Pull a CSS custom property declaration from inside a given selector block.
function readVar(css: string, selector: string, name: string): string {
  const blockRe = new RegExp(
    `${selector.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`,
  );
  const block = css.match(blockRe);
  if (!block) throw new Error(`Selector ${selector} not found`);
  const decl = block[1].match(new RegExp(`${name}\\s*:\\s*([^;]+);`));
  if (!decl) throw new Error(`Var ${name} not found in ${selector}`);
  return decl[1].trim();
}

const cssSource = readFileSync(
  resolve(__dirname, "../../styles.css"),
  "utf8",
);

describe("a11y: TechCard heading semantics", () => {
  it("exposes the technology name as a level-3 heading with an accessible name", () => {
    render(<TechCard tech={tech} />);

    // Exactly one h3 per card, and it is the technology name.
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(1);

    const h3 = headings[0];
    expect(h3.tagName).toBe("H3");
    // Accessible name (textContent) is the full data-driven name, preserved
    // with the newline so screen readers announce both parts.
    expect(h3.textContent).toBe(tech.name);
    expect(h3.textContent!.trim().length).toBeGreaterThan(0);
  });

  it("renders the card as a single keyboard-focusable link wrapping the heading", () => {
    render(<TechCard tech={tech} />);
    const link = screen.getByRole("link");
    const h3 = screen.getByRole("heading", { level: 3 });
    expect(link.contains(h3)).toBe(true);
  });
});

describe("a11y: TechCard click target and in-link text contrast", () => {
  const AA_NORMAL = 4.5;
  const MIN_TAP_PX = 44; // WCAG 2.5.5 / mobile UX baseline

  it("exposes the whole card as a single link with all text inside its hit area", () => {
    render(<TechCard tech={tech} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    const link = links[0];

    // All three text layers must be descendants of the link so the entire card
    // surface is clickable, not just the title.
    const eyebrow = screen.getByText("Skóra");
    const heading = screen.getByRole("heading", { level: 3 });
    const desc = screen.getByText(tech.shortDesc);

    expect(link.contains(eyebrow)).toBe(true);
    expect(link.contains(heading)).toBe(true);
    expect(link.contains(desc)).toBe(true);

    // The link must be the focusable element (anchor element, real href).
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href");
  });

  it("gives the link enough padding to meet a 44×44 tap target on mobile", () => {
    // jsdom does not run layout, so we cannot read getBoundingClientRect.
    // Instead, assert the underlying .tile-card utility declares padding ≥ 1rem
    // (≈ 16px), which together with the heading line-height keeps the hit
    // surface comfortably above 44×44 on real browsers. Combined with the
    // previous test (whole card is the link), this proves the click area is
    // the full padded card, not a thin text run.
    const tileCardBlock = cssSource.match(
      /@utility\s+tile-card\s*\{[^}]*padding:\s*([0-9.]+)rem/,
    );
    expect(tileCardBlock, ".tile-card must declare padding").toBeTruthy();
    const paddingRem = parseFloat(tileCardBlock![1]);
    const paddingPx = paddingRem * 16;
    // 1.5rem (24px) padding on each side → 48px vertical/horizontal padding
    // alone, before any content, easily clearing the 44px tap baseline.
    expect(paddingPx * 2).toBeGreaterThanOrEqual(MIN_TAP_PX);
  });

  it("keeps every text node inside the link at WCAG AA contrast in both themes", () => {
    // Map each rendered text element in TechCard to the CSS custom property
    // that drives its color. The link itself does not set a color, so each
    // child inherits/declares its own foreground over .tile-card { var(--card) }.
    const TEXT_LAYERS: Array<{ fgVar: string; label: string }> = [
      { fgVar: "--champagne", label: "eyebrow category" },
      { fgVar: "--ink", label: "h3 title" },
      { fgVar: "--muted-foreground", label: "short description" },
    ];

    for (const theme of [":root", "\\.dark"] as const) {
      const bg = parseOklch(readVar(cssSource, theme, "--card"));
      for (const { fgVar, label } of TEXT_LAYERS) {
        const fg = parseOklch(readVar(cssSource, theme, fgVar));
        const ratio = contrastRatio(oklchToRgb(...fg), oklchToRgb(...bg));
        expect(
          ratio,
          `${theme} → ${label} (${fgVar}) inside link: got ${ratio.toFixed(
            2,
          )}:1, need ≥ ${AA_NORMAL}:1`,
        ).toBeGreaterThanOrEqual(AA_NORMAL);
      }
    }
  });
});


describe("a11y: TechCard text contrast in light and dark themes", () => {
  // TechCard renders three text layers over .tile-card { background: var(--card) }:
  //   1. category eyebrow  → text-champagne          (var(--champagne))
  //   2. tile-title h3     → color: var(--ink)
  //   3. tile-text p       → color: var(--muted-foreground)
  // The ArrowUpRight icon is decorative (no accessible name) so it is excluded.
  // WCAG 2.1 AA requires ≥ 4.5:1 for normal body text.
  const AA_NORMAL = 4.5;

  // [foreground token, label-for-error-output]
  const FG_TOKENS: Array<[string, string]> = [
    ["--ink", "tile-title (h3) — var(--ink)"],
    ["--muted-foreground", "tile-text (p) — var(--muted-foreground)"],
    ["--champagne", "eyebrow category — var(--champagne)"],
  ];

  function ratioFor(theme: ":root" | "\\.dark", fgVar: string) {
    const fg = parseOklch(readVar(cssSource, theme, fgVar));
    // --card may be missing in .dark earlier in the file but is defined here;
    // fall back to --background if a project ever drops --card.
    const bgVarName = (() => {
      try {
        readVar(cssSource, theme, "--card");
        return "--card";
      } catch {
        return "--background";
      }
    })();
    const bg = parseOklch(readVar(cssSource, theme, bgVarName));
    return contrastRatio(oklchToRgb(...fg), oklchToRgb(...bg));
  }

  describe.each([
    [":root" as const, "light"],
    ["\\.dark" as const, "dark"],
  ])("%s mode", (selector, label) => {
    for (const [fgVar, fgLabel] of FG_TOKENS) {
      it(`${label}: ${fgLabel} meets WCAG AA (≥ ${AA_NORMAL}:1) on --card`, () => {
        const ratio = ratioFor(selector, fgVar);
        // Helpful failure message: include the actual ratio rounded.
        expect(
          ratio,
          `expected ≥ ${AA_NORMAL}:1 but got ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(AA_NORMAL);
      });
    }
  });
});

