# Badge Builder Pro: Unified Brand Governance

## Introduction
The **Unified Brand Governance** outlines strict policies, data structures, and architectural rules to ensure consistency, quality, and aesthetic excellence across the **Badge Builder Pro** ecosystem.

## 1. Unified Brand Principle
The core of Badge Builder Pro is to provide developers with *premium, consistent, and beautiful* badges. To achieve this, all design choices must flow through a centralized **Brand Kit** structure.

- **No Ad-hoc Styling:** Hardcoded hex values or random paddings inside React components are forbidden.
- **Single Source of Truth:** `src/constants/brands.js` and `src/constants/presets.js` serve as the absolute truth for styling.
- **Fallback Chains:** All brand configurations must have intelligent fallbacks (e.g., if a gradient is disabled, `primary` and `secondary` colors take over).

## 2. Core Data Models

### 2.1 The Brand Kit Schema
A Brand Kit represents a complete visual identity. It must strictly adhere to this schema:

```typescript
type BrandKit = {
  id: string;             // Kebab-case identifier (e.g. 'react-blue')
  name: string;           // Human-readable name
  colors: {
    primary: string;      // Used for left section background
    secondary: string;    // Used for right section background
    textLight: string;    // Primary text color on dark backgrounds
    textDark: string;     // Primary text color on light backgrounds
    gradientStart: string;// Gradient start color
    gradientEnd: string;  // Gradient end color
    border: string;       // Outline color
  };
  typography: {
    fontFamily: string;   // Web-safe font family string
  };
  geometry: {
    radius: number;       // Corner rounding (0 for sharp, 20+ for pill)
    borderWidth: number;  // Outline stroke width
  };
  useGradient: boolean;   // Flag to enable/disable gradient mode
};
```

### 2.2 The Icon Asset Protocol
All icons must be localized within the project using the `ICON_LIBRARY`.
- **Validation:** Uploaded SVGs must be sanitized, and all `<script>` tags completely purged.
- **Max Size:** Custom SVG uploads are strictly capped at 500KB.
- **Scaling Limits:** Icon scales must be clamped between `0.1` and `3.0`.

## 3. Implementation Rules

1. **State Independence (Phase 1 legacy):** The SVG engine (`svgRenderer.ts`) must never import React or Material UI. It remains a pure function relying only on standard browser APIs or pure data.
2. **Component Isolation:** UI components like `BrandTab.jsx` or `IconTab.jsx` must not calculate SVG geometry. They only update the `config` state.
3. **Data Immutability:** When applying a brand kit to the canvas, the object must be deeply copied or mapped properly to avoid reference contamination.

## 4. Submission & Contribution
Badge Builder Pro is proprietary (see `LICENSE`). Changes are made by DXBMARK LLC only; external pull requests are not accepted. The rules below apply to maintainers.

When adding a new Built-in Brand Kit to `src/constants/brands.js`:
- The color palette must have a high contrast ratio to guarantee readability.
- The ID must be unique.
- The kit must undergo visual testing in both light and dark backgrounds via the Live Preview panel.

## 5. Changelog Policy

`CHANGELOG.md` (in the repository root) is the **single source of truth** for all project changes.

### Rules
- **Every change must be recorded** — features, fixes, refactors, and governance updates all require a changelog entry before merging.
- **`CHANGELOG.md` is the master file.** Any secondary changelog representation (e.g., `ChangelogModal.jsx` in the UI) must mirror `CHANGELOG.md` — never the other way around.
- Entries follow the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format with sections: `Added`, `Changed`, `Fixed`, `Removed`.
- Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html): `MAJOR.MINOR.PATCH`.
- The newest version always appears **first** in the file.
- Each entry must include the release date in `YYYY-MM-DD` format.
- Do **not** edit a previously published version's entries — create a new version entry instead.

---
Built with ❤️ by [Tariq Said](https://portfolio.dxbmark.com/)
