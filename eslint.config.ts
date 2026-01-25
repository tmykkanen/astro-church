// Core ESLint recommended rules
import { fileURLToPath } from "node:url";

// Include .gitignore
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
// Linting rules for Astro files
import astroPlugin from "eslint-plugin-astro";
// React-specific linting rules
import reactPlugin from "eslint-plugin-react";
// Utilities for defining config
import { defineConfig } from "eslint/config";
// Predefined global variables for different environments
import globals from "globals";
// TypeScript linting rules
import tseslint from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  // 1. Ignores
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),

  // 2. General Rules (Applies to all files)
  {
    rules: {
      "no-restricted-imports": ["error", { patterns: [".*"] }], // No relative imports
    },
  },

  // 3. Main App Config (JS, TS, React)
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
    ],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { react: reactPlugin },
    settings: {
      react: { version: "detect" }, // fixes your React version warning
    },
    rules: {
      "react/prop-types": "off", // disable prop-types check,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // 4. Astro Specific Config
  {
    files: ["**/*.astro"],
    extends: [
      ...astroPlugin.configs.recommended,
      ...astroPlugin.configs["jsx-a11y-recommended"],
    ],
    plugins: { astro: astroPlugin },
  },
]);
