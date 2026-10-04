# Changelog

All notable changes to **SVG Badge Builder** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Policy:** This file is the single source of truth for all project changes.
> The in-app `ChangelogModal.jsx` must mirror this file. See `docs/GOVERNANCE.md §5`.

---

## [v1.1.0] - 2026-10-04 — Polish and QA release

### Added
- DXBMARK orange theme in both light and dark modes
- GitHub is now the default preview background; README and Profile mock cards follow the selected background
- Help menu: documentation, issue reporting, contact, changelog, terms and privacy
- Standard Library: new Badge Builder Pro brand preset, corrected WaQtor Pro preset
- Naming dialogs replace browser prompts when saving presets, brand kits and packs
- Shields.io-equivalent Markdown for Bulk badges, with copy / copy SVG / download SVG per badge

### Changed
- Footer reduced to the copyright line; licence and third-party notices live in the repository
- Logo and favicon recoloured to the DXBMARK orange
- Exported SVG is clean (no editor-only attributes) and uses rounded coordinates
- Text width is measured with the browser, so badge text no longer overflows its segment

### Fixed
- PNG export blocked by the Content Security Policy (blob: images)
- Outline slider showed NaN and outline colour was empty on new badges
- Packs and Bulk produced NaN SVG values for partial configs
- Workspace backup and restore keys did not match
- Text Fit diagnostic used stale dimensions and warned on valid badges
- Horizontal page scroll on small screens and in the Bulk tab
- Deprecated MUI props (Grid, Stack, InputProps, PaperProps) replaced

---

## [v1.0.0] - 2026-04-25 — Initial Public Release

### Added

#### Core Badge Editor
- Live SVG badge preview with instant rendering
- Full badge customization — width, height, border radius, outline
- Independent left/right text controls with font family and weight selection
- Full color controls for backgrounds and text per section
- Gradient support with custom start/end color pickers
- Built-in icon presets with positioning and scaling controls
- Custom SVG icon upload support (max 500 KB, sanitized on load)
- Custom image icon URL support
- Smart auto-width and smart-align layout engine
- Drag-to-reposition text and icon elements on the live preview

#### Export
- SVG export — downloads as a valid `.svg` file
- PNG raster export at 1× and 2× resolution
- Copy SVG source code to clipboard
- Copy README Markdown snippet (GitHub `img.shields.io` badge syntax)
- Copy HTML embed snippet (inline Base64 SVG `<img>` tag)
- Copy JSON config for portability
- Export badge config as `.json` file
- Shareable URL — encodes full badge config into a URL hash

#### Presets & Brand Kits
- 30+ built-in badge presets across categories: Style, Tech Stack, Status/CI, Brand, Minimalist, Gradients
- Save and manage custom presets (persisted to `localStorage`)
- Delete custom presets
- Brand Kit system — save, apply, duplicate, delete named visual themes
- Export and import Brand Kits as JSON
- Apply brand to current badge or to all local badges in a pack

#### Badge Pack Builder
- Create a pack by adding the current badge
- Reorder badges within a pack (Move Up / Move Down)
- Duplicate individual pack items
- Delete individual pack items
- Clear entire pack (with confirmation dialog)
- Pack output modes: Inline Markdown, Stacked Markdown, HTML, Table Markdown
- Copy full pack output to clipboard
- Save pack to `localStorage` with a custom name
- Export pack as `.json` file
- Import pack from `.json` file
- Apply current brand colours to all local badges in pack
- 7 built-in packs with dynamic input resolution:
  - Developer Profile Pack
  - React Project Pack
  - Python Package Pack
  - Django Project Pack
  - Docker Project Pack
  - CI/CD Pack
  - Open Source Pack
- Built-in pack loader modal (prompts for owner, repo, branch, workflow, etc.)

#### GitHub Tab
- Project Repo badge generator: Actions CI, Codecov, Stars, Forks, Issues, License
- Developer Profile README generator with tech stack badges and stats cards
- URL path segment sanitisation — trims whitespace and normalises spaces
- Warning alert when Owner or Repository fields are empty
- Copy individual badges or all repo badges at once

#### Source Panel
- Tabbed output panel: SVG, Markdown, HTML, JSON, GH README, Preview
- README Preview tab — live mock GitHub README render showing the badge in context
- Expand / Collapse code view
- Per-tab byte size indicator
- Copy button per tab

#### Diagnostics
- Build Diagnostics panel with Shields.io-standard compliance checks
- Warnings for oversized dimensions, low contrast, missing text, broken configs

#### Persistence
- Auto-save current badge config to `localStorage` on every change
- Auto-restore badge config on page refresh
- Saved presets survive page refresh
- Brand kits survive page refresh
- Badge packs survive page refresh
- Workspace export / import (presets + brands + config as a single JSON)

#### UI & UX
- Dark Mode / Light Mode toggle
- Professional Material UI v9 theme (Minimal Dashboard aesthetic)
- Reset to Demo button in header toolbar
- Shareable URL via config hash encoding
- Version chip in header
- Changelog modal (in-app, mirrors this file)
- AppBar with GitHub link, workspace sync, dark mode toggle, and export CTA
- Responsive layout for desktop and tablet

#### Technical
- Decoupled SVG renderer (`svgRenderer.ts`) — pure TypeScript, zero React/MUI dependencies
- Safe XML escaping on all user-supplied text (`escapeXml`)
- Numeric input clamping (`sanitize`) — prevents 0-width, negative, or overflow values
- SVG upload sanitisation — `<script>` tags stripped on load (non-negotiable)
- 500 KB hard limit on custom SVG uploads
- Icon scale clamped to `0.1–3.0`
- Open Graph, Twitter Card & JSON-LD structured metadata

---

Built with ❤️ by [Tariq Said](https://portfolio.dxbmark.com/)
