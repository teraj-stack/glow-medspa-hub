import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Technology } from "@/data/technologies";

// Mock TanStack Router's <Link> so the component can render without a router.
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

const baseTech: Technology = {
  slug: "laser-tulowy",
  name: "Laser tulowy 1927 nm\n/laser Er:Yag glass 1550nm",
  category: "skóra",
  shortDesc: "Opis testowy.",
  mechanism: "—",
  indications: [],
  pricing: [],
  faq: [],
};

describe("TechCard", () => {
  it("renders the technology name with whitespace-pre-line so a \\n produces two visible lines", () => {
    render(<TechCard tech={baseTech} />);

    const heading = screen.getByRole("heading", { level: 3 });

    // Class hook that enables line breaks on \n.
    expect(heading).toHaveClass("whitespace-pre-line");

    // The raw text content preserves the newline character.
    expect(heading.textContent).toBe(
      "Laser tulowy 1927 nm\n/laser Er:Yag glass 1550nm",
    );

    // And splits into exactly two non-empty lines.
    const lines = heading.textContent!.split("\n").filter(Boolean);
    expect(lines).toEqual([
      "Laser tulowy 1927 nm",
      "/laser Er:Yag glass 1550nm",
    ]);
  });
});
