import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    exclude: ["dist", "node_modules"],
    alias: {
      "~/": new URL("./src/", import.meta.url).pathname,
    },
    watch: false,
  },
});
