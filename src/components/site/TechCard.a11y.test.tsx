import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Technology } from "@/data/technologies";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
    to?: string;
    params?: Record<string, string>;
  }) => (
    <a href="#" className={className}>
      {children}
    </a>
  ),
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

describe("a11y: TechCard heading contrast in light and dark themes", () => {
  // The heading uses .tile-title { color: var(--ink) } over .tile-card
  // { background: var(--card) }. WCAG 2.1 AA requires ≥ 4.5:1 for normal text.
  const AA_NORMAL = 4.5;

  it("meets WCAG AA contrast in light mode (ink on card)", () => {
    const ink = parseOklch(readVar(cssSource, ":root", "--ink"));
    const card = parseOklch(readVar(cssSource, ":root", "--card"));
    const ratio = contrastRatio(
      oklchToRgb(...ink),
      oklchToRgb(...card),
    );
    expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("meets WCAG AA contrast in dark mode (ink on card)", () => {
    const ink = parseOklch(readVar(cssSource, "\\.dark", "--ink"));
    const card = parseOklch(readVar(cssSource, "\\.dark", "--card"));
    const ratio = contrastRatio(
      oklchToRgb(...ink),
      oklchToRgb(...card),
    );
    expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});
