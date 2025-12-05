import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";
import pluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
// @ts-expect-error - Missing type definitions for eslint-plugin-drizzle
import * as drizzle from "eslint-plugin-drizzle";
import importPlugin from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
// @ts-expect-error - Missing type definitions for eslint-plugin-security
import security from "eslint-plugin-security";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

import { FlatCompat } from "@eslint/eslintrc";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const rootDir = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: rootDir,
  resolvePluginsRelativeTo: rootDir,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = defineConfig([
  // @ts-expect-error - Next.js config has complex type compatibility with ESLint 9 flat config
  ...nextVitals,
  // @ts-expect-error - Next.js config has complex type compatibility with ESLint 9 flat config
  ...nextTs,
  // @ts-expect-error - JS config has complex type compatibility with ESLint 9 flat config
  js.configs.recommended,
  // @ts-expect-error - TypeScript ESLint config has complex type compatibility with ESLint 9 flat config
  tseslint.configs.recommended,
  // @ts-expect-error - FlatCompat plugin conversion may have type mismatches
  .../** @type {any} */ compat.plugins("zod"),
  // @ts-expect-error - Prettier config type compatibility with ESLint 9 flat config
  prettierConfig,
  // @ts-expect-error - Global ignores type compatibility with ESLint 9 flat config
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
    "**/*.css", // Ignore CSS files for Tailwind v4 custom syntax
  ]),

  // @ts-expect-error - Plugin type compatibility with ESLint 9 flat config
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: ["./tsconfig.json"],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      js,
      react: pluginReact,
      "simple-import-sort": pluginSimpleImportSort,
      "better-tailwindcss": pluginBetterTailwindcss,
      prettier: pluginPrettier,
      import: importPlugin,
      "unused-imports": unusedImports,
      "react-hooks": pluginReactHooks,

      drizzle,
      security,
    },

    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: true,
    },
    settings: {
      react: { version: "detect" },
      "better-tailwindcss": {
        entryPoint: "src/styles/globals.css",
        tailwindConfig: "",
        attributes: ["class", "className"],
        callees: [
          "cc",
          "clb",
          "clsx",
          "cn",
          "cnb",
          "ctl",
          "cva",
          "cx",
          "dcnb",
          "objstr",
          "tv",
          "twJoin",
          "twMerge",
        ],
        variables: ["className", "classNames", "classes", "style", "styles"],
        tags: ["myTag"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json"],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
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

      // Drizzle ORM Rules
      "drizzle/enforce-delete-with-where": ["error", { drizzleObjectName: ["db"] }],
      "drizzle/enforce-update-with-where": ["error", { drizzleObjectName: ["db"] }],
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginReactHooks.configs.flat["recommended-latest"].rules,

      // Use only one severity variant per Better Tailwind CSS category
      ...pluginBetterTailwindcss.configs["recommended-warn"].rules,
      ...pluginBetterTailwindcss.configs["correctness-warn"].rules,
      ...pluginBetterTailwindcss.configs["stylistic-warn"].rules,
      "better-tailwindcss/no-conflicting-classes": "warn",
      "better-tailwindcss/no-unregistered-classes": "off",
      "better-tailwindcss/enforce-consistent-class-order": "warn",
      "better-tailwindcss/no-duplicate-classes": "warn",
      "better-tailwindcss/no-unnecessary-whitespace": "warn",
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "off",
        {
          group: "newLine",
          preferSingleLine: true,
          printWidth: 150,
        },
      ],
    },
  },
  // JavaScript files configuration
  // @ts-expect-error - Plugin type compatibility with ESLint 9 flat config
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Test files
  // @ts-expect-error - Plugin type compatibility with ESLint 9 flat config
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Playwright test files - disable React hooks rules
  // @ts-expect-error - Plugin type compatibility with ESLint 9 flat config
  {
    files: ["**/tests/**/*.ts", "**/e2e/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Type definition files - allow any for third-party package definitions
  // @ts-expect-error - Plugin type compatibility with ESLint 9 flat config
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },

  // Config files
  // @ts-expect-error - Plugin type compatibility with ESLint 9 flat config
  {
    files: ["*.config.{js,ts,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "import/no-default-export": "off",
    },
  },
  // @ts-expect-error - JSON config type compatibility with ESLint 9 flat config
  {
    files: ["**/*.jsonc"],

    // Ensure recommended config is merged first so explicit properties below win
    ...json.configs.recommended,

    language: "json/jsonc",
  },

  // @ts-expect-error - JSON5 config type compatibility with ESLint 9 flat config
  {
    files: ["**/*.json5"],

    // Ensure recommended config is merged first so explicit properties below win
    ...json.configs.recommended,

    language: "json/json5",
  },

  // @ts-expect-error - Markdown config type compatibility with ESLint 9 flat config
  {
    files: ["**/*.md"],
    language: "markdown/gfm",
    extends: [markdown.configs.recommended],
    rules: {
      "no-irregular-whitespace": "off",
      "markdown/fenced-code-language": "off", // Disable for documentation flexibility
    },
  },
  // @ts-expect-error - CSS config type compatibility with ESLint 9 flat config
  {
    files: ["**/*.css"],
    ...css.configs.recommended,
    // Ensure the language is explicitly set so @eslint/css handles CSS files
    language: "css/css",
    rules: {
      // Disable rules that conflict with Tailwind CSS v4 syntax
      "css/no-invalid-syntax": "off",
      "css/no-unknown-at-rules": "off",
    },
  },
]);

export default eslintConfig;
