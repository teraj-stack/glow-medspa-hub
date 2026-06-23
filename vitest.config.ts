import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    // Enable jsdom's pretendToBeVisual so :focus-visible and other
    // visibility-gated APIs (rAF, matchMedia) behave like a real browser.
    environmentOptions: {
      jsdom: { pretendToBeVisual: true },
    },
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
