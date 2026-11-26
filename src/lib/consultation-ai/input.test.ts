import { describe, expect, it } from "vitest";
import { consultationInput } from "./input";

describe("przygotowanie pytań do konsultacji", () => {
  it("przyjmuje opis potrzeb pacjentki", () => {
    expect(consultationInput.parse({ needs: "Mam przebarwienia i obawiam się długiej rekonwalescencji.", consent: true }).needs).toContain("przebarwienia");
  });
  it("odrzuca brak zgody", () => {
    expect(consultationInput.safeParse({ needs: "Mam przebarwienia i chciałabym je omówić.", consent: false }).success).toBe(false);
  });
  it("odrzuca opis przekraczający 3000 znaków", () => {
    expect(consultationInput.safeParse({ needs: "a".repeat(3001), consent: true }).success).toBe(false);
  });
  it("przyjmuje dokładnie 3000 znaków", () => {
    expect(consultationInput.safeParse({ needs: "a".repeat(3000), consent: true }).success).toBe(true);
  });
});