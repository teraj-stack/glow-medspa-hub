import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";

test("Git updates must not trigger Vercel deployments on any branch", () => {
  const config = JSON.parse(
    readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  assert.equal(config.git?.deploymentEnabled, false);
});