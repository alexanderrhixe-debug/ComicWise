// @ts-check
// ═══════════════════════════════════════════════════════════════════════════
// ESLint 9.x Flat Config - Comprehensive All-Plugin Configuration
// Configured for: Next.js 16 + React 19 + TypeScript 5
// 12+ Plugins: ESLint, TypeScript, React, Next.js, Import, A11y, Tailwind, Drizzle, Zod, Security, SonarJS, Prettier
// ═══════════════════════════════════════════════════════════════════════════

import css from "@eslint/css";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import eslintNextPlugin from "@next/eslint-plugin-next";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";
import pluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import * as drizzle from "eslint-plugin-drizzle";
import importPlugin from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
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
  // sonarjs.configs.recommended,
  compat.plugins("react-hooks"),
  {
    ...pluginReact.configs.flat.recommended,
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      js,
      next: eslintNextPlugin,
      "@typescript-eslint": typescript as any,
      react: pluginReact,
      "react-hooks": pluginReactHooks as any,
      // "jsx-a11y": jsxA11y,
      "simple-import-sort": pluginSimpleImportSort,
      "better-tailwindcss": pluginBetterTailwindcss,
      prettier: pluginPrettier,
      import: importPlugin,
      "unused-imports": unusedImports,
      drizzle,
      zod: zod as any,
      security,
      sonarjs,
    },
    extends: ["js/recommended", "sonarjs/recommended"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: null,
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
      "jsx-a11y": {
        components: {
          Button: "button",
          Input: "input",
        },
      },
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
        next: {},
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
      // ═══════════════════════════════════════════════════════════════════════
      // 1. BASE JAVASCRIPT RULES
      // ═══════════════════════════════════════════════════════════════════════
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-debugger": "error",
      "no-undef": "warn",
      "no-redeclare": "warn",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-constant-condition": ["warn", { checkLoops: false }],
      "no-cond-assign": "error",
      "no-duplicate-case": "error",
      "no-fallthrough": "error",
      "no-func-assign": "error",
      "no-import-assign": "error",
      "no-self-assign": "error",
      "no-self-compare": "error",
      "no-unreachable": "error",
      "valid-typeof": "error",
      "no-dupe-keys": "error",
      "no-setter-return": "error",
      "no-async-promise-executor": "error",
      "no-compare-neg-zero": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "consistent-return": "warn",
      "prefer-const": ["warn", { destructuring: "all" }],
      "prefer-arrow-callback": ["warn", { allowNamedFunctions: false, allowUnboundThis: true }],
      "no-unused-expressions": "warn",
      "no-loop-func": "warn",
      "no-implicit-coercion": "warn",
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": ["warn", { max: 2 }],
      "no-trailing-spaces": "error",
      "no-whitespace-before-property": "error",
      "prefer-spread": "warn",
      "prefer-template": "warn",
      radix: ["error", "as-needed"],
      "space-before-blocks": "error",
      "space-before-function-paren": [
        "error",
        { anonymous: "always", named: "never", asyncArrow: "always" },
      ],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "spaced-comment": [
        "warn",
        "always",
        { line: { exceptions: ["-", "+"] }, block: { exceptions: ["*"] } },
      ],
      "switch-colon-spacing": "error",
      "template-curly-spacing": ["error", "never"],
      "comma-dangle": ["warn", "es5"],
      "comma-spacing": "error",
      "comma-style": ["error", "last"],
      "computed-property-spacing": ["error", "never"],
      "func-call-spacing": ["error", "never"],
      "key-spacing": "error",
      "keyword-spacing": "error",
      "no-mixed-operators": "warn",
      "no-mixed-spaces-and-tabs": "error",
      "no-tabs": "error",
      quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ["error", "never"],
      "arrow-parens": ["error", "always"],
      "arrow-spacing": "error",
      "rest-spread-spacing": "error",
      "template-tag-spacing": "error",
      "yield-star-spacing": ["error", "after"],

      // ═══════════════════════════════════════════════════════════════════════
      // 2. NEXT.JS PLUGIN (@next/eslint-plugin-next)
      // ═══════════════════════════════════════════════════════════════════════
      ...eslintNextPlugin.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-css-tags": "error",
      "@next/next/google-font-display": "warn",
      "@next/next/google-font-preconnect": "warn",
      "@next/next/no-styled-jsx-in-document": "error",

      // ═══════════════════════════════════════════════════════════════════════
      // 3. TYPESCRIPT PLUGIN (@typescript-eslint/eslint-plugin)
      // ═══════════════════════════════════════════════════════════════════════
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": [
        "warn",
        { checksVoidReturn: false, checksConditionals: false },
      ],
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "import", format: ["camelCase", "PascalCase"] },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        { selector: "function", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow" },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enumMember", format: ["PascalCase", "UPPER_CASE"] },
      ],
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/prefer-function-type": "warn",
      "@typescript-eslint/unified-signatures": "warn",
      "@typescript-eslint/no-redundant-type-constituents": "warn",
      "@typescript-eslint/no-confusing-non-null-assertion": "warn",
      "@typescript-eslint/method-signature-style": ["warn", "method"],
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/no-dynamic-delete": "warn",
      "@typescript-eslint/no-invalid-void-type": "error",

      // ═══════════════════════════════════════════════════════════════════════
      // 4. REACT PLUGIN (eslint-plugin-react)
      // ═══════════════════════════════════════════════════════════════════════
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginReactHooks.configs.flat["recommended-latest"].rules,
      "react/react-in-jsx-scope": "warn",
      "react/prop-types": "warn",
      "react/jsx-uses-react": "warn",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": "warn",
      "react/display-name": "warn",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-array-index-key": "warn",
      "react/no-direct-mutation-state": "error",
      "react/require-render-return": "error",
      "react/self-closing-comp": "warn",
      "react/sort-comp": "warn",
      "react/sort-prop-types": "warn",
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-target-blank": "warn",
      "react/jsx-no-useless-fragment": "warn",
      "react/function-component-definition": [
        "warn",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
      ],
      "react/hook-use-state": "warn",
      "react/prefer-stateless-function": "warn",
      "react/no-unstable-nested-components": "warn",

      // ═══════════════════════════════════════════════════════════════════════
      // 5. REACT HOOKS PLUGIN (eslint-plugin-react-hooks)
      // ═══════════════════════════════════════════════════════════════════════
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ═══════════════════════════════════════════════════════════════════════
      // 6. JSX A11Y PLUGIN (eslint-plugin-jsx-a11y)
      // ═══════════════════════════════════════════════════════════════════════
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-role": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/heading-has-content": "warn",
      "jsx-a11y/html-has-lang": "warn",
      "jsx-a11y/iframe-has-title": "warn",
      "jsx-a11y/img-redundant-alt": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/label-has-associated-control": "warn",
      "jsx-a11y/media-has-caption": "warn",
      "jsx-a11y/mouse-events-have-key-events": "warn",
      "jsx-a11y/no-access-key": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-distracting-elements": "warn",
      "jsx-a11y/no-interactive-element-to-noninteractive-role": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/no-noninteractive-element-to-interactive-role": "warn",
      "jsx-a11y/no-noninteractive-tabindex": "warn",
      "jsx-a11y/no-redundant-roles": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "jsx-a11y/scope": "warn",

      // ═══════════════════════════════════════════════════════════════════════
      // 7. IMPORT PLUGIN (eslint-plugin-import)
      // ═══════════════════════════════════════════════════════════════════════
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "import/order": "off",
      "import/no-default-export": "off",
      "import/prefer-default-export": "off",
      "import/no-named-default": "error",
      "import/no-anonymous-default-export": "warn",
      "import/no-cycle": "warn",
      "import/no-self-import": "error",
      "import/no-unused-modules": "off",
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",
      "import/no-absolute-path": "error",
      "import/no-dynamic-require": "warn",
      "import/no-commonjs": "off",
      "import/no-restricted-paths": "off",
      "import/extensions": [
        "error",
        "ignorePackages",
        { ts: "never", tsx: "never", js: "never", jsx: "never" },
      ],
      "import/newline-after-import": "warn",
      "import/no-amd": "error",
      "import/no-webpack-loader-syntax": "error",
      "import/no-relative-packages": "warn",
      "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "import/first": "error",
      "import/no-mutable-exports": "error",

      // ═══════════════════════════════════════════════════════════════════════
      // 8. SIMPLE IMPORT SORT PLUGIN (eslint-plugin-simple-import-sort)
      // ═══════════════════════════════════════════════════════════════════════
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      // ═══════════════════════════════════════════════════════════════════════
      // 9. UNUSED IMPORTS PLUGIN (eslint-plugin-unused-imports)
      // ═══════════════════════════════════════════════════════════════════════
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // ═══════════════════════════════════════════════════════════════════════
      // 10. BETTER TAILWINDCSS PLUGIN (eslint-plugin-better-tailwindcss)
      // ═══════════════════════════════════════════════════════════════════════
      ...(pluginBetterTailwindcss.configs["recommended-warn"]?.rules || {}),
      ...(pluginBetterTailwindcss.configs["correctness-warn"]?.rules || {}),
      ...(pluginBetterTailwindcss.configs["stylistic-warn"]?.rules || {}),
      "better-tailwindcss/no-conflicting-classes": "warn",
      "better-tailwindcss/no-unregistered-classes": "warn",
      "better-tailwindcss/enforce-consistent-class-order": "warn",
      "better-tailwindcss/no-duplicate-classes": "warn",
      "better-tailwindcss/no-unnecessary-whitespace": "warn",

      // ═══════════════════════════════════════════════════════════════════════
      // 11. DRIZZLE ORM PLUGIN (eslint-plugin-drizzle)
      // ═══════════════════════════════════════════════════════════════════════
      "drizzle/enforce-delete-with-where": ["error", { drizzleObjectName: ["database", "db"] }],
      "drizzle/enforce-update-with-where": ["error", { drizzleObjectName: ["database", "db"] }],

      // ═══════════════════════════════════════════════════════════════════════
      // 12. ZOD PLUGIN (eslint-plugin-zod)
      // ═══════════════════════════════════════════════════════════════════════
      "zod/prefer-enum": "error",
      "zod/require-strict": "warn",

      // ═══════════════════════════════════════════════════════════════════════
      // 13. SECURITY PLUGIN (eslint-plugin-security)
      // ═══════════════════════════════════════════════════════════════════════
      "security/detect-object-injection": "off",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-child-process": "warn",
      "security/detect-disable-mustache-escape": "warn",
      "security/detect-no-csrf-before-method-override": "warn",
      "security/detect-unsafe-regex": "warn",
      "security/detect-buffer-noassert": "warn",

      // ═══════════════════════════════════════════════════════════════════════
      // 14. SONARJS PLUGIN (eslint-plugin-sonarjs)
      // ═══════════════════════════════════════════════════════════════════════
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/no-identical-expressions": "warn",
      "sonarjs/no-collapsible-if": "warn",
      "sonarjs/no-duplicate-string": "warn",

      // ═══════════════════════════════════════════════════════════════════════
      // 15. PRETTIER PLUGIN (eslint-plugin-prettier)
      // ═══════════════════════════════════════════════════════════════════════
      "prettier/prettier": [
        "error",
        {
          semi: false,
          trailingComma: "es5",
          singleQuote: false,
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          arrowParens: "always",
          endOfLine: "lf",
          bracketSpacing: true,
          bracketSameLine: false,
          plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"],
          overrides: [
            { files: "*.json", options: { printWidth: 80 } },
            { files: "*.md", options: { proseWrap: "always", printWidth: 80 } },
          ],
        },
        { usePrettierrc: false },
      ],
    },
  },

  // JavaScript-specific config (disable TypeScript rules)
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
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
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Playwright test files
  {
    files: ["**/tests/**/*.ts", "**/e2e/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Type definition files
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/triple-slash-reference": "warn",
    },
  },

  // TypeScript-specific rules (type-aware)
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": typescript as any,
    },
    rules: {
      ...(typescript.configs.recommended?.rules || {}),
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Config files
  {
    files: ["*.config.{js,ts,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-var-requires": "warn",
      "import/no-default-export": "off",
      "import/order": "off",
    },
  },

  // Generated/type stub files
  {
    files: ["src/types/**", "**/*.d.ts"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },

  // Hook utilities (no type-aware parsing)
  {
    files: ["src/hooks/**"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },

  // JSON files
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },

  {
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
    extends: ["json/recommended"],
  },

  // Markdown files
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/commonmark",
    extends: ["markdown/recommended"],
    rules: {
      "no-irregular-whitespace": "off",
      "markdown/fenced-code-language": "off",
      "markdown/no-missing-label-refs": "off",
      "markdown/no-missing-link-fragments": "off",
    },
  },

  // CSS files (including Tailwind)
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
    rules: {
      "css/no-invalid-syntax": "warn",
      "css/no-unknown-at-rules": "warn",
    },
  },

  prettierConfig,

  // Global ignores
  globalIgnores([
    "**/.next/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.vercel/**",
    "**/public/**",
    "**/drizzle/**",
    "src/styles/globals.css",
    "**/docs/**",
  ]),
]);

export default eslintConfig;
