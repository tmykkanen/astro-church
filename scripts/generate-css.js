// scripts/generate-css.js
import fs from "fs";

import config from "../src/_site-config.json" with { type: "json" };

const cssContent = config.theme?.customCSS || "";

fs.writeFileSync("src/styles/theme.css", cssContent);
