// scripts/generate-css.js
import fs from "fs";

// eslint-disable-next-line no-restricted-imports
import config from "../src/content-collections/site.config.json" with { type: "json" };

const CUSTOM_CSS = config.theme?.customCSS || "/* No custom CSS defined */";

const fileContent = `/* AUTO-GENERATED - DO NOT EDIT */\n\n${CUSTOM_CSS}`;

fs.writeFileSync("src/styles/theme.css", fileContent);
