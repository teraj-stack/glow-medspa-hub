import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TECHNOLOGIES } from "@/data/technologies";

// Mock TanStack Router's <Link> so TechCard renders without a router.
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

describe("integration: /technologie — TechCard with real data", () => {
  it("renders the laser-tulowy entry with whitespace-pre-line and name matching the source data", () => {
    const tech = TECHNOLOGIES.find((t) => t.slug === "laser-tulowy");
    expect(tech, "laser-tulowy entry must exist in TECHNOLOGIES").toBeDefined();
    expect(tech!.name).toContain("\n"); // sanity: data carries the line break

    render(<TechCard tech={tech!} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass("whitespace-pre-line");
    // Heading text is exactly what the data declares, including the newline.
    expect(heading.textContent).toBe(tech!.name);
    // Splits into two non-empty lines.
    const lines = heading.textContent!.split("\n").filter(Boolean);
    expect(lines.length).toBe(2);
  });

  it("renders every TECHNOLOGIES entry's h3 with whitespace-pre-line and name from the data source", () => {
    for (const tech of TECHNOLOGIES) {
      const { unmount } = render(<TechCard tech={tech} />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveClass("whitespace-pre-line");
      expect(heading.textContent).toBe(tech.name);
      unmount();
    }
  });
});

describe("integration: admin /admin/cennik — group heading uses whitespace-pre-line", () => {
  // The admin cennik route is auth-guarded and uses TanStack server functions,
  // so we don't mount the route here. Instead we assert on the source: the
  // group heading element must use whitespace-pre-line and render {t.name}
  // straight from the same TECHNOLOGIES data source as the public page.
  const source = readFileSync(
    resolve(__dirname, "../../routes/_authenticated/admin/cennik.tsx"),
    "utf8",
  );

  it("renders group <h3> with whitespace-pre-line bound to {t.name}", () => {
    expect(source).toMatch(
      /<h3[^>]*className="[^"]*\bwhitespace-pre-line\b[^"]*"[^>]*>\{t\.name\}<\/h3>/,
    );
  });

  it("imports TECHNOLOGIES from the shared data module", () => {
    expect(source).toMatch(
      /import\s*\{[^}]*\bTECHNOLOGIES\b[^}]*\}\s*from\s*["']@\/data\/technologies["']/,
    );
  });
});
