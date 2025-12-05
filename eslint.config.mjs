import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import drizzle from "eslint-plugin-drizzle";
import importPlugin from "eslint-plugin-import";
import security from "eslint-plugin-security";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    "**/.next/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.vercel/**",
    "**/public/**",
    "**/drizzle/**",
    "**/*.config.js",
    "**/*.config.ts",
    "**/*.config.mjs",
  ]),

  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      drizzle,
      security,
    },
    rules: {
      // TypeScript
      "@typescript-eslint/no-unused-vars": "off", // Disable base rule
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Import organization
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
      "import/no-duplicates": "error",

      // Security
      "security/detect-object-injection": "warn",

      // Drizzle
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error",
    },
  },
]);

export default eslintConfig;
