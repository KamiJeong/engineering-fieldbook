import { defineConfig } from "@playwright/test";
import { site } from "./site/config";
export default defineConfig({
  testDir: "site/e2e",
  timeout: 30000,
  fullyParallel: false,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:4173${site.base}`,
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bun site/scripts/serve.ts",
    wait: { stdout: /Static server \(no SPA fallback\)/ },
  },
});
