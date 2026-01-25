// @ts-check
// deploy adapter
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import reactCompilerPlugin from "babel-plugin-react-compiler";

const SITE_URL =
  process.env.CONTEXT === "production"
    ? process.env.URL
    : process.env.DEPLOY_PRIME_URL;

export default defineConfig({
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
    sitemap(),
  ],
  adapter: netlify(),
});
