import css from "@eslint/css";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";
import pluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import * as drizzle from "eslint-plugin-drizzle";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import * as zod from "eslint-plugin-zod";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export const compat = new FlatCompat({
  baseDirectory: rootDir,
  resolvePluginsRelativeTo: rootDir,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = defineConfig([
  nextVitals,
  nextTs,
  js.configs.recommended,
  tseslint.configs.recommended,
  ...compat.plugins("react-hooks"),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      "@typescript-eslint": typescript as any,
      js,
      react: pluginReact,
      "simple-import-sort": pluginSimpleImportSort,
      "better-tailwindcss": pluginBetterTailwindcss,
      prettier: pluginPrettier,
      import: importPlugin,
      "unused-imports": unusedImports,
      drizzle,
      zod: zod as any,
      security,
    },
    extends: ["js/recommended"],
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
        ...globals.es2022,
        React: "readonly",
      },
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
          extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".mts", ".cts"],
        },
      },
    },

    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended!.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginReactHooks.configs.flat["recommended-latest"].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // Use only one severity variant per Better Tailwind CSS category
      ...pluginBetterTailwindcss.configs["recommended-warn"]!.rules,
      ...pluginBetterTailwindcss.configs["correctness-warn"]!.rules,
      ...pluginBetterTailwindcss.configs["stylistic-warn"]!.rules,
      // General
      "no-unused-vars": "off",
      "no-console": ["warn", { allow: ["warn", "error", "log"] }],
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "consistent-return": "warn",
      "prefer-const": [
        "warn",
        {
          destructuring: "all",
        },
      ],
      "no-undef": "off",
      "no-redeclare": "off",
      "prefer-arrow-callback": [
        "warn",
        {
          allowNamedFunctions: false,
          allowUnboundThis: true,
        },
      ],
      "no-unused-expressions": "off",
      // Next.js
      "@next/next/no-html-link-for-pages": "off",

      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "error",
      // React
      "react/react-in-jsx-scope": "off", // Not needed with Next.js
      "react/prop-types": "off", // Using TypeScript for type checking
      "react/jsx-uses-react": "off", // Not needed with Next.js
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": "warn",
      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/use-memo": "off",

      // TypeScript
      "@typescript-eslint/no-unused-vars": "off", // Disable base rule
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
      ],
      "@typescript-eslint/no-empty-interface": "warn",

      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "off",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Import organization
      "import/order": [
        "error",
        {
          groups: [
            // Imports of builtins are first
            "builtin",
            // Then external imports
            "external",
            // Then internal imports
            "internal",
            // Then sibling and parent imports. They can be mingled together
            ["sibling", "parent"],
            // Then index file imports
            "index",
            // Then any arcane TypeScript imports
            "object",
            // Then the omitted imports: internal, external, type, unknown
            "type",
            "unknown",
          ],
          sortTypesGroup: true,
          "newlines-between": "never",
          "newlines-between-types": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          warnOnUnassignedImports: true,
        },
      ],
      "import/no-unresolved": "error",

      "import/no-duplicates": "error",

      // Security
      "security/detect-object-injection": "warn",

      // Drizzle ORM Rules
      "drizzle/enforce-delete-with-where": ["error", { drizzleObjectName: ["db"] }],
      "drizzle/enforce-update-with-where": ["error", { drizzleObjectName: ["db"] }],

      // Use only one severity variant per Better Tailwind CSS category
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
          printWidth: 100,
        },
      ],
      // Zod
      "zod/prefer-enum": "error",
      "zod/require-strict": "warn",

      // Prettier
      "prettier/prettier": [
        "error",
        {
          // ═══════════════════════════════════════════════════
          // Core Formatting Options
          // ═══════════════════════════════════════════════════
          semi: true,
          trailingComma: "es5",
          singleQuote: false,
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          arrowParens: "always",
          endOfLine: "lf",
          bracketSpacing: true,
          bracketSameLine: false,

          // ═══════════════════════════════════════════════════
          // Plugin Configuration
          // ═══════════════════════════════════════════════════
          plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"],

          // ═══════════════════════════════════════════════════
          // File-Specific Overrides
          // ═══════════════════════════════════════════════════
          overrides: [
            {
              files: "*.json",
              options: {
                printWidth: 80,
              },
            },
            {
              files: "*.md",
              options: {
                proseWrap: "always",
                printWidth: 80,
              },
            },
          ],

          // ═══════════════════════════════════════════════════
          // Ignore Patterns
          // ═══════════════════════════════════════════════════
          // Note: Use .prettierignore file for complex patterns
        },
        { usePrettierrc: false },
      ],
      // Simple Import Sort
      "simple-import-sort/imports": "off",
      "simple-import-sort/exports": "off",
    },
  },
  // JavaScript files configuration

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
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },

  // // Config files
  // // @ts-expect-error - Plugin type compatibility with ESLint 9 flat config
  {
    files: ["*.config.{js,ts,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "import/no-default-export": "off",
      "import/order": "off",
    },
  },
  {
    files: ["**/*.jsonc"],

    // Ensure recommended config is merged first so explicit properties below win
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },

  {
    files: ["**/*.json5"],

    // Ensure recommended config is merged first so explicit properties below win
    plugins: { json },
    language: "json/json5",
    extends: ["json/recommended"],
  },

  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/commonmark",
    extends: ["markdown/recommended"],
    rules: {
      "no-irregular-whitespace": "off",
      "markdown/fenced-code-language": "off", // Disable for documentation flexibility
      "markdown/no-missing-label-refs": "off", // Disable for documentation flexibility
    },
  },
  {
    files: ["**/*.css"],
    // Ensure the language is explicitly set so @eslint/css handles CSS files
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
    rules: {
      // Disable rules that conflict with Tailwind CSS v4 syntax
      "css/no-invalid-syntax": "off",
      "css/no-unknown-at-rules": "off",
    },
  },
  prettierConfig,
  globalIgnores([
    "**/.next/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.vercel/**",
    "**/public/**",
    "**/drizzle/**",
    "src/styles/globals.css",
  ]),
]);

export default eslintConfig;
