import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noHardcodedColors from "./eslint-local-rules/no-hardcoded-colors.js";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build artifacts and test reports (generated code):
    "playwright-report/**",
    "test-results/**",
    ".playwright/**",
  ]),
  // Custom rules for TripFlow color system
  {
    plugins: {
      "tripflow": {
        rules: {
          "no-hardcoded-colors": noHardcodedColors,
        },
      },
    },
    rules: {
      "tripflow/no-hardcoded-colors": "error", // Enforce as error (not warning)
    },
  },
]);

export default eslintConfig;
