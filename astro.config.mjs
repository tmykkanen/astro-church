// @ts-check
// deploy adapter
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import reactCompilerPlugin from "babel-plugin-react-compiler";
// md parsing
import remarkDirective from "remark-directive";

// eslint-disable-next-line no-restricted-imports
import { remarkDirectiveToHTML } from "./src/lib/remark-directive-to-html";

const SITE_URL =
  process.env.CONTEXT === "production"
    ? process.env.URL
    : process.env.DEPLOY_PRIME_URL;

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkDirectiveToHTML],
  },
  site: SITE_URL ?? "http://localhost:4321",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react({
      babel: {
        plugins: [reactCompilerPlugin],
      },
    }),
  ],
  adapter: netlify(),
});
