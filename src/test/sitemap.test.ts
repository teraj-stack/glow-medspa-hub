import { describe, expect, it } from "vitest";

import { buildSitemapEntries } from "@/lib/sitemap-entries";

describe("Mapa strony", () => {
  it("nie zawiera technicznego adresu wypisu z wiadomości e-mail", () => {
    const paths = buildSitemapEntries().map((entry) => entry.path);

    expect(paths).not.toContain("/email/unsubscribe");
  });

  it("nie zawiera zduplikowanych adresów", () => {
    const paths = buildSitemapEntries().map((entry) => entry.path);

    expect(new Set(paths).size).toBe(paths.length);
  });
});
