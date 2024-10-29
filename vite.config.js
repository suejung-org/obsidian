import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      exclude: [
        "node_modules",
        "test",
        "./server.{t,j}s",
        "*.d.ts",
        "instrument.js",
      ],
      include: ["packages/*/*"],
    },
  },
});
