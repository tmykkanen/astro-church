import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import astroPlugin from "eslint-plugin-astro";

export default defineConfig([
  globalIgnores([".astro", ".netlify", "node_modules", "dist"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { js, react: reactPlugin },
    extends: [
      "js/recommended",
      tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
    ],
    settings: {
      react: { version: "detect" }, // fixes your React version warning
    },
    rules: {
      "react/prop-types": "off", // disable prop-types check,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/*.astro"],
    plugins: { astro: astroPlugin },
    extends: [
      ...astroPlugin.configs.recommended,
      ...astroPlugin.configs["jsx-a11y-recommended"],
    ],
  },
]);
