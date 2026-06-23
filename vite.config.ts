// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import path from "node:path";

// Load all env vars (no VITE_ prefix filter) into process.env so server routes
// can read SUPABASE_SERVICE_ROLE_KEY, LOVABLE_API_KEY, etc. The wrapper still
// handles VITE_* injection for the client bundle.
const serverEnv = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        // htmlparser2@8 imports `entities/lib/decode.js`, but top-level
        // entities@8 (required by parse5) no longer ships a `lib/` folder.
        // Redirect those legacy subpaths to the nested entities@4 install
        // that bun keeps under htmlparser2 for exactly this reason.
        "entities/lib/decode.js": path.resolve(
          process.cwd(),
          "node_modules/htmlparser2/node_modules/entities/lib/esm/decode.js",
        ),
        "entities/lib/escape.js": path.resolve(
          process.cwd(),
          "node_modules/htmlparser2/node_modules/entities/lib/esm/escape.js",
        ),
      },
    },
  },
});
