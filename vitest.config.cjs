// vitest.config.cjs
/** CommonJS config to avoid ESM/BOM issues on Windows */
const { defineConfig } = require("vitest/config");
const path = require("path");

module.exports = defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "lcov"], // <- adds coverage-summary.json
      reportsDirectory: "coverage",
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 70,
      // Scope coverage to what we actually unit-test right now
      include: [
        "src/lib/money.ts",
        "src/schemas/**/*.ts",
        "src/env.ts",
        "src/lib/getDbUrl.ts"
      ],
      // Exclude framework and untested areas for now
      exclude: [
        "**/*.d.ts",
        "next.config.*",
        "tailwind.config.*",
        "postcss.config.*",
        "prisma/**",
        "src/app/**",
        "src/server/**",
        "src/app/api/**"
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
