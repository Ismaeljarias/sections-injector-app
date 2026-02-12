# Sections Injector App

A Shopify app built with React Router that provides custom theme sections through Theme App Extensions.

## Features

This app includes three professionally designed theme blocks:

- **Hero Banner** - Full-width hero section with image/video background, heading, subheading, and call-to-action button
- **FAQ Accordion** - Expandable FAQ section with keyboard navigation and ARIA support
- **Testimonials Slider** - Customer testimonials carousel with star ratings and autoplay functionality

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

Press P to open the URL to your app. Once you click install, the app and theme extensions will be installed on your development store.

## Using the Theme Blocks

After installing the app:

1. Go to **Online Store → Themes**
2. Click **Customize** on your theme
3. Click **Add section** on any page
4. Look under the **Apps** category
5. You'll find:
   - **Hero Banner**
   - **FAQ Item**
   - **Testimonial Slide**

### Customization

Each block has settings in the Theme Editor:

**Hero Banner:**

- Background image or video URL
- Overlay opacity
- Heading and subheading text
- Button text and link
- Content alignment (left, center, right)
- Section height (small, medium, large, full screen)

**FAQ Accordion:**

- Heading and subheading
- Allow multiple items open toggle
- Add/remove FAQ items
- Each item has question and answer fields

**Testimonials Slider:**

- Heading
- Autoplay toggle
- Add/remove testimonial slides
- Each slide includes:
  - Avatar image
  - Customer name and role
  - Star rating (1-5)
  - Review text

## Project Structure

```
.
├── app/
│   ├── routes/
│   │   └── app._index.tsx          # Main app admin UI
│   ├── sections/
│   │   └── index.js                 # Theme files (for future direct injection)
│   ├── utils/
│   │   └── theme.server.js          # Theme API utilities (for future use)
│   ├── shopify.server.ts            # Shopify app configuration
│   └── db.server.ts                 # Database connection
├── extensions/
│   └── theme-extension/
│       ├── blocks/                  # Theme App Extension blocks
│       │   ├── hero-banner.liquid
│       │   ├── faq-accordion.liquid
│       │   └── testimonials-slider.liquid
│       ├── snippets/                # Reusable Liquid snippets
│       │   ├── button.liquid
│       │   └── stars.liquid
│       ├── assets/                  # CSS and JavaScript files
│       │   ├── app-base.css
│       │   ├── hero-banner.css
│       │   ├── faq-accordion.css
│       │   ├── faq-accordion.js
│       │   ├── testimonials-slider.css
│       │   └── testimonials-slider.js
│       └── locales/
│           └── en.default.json
├── prisma/
│   └── schema.prisma                # Database schema
└── shopify.app.toml                 # App configuration
```

## Technical Details

### Theme App Extensions

This app uses **Theme App Extensions** to inject blocks into the Shopify theme. This is the recommended and officially supported method by Shopify for apps that provide theme functionality.

**Note:** The blocks will appear under the "Apps" category in the Theme Editor, not "Sections". This is by design for Theme App Extensions.

### Direct File Injection (Future)

The app includes code for direct theme file injection via the Shopify API (`themeFilesUpsert`), but this feature requires special approval from Shopify. An exception request has been submitted.

If approved in the future, sections would appear under the native "Sections" category instead of "Apps".

### Accessibility Features

All blocks include:

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
- `shopify:block:select` - Handle block selection in editor
- Prevents duplicate event listeners

## Development

### Local Development

```shell
npm run dev
```

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

These are necessary for future direct theme file injection functionality.

### API Version

Currently using: **2024-10 (October25)**

## Troubleshooting

### Blocks Not Appearing

If blocks don't appear in the Theme Editor:

1. Ensure the app is installed on the store
2. Check that extensions are deployed: `npm run deploy`
3. Refresh the Theme Editor page

### Database Errors

If you get "table does not exist" errors:

```shell
npm run setup
```

### Theme Editor Issues

If blocks behave incorrectly in the Theme Editor:

1. Check browser console for JavaScript errors
2. Ensure all asset files are loading correctly
3. Try uninstalling and reinstalling the app

## Resources

**Shopify Documentation:**

- [Shopify App Development](https://shopify.dev/docs/apps/getting-started)
- [Theme App Extensions](https://shopify.dev/docs/apps/online-store/theme-app-extensions)
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
