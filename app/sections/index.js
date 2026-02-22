import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Helper function to read file content
 * @param {string} relativePath - Path relative to sections directory
 * @returns {string} File content
 */
function readFile(relativePath) {
  return readFileSync(join(__dirname, relativePath), "utf-8");
}

/**
 * Array of theme files to be injected into Shopify themes
 * Each file contains the filename (destination in theme) and content
 */
export const THEME_FILES = [
  // Sections
  {
    filename: "sections/app-hero-banner.liquid",
    content: readFile("./hero-banner/section.liquid"),
  },
  {
    filename: "sections/app-faq-accordion.liquid",
    content: readFile("./faq-accordion/section.liquid"),
  },
  {
    filename: "sections/app-testimonials-slider.liquid",
    content: readFile("./testimonials-slider/section.liquid"),
  },

  // Snippets
  {
    filename: "snippets/app-stars.liquid",
    content: readFile("./snippets/app-stars.liquid"),
  },
  {
    filename: "snippets/app-button.liquid",
    content: readFile("./snippets/app-button.liquid"),
  },

  // Styles
  {
    filename: "assets/app-base.css",
    content: readFile("./shared/base.css"),
  },
  {
    filename: "assets/hero-banner.css",
    content: readFile("./hero-banner/styles.css"),
  },
  {
    filename: "assets/faq-accordion.css",
    content: readFile("./faq-accordion/styles.css"),
  },
  {
    filename: "assets/testimonials-slider.css",
    content: readFile("./testimonials-slider/styles.css"),
  },

  // Scripts
  {
    filename: "assets/faq-accordion.js",
    content: readFile("./faq-accordion/script.js"),
  },
  {
    filename: "assets/testimonials-slider.js",
    content: readFile("./testimonials-slider/script.js"),
  },
];

/**
 * Array of filenames for tracking installed files
 * Used for uninstallation process
 */
export const FILENAMES = THEME_FILES.map((f) => f.filename);
