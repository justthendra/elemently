# Elemently – Web Design Inspector & Developer Toolkit

> **"Explore Every Element."**

Elemently is a professional Google Chrome extension (Manifest V3) and comprehensive Developer Toolkit designed for frontend developers, UI/UX designers, and web creators. Built with React, TypeScript, Vite, Tailwind CSS, Lucide Icons, and the Chrome Side Panel API.

---

## 🌟 Key Features

### 1. Element Inspector
- **Interactive Inspect Mode**: Hover over any element on the active page to see bounding box, tag name, classes, and dimensions.
- **Detailed Metrics**: Tag, ID, classList, full CSS selector path, XPath, screen coordinates.
- **Computed Styles**: Filterable CSS properties categorized by Layout, Typography, Box Model, Visuals, and Animation.
- **Inline Styles & CSS Variables**: Direct extraction of inline styles and CSS custom properties (`--*`).
- **Interactive Box Model**: Visual representation of Margin (amber), Border (yellow), Padding (green), and Content (violet).
- **DOM Hierarchy Breadcrumbs**: Click any ancestor or child element to instantly navigate and inspect it.
- **Quick Copy**: One-click copy for CSS Selector, XPath, outer HTML, and all CSS rules.

### 2. Color Inspector
- **Automated Palette Extraction**: Scans all computed styles, inline styles, backgrounds, borders, and SVGs.
- **Format Switcher**: Instant switching and copying in HEX, RGB, RGBA, HSL, and HSLA.
- **Color Eyedropper**: Pick any color from the screen using the EyeDropper API.
- **Contrast Ratios**: Computes WCAG contrast ratio against white and black for every color.
- **Exporting**: One-click export to CSS Custom Properties, SCSS Variables, JSON, and Tailwind config format.
- **Favorites & Grouping**: Frequency-sorted color list and one-click bookmarking.

### 3. Typography Inspector
- **Web Font Detection**: Detects Google Fonts, Adobe / Typekit, custom web fonts, and system font families.
- **Typography Breakdown**: Font size, weight, line height, letter spacing, text transform, alignment, and color.
- **Live Preview Sandbox**: Test custom text in any detected font directly in the panel.
- **CSS & Embed Generator**: Copy font-family CSS declarations and Google Fonts `<link>` tags.

### 4. Layout Inspector
- **Box Model Visualizer**: Interactive values with click-to-copy.
- **Flexbox Analyzer**: Flex direction, justify-content, align-items, flex-wrap, and gap.
- **CSS Grid Analyzer**: Columns, rows, gap, and template definitions.
- **Stacking & Position**: Position property, z-index, and overflow indicators.
- **Responsive Breakpoint Detector**: Shows live viewport width and active Tailwind/CSS breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).

### 5. Assets & Media Inspector
- **Media Catalog**: Scans `<img>`, `<picture>`, `<svg>`, CSS `background-image`, `<video>`, and `<audio>`.
- **Dimensions**: Compares natural dimensions vs. rendered dimensions.
- **Type Filtering**: Filter by Images, SVGs, Backgrounds, and Media.
- **Quick Actions**: Copy URL, download asset, and locate on page.

### 6. Accessibility (A11y) Analyzer
- **Automated WCAG 2.1 Audit**:
  - Image alt attribute verification (missing alt, empty decorative alt).
  - Heading hierarchy validation (H1-H6 ordering, skipped levels).
  - Unlabeled buttons and empty interactive links.
  - Form input label and `aria-label` checks.
  - Missing `lang` attribute on `<html>`.
- **Health Score (0-100%)**: Categorized into Errors, Warnings, and Info.
- **Click to Highlight**: Click any issue to scroll to and select the culprit element on the page.

### 7. DOM Explorer
- **Interactive DOM Tree**: Searchable, collapsible HTML tree structure.
- **Live Sync**: Hovering or clicking a tree node synchronizes with the page overlay and Element Inspector.

### 8. Developer Tools
- **CSS Generators**:
  - CSS Gradient Generator (linear, radial, angle slider, 3 color stops).
  - Box Shadow Generator (X, Y, blur, spread, color, inset preview).
  - Border Radius Generator (all 4 corners + live shape preview).
- **Converters**:
  - PX to REM Converter (configurable base font size).
  - JSON Formatter & Validator (with minify).
  - Lorem Ipsum Generator (paragraphs & words).

### 9. Responsive Preview
- **Device Presets**: Mobile (iPhone SE, iPhone 14 Pro), Tablet (iPad Mini, iPad Pro), Laptop, Desktop.
- **Custom Viewport**: Specify exact width and height.
- **Orientation Toggle**: One-click rotate between portrait and landscape.

### 10. Favorites & Collections
- Save favorite colors, typography rules, CSS snippets, and elements.
- Create custom named collections.
- Full JSON Export and Import capabilities.

### 11. Universal Language System (i18n)
- **Supported Out of the Box**: English (`en-US`) and Turkish (`tr-TR`).
- **Extensible Architecture**: Easily add languages by creating new files in `src/locales/` (e.g. `de-DE.json`, `fr-FR.json`, `ar-SA.json`).
- **RTL Support**: Built-in support for right-to-left layout direction (`dir="rtl"`).
- **Persistence**: Remembers user choice in `chrome.storage.local`.

---

## 🛠 Tech Stack

- **Framework**: React 19 / TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Build Tool**: Vite 8 + custom multi-target Chrome Extension bundler
- **Extension Standard**: Chrome Manifest V3 (Side Panel API, Scripting, Tabs, Storage)
- **Testing**: Vitest

---

## 🚀 Installation & Running in Chrome

1. **Clone & Build**:
   ```bash
   npm install
   npm run build
   ```

2. **Load in Google Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in the top-right corner)
   - Click **Load unpacked**
   - Select the `dist/` folder inside the `elemently` project directory.

3. **Open Elemently**:
   - Click the **Elemently** icon in your Chrome toolbar to open the **Side Panel**.
   - Navigate to any web page and click **Inspect Element**!

---

## 💻 Available Scripts

- `npm run build`: Bundles Side Panel, Popup, Content Script (IIFE), Background Service Worker, icons, and generates `dist/manifest.json`.
- `npm run dev`: Starts Vite development server.
- `npm test`: Runs Vitest unit & integration test suite.
- `npm run typecheck`: Runs TypeScript compiler check (`tsc --noEmit`).

---

## 📄 License

MIT © Thendra – Explore Every Element.

