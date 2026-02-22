# Sections Architecture

This directory contains modular Shopify sections that are injected into store themes via the app.

## Directory Structure

```
app/sections/
├── index.js                      # Main export file that builds THEME_FILES array
├── hero-banner/                  # Hero banner section
│   ├── section.liquid           # Liquid template
│   └── styles.css               # Component styles
├── faq-accordion/               # FAQ accordion section
│   ├── section.liquid
│   ├── styles.css
│   └── script.js                # Interactive functionality
├── testimonials-slider/         # Testimonials slider section
│   ├── section.liquid
│   ├── styles.css
│   └── script.js
├── snippets/                    # Reusable Liquid snippets
│   ├── app-button.liquid
│   └── app-stars.liquid
└── shared/                      # Shared resources
    └── base.css                 # Base styles and CSS variables
```

## How It Works

1. **Modular Files**: Each section is organized in its own directory with separate files for templates, styles, and scripts
2. **Build Process**: `index.js` reads all files at build time using `fs.readFileSync`
3. **Deployment**: Files are combined into the `THEME_FILES` array and uploaded to Shopify via REST API
4. **Clean Separation**: Native `.liquid`, `.css`, and `.js` files with proper syntax highlighting and tooling support

## Adding a New Section

1. Create a new directory in `app/sections/` (e.g., `my-section/`)
2. Add your files:
   - `section.liquid` (required)
   - `styles.css` (optional)
   - `script.js` (optional)
3. Update `app/sections/index.js` to include your new files:

```javascript
{
  filename: "sections/my-section.liquid",
  content: readFile('./my-section/section.liquid')
},
{
  filename: "assets/my-section.css",
  content: readFile('./my-section/styles.css')
},
```

## Benefits

✅ **Better Developer Experience**: Native file formats with full IDE support  
✅ **Maintainable**: Each section is self-contained and easy to locate  
✅ **Scalable**: Add new sections without bloating a single file  
✅ **Reusable**: Shared snippets and styles prevent duplication  
✅ **Version Control**: Easier to track changes and review PRs

## File Naming Conventions

- **Sections**: `sections/app-{name}.liquid`
- **Snippets**: `snippets/app-{name}.liquid`
- **Styles**: `assets/{name}.css`
- **Scripts**: `assets/{name}.js`

All app-related files are prefixed with `app-` to avoid conflicts with existing theme files.
