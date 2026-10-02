import { defineConfig } from "@playwright/test";
const port = process.env.TEST_PORT || "4173";
const url = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: url,
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url,
    reuseExistingServer: !process.env.CI,
  },
  reporter: "list",
});
