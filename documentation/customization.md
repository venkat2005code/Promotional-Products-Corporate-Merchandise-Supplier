# Customization Guide

## Colors

All colors are defined as CSS custom properties at the top of `assets/css/style.css` under `:root`. The palette is organized as raw brand colors (`--navy-900`, `--accent-500`, etc.) and semantic tokens that reference them (`--color-primary`, `--color-accent`, `--color-bg`, ...). To rebrand the template, change the raw brand color values — the semantic tokens (and therefore every component) update automatically.

Dark mode overrides live in `assets/css/dark-mode.css` and redefine the same semantic tokens under `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`. If you change the light-mode brand colors, revisit the dark-mode file to keep contrast comfortable.

## Fonts

Two font families are used, both loaded from Google Fonts:

- **Sora** — headings (`--font-heading`)
- **Inter** — body text (`--font-body`)

To swap fonts, change the `<link href="https://fonts.googleapis.com/css2?family=...">` tag in each page's `<head>` and update `--font-heading` / `--font-body` in `assets/css/style.css`.

## Logo

The logomark is inline SVG, repeated in each page's header and footer (a rounded navy square with a white tag outline and an orange accent dot). Search for `brand-mark` to find every instance, or replace the markup with an `<img>` tag pointing at your own logo file placed in `assets/images/`.

## Product Data

All product content for the catalogue (`pages/products.html`), the product detail page and the homepage's "Popular Products" section lives in a single JavaScript array: `PRODUCTS` in `assets/js/products.js`. Each entry supports:

```js
{ id, name, category, type, icon, material, colors, branding, useCase, price, moq, availability, desc }
```

Add, remove or edit entries here — the catalogue grid, filters, search and product detail page all read from this one array. `icon` references a `<symbol id="icon-...">` in the page's inline SVG sprite (see below).

## Categories

Category keys and labels are defined in `CATEGORY_LABELS` at the top of `assets/js/products.js`. Keep the keys used in `PRODUCTS[].category` in sync with this map.

## Icons & Illustrations

Every page inlines a small SVG `<symbol>` sprite immediately after `<body>` so icons work offline via `file://` and inherit color through `currentColor` (for automatic dark-mode theming). To add a new icon, add a `<symbol id="icon-yourname">...</symbol>` to the sprite on the pages that need it, then reference it with `<svg class="icon"><use href="#icon-yourname"></use></svg>`.

## Forms & Quote Requests

All forms use a shared validation engine in `assets/js/forms.js`. There is **no backend** — submissions are simulated (a short delay, then a success message) so the template can be evaluated without a server. To connect a real backend:

1. Open `assets/js/forms.js` and find the `fakeSubmit()` function (marked with a `TODO(backend)` comment).
2. Replace it with a `fetch()` call to a service such as [Formspree](https://formspree.io) or [Netlify Forms](https://docs.netlify.com/forms/setup/), or your own API endpoint.
3. Keep the same success/error handling contract (`resolve()` on success) so the rest of the form UI keeps working unchanged.

## Branding Workflow, Placement Visualizer & Bulk Estimator

- **Branding workflow** (`pages/custom-branding.html`) — steps are defined in `WORKFLOW_STEPS` in `assets/js/branding.js`.
- **Placement visualizer** — placement options per product type are defined in `PLACEMENTS` in `assets/js/branding.js`.
- **Bulk order estimator** (`pages/bulk-orders.html`) — indicative pricing logic lives in `assets/js/bulk-orders.js` (`BASE_UNIT_COST`, `BRANDING_COST`, `QUANTITY_BREAKS`). These are illustrative figures — replace with real rate cards when available.

## Theme Settings (Dark Mode)

Theme state is stored in `localStorage` under the key `bcm-theme` and applied via a `data-theme="light"|"dark"` attribute on `<html>`. When no explicit choice has been made, the page follows the OS `prefers-color-scheme`. See `assets/js/main.js` for the toggle logic.

## RTL Support

Add `dir="rtl"` to the `<html>` tag (and set `lang` to an RTL language code such as `ar` or `he`) to enable right-to-left layout. `assets/css/rtl.css` is already linked on every page and only activates its rules when `[dir="rtl"]` is present, so no other change is required.
