# Sections Injector App

A Shopify app built with React Router that injects native theme sections directly into your Shopify theme using the REST Admin API.

## Features

This app includes three professionally designed theme sections that appear in the **"Sections"** category (not "Apps"):

- **App Hero Banner** - Full-width hero section with image background, heading, subheading, and call-to-action button
- **App FAQ Accordion** - Expandable FAQ section with keyboard navigation and ARIA support
- **App Testimonials Slider** - Customer testimonials carousel with star ratings and autoplay functionality

All sections are fully accessible, responsive, and support reduced motion preferences.

## Prerequisites

Before you begin, you'll need to:

1. [Download and install the Shopify CLI](https://shopify.dev/docs/apps/tools/cli/getting-started)
2. Have a Shopify Partner account
3. Have a development store

## Installation

### 1. Install Dependencies

```shell
npm install
```

### 2. Start Development Server

```shell
npm run dev
```

Press P to open the URL to your app. Once you click install, the app will be installed on your development store.

## Using the Sections

After installing the app:

1. Open the app from your Shopify admin
2. Click the **"Install Sections"** button in the app interface
3. Go to **Online Store → Themes**
4. Click **Customize** on your theme
5. Click **Add section** on any page
6. Look under the **Sections** category (NOT "Apps")
7. You'll find:
   - **App Hero Banner**
   - **App FAQ Accordion**
   - **App Testimonials Slider**

### Customization

Each section has settings in the Theme Editor:

**App Hero Banner:**

- Background image
- Heading and subheading text
- Button text and link

**App FAQ Accordion:**

- Heading and subheading
- Allow multiple items open toggle
- Add multiple FAQ items as blocks
- Each FAQ item has question and answer fields
- Keyboard navigation support (Arrow keys, Home, End, Enter, Space)

**App Testimonials Slider:**

- Heading
- Autoplay toggle
- Add multiple testimonial slides as blocks
- Each slide includes:
  - Avatar image
  - Customer name and role
  - Star rating (1-5)
  - Review text
- Responsive design
- Navigation controls (prev/next buttons)
- Touch/swipe support on mobile devices

## Project Structure

```
.
├── app/
│   ├── routes/
│   │   └── app._index.tsx          # Main app admin UI with install/uninstall buttons
│   ├── sections/
│   │   └── index.js                 # Theme section files (Liquid, CSS, JS)
│   ├── utils/
│   │   └── theme.server.js          # Theme API utilities for file injection
│   ├── shopify.server.ts            # Shopify app configuration
│   └── db.server.ts                 # Database connection
├── prisma/
│   └── schema.prisma                # Database schema (tracks installation status)
└── shopify.app.toml                 # App configuration
```

│ └── theme-extension/
│ ├── blocks/ # Theme App Extension blocks
│ │ ├── hero-banner.liquid
│ │ ├── faq-accordion.liquid
│ │ └── testimonials-slider.liquid
│ ├── snippets/ # Reusable Liquid snippets
│ │ └── stars.liquid # Star rating component (used by testimonials)
│ ├── assets/ # CSS and JavaScript files
│ │ ├── app-base.css # Base styles and button components
│ │ ├── hero-banner.css
│ │ ├── faq-accordion.css
│ │ ├── faq-accordion.js # Accordion interaction logic
│ │ ├── testimonials-slider.css
│ │ └── testimonials-slider.js # Slider navigation and autoplay
│ └── shopify.extension.toml # Extension configuration
├── prisma/
│ └── schema.prisma # Database schema
└── shopify.app.toml # App configuration

````

## Technical Details

### Direct Theme File Injection

This app uses the **REST Admin API** (`Asset` resource) to inject native Liquid sections directly into your theme files:

- Sections are uploaded to the `sections/` folder in your theme
- Assets (CSS/JS) are uploaded to the `assets/` folder
- Sections appear under the native **"Sections"** category in the Theme Editor (not "Apps")
- Files can be installed/uninstalled via the app interface

### How It Works

1. User clicks "Install Sections" in the app
2. App uses REST API to upload `.liquid`, `.css`, and `.js` files to the theme
3. Installation status is tracked in the database per shop
4. Sections become available immediately in the Theme Editor under "Sections"

### Accessibility Features

All sections include:

- Semantic HTML markup
- ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- Reduced motion support via `prefers-reduced-motion`
- Minimum touch target sizes (44x44px)

### Theme Editor Lifecycle

JavaScript components properly handle Theme Editor events:

- `shopify:section:load` - Initialize when section is added
- `shopify:section:unload` - Cleanup when section is removed
- Prevents duplicate event listeners

## Development

### Local Development

```shell
npm run dev
````

This starts the development server with hot reload enabled.

### Building for Production

```shell
npm run build
```

### Database Setup

If you encounter database errors:

```shell
npm run setup
```

This creates the necessary Prisma database tables.

## Deployment

When ready for production, follow the [Shopify deployment documentation](https://shopify.dev/docs/apps/launch/deployment).

Recommended hosting options:

- [Google Cloud Run](https://shopify.dev/docs/apps/launch/deployment/deploy-to-google-cloud-run)
- [Fly.io](https://fly.io/docs/js/shopify/)
- [Render](https://render.com/docs/deploy-shopify-app)

**Important:** Set `NODE_ENV=production` in your environment variables.

## Configuration

### Access Scopes

The app requires the following scopes (defined in `shopify.app.toml`):

```toml
scopes = "read_themes,write_themes"
```

These are necessary for direct theme file injection functionality.

### API Version

Currently using: **2026-04**

## Troubleshooting

### Sections Not Appearing

If sections don't appear in the Theme Editor:

1. Ensure the app is installed on the store
2. Click "Install Sections" in the app interface
3. Refresh the Theme Editor page
4. Look under the **"Sections"** category (not "Apps")

### Database Errors

If you get "table does not exist" errors:

```shell
npm run setup
```

### Sections Still in "Apps" Tab

If you see sections in the "Apps" tab after uninstalling:

1. The sections in "Apps" are from a previous Theme App Extension
2. Go to the app in your Shopify admin
3. Click "Uninstall Sections" to remove native sections
4. Old Theme App Extension blocks may remain until you uninstall/reinstall the entire app

### Theme Editor Issues

If sections behave incorrectly in the Theme Editor:

1. Check browser console for JavaScript errors
2. Ensure all asset files are loading correctly
3. Try clicking "Reinstall Sections" in the app

## Resources

**Shopify Documentation:**

- [Shopify App Development](https://shopify.dev/docs/apps/getting-started)
- [REST Admin API - Asset Resource](https://shopify.dev/docs/api/admin-rest/latest/resources/asset)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [Admin GraphQL API](https://shopify.dev/docs/api/admin-graphql)
- [Liquid Reference](https://shopify.dev/docs/api/liquid)

**React Router:**

- [React Router Documentation](https://reactrouter.com/home)
- [Shopify App React Router](https://shopify.dev/docs/api/shopify-app-react-router)

**UI Components:**

- [Polaris Web Components](https://shopify.dev/docs/api/app-home/polaris-web-components)
- [Polaris Design System](https://polaris.shopify.com)

## License

This project is based on the Shopify React Router app template.

```

```
